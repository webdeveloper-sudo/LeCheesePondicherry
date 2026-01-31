import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistAPI, cartAPI, browsingAPI } from "@/lib/api";

interface UserState {
  // User info
  uid: string;
  name: string;
  email: string;
  role: string;
  token: string;
  loginAt?: number;
  photoURL?: string;
  mobile?: string;
  countryCode?: string;
  addresses: any[];
  preferences: any[];

  // Shopping state
  cartItemCount: number;
  wishlistCount: number;
  wishlistIds: string[];
  recentlyViewed: string[];

  // Actions
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  logout: () => Promise<void>;
  syncProfile: () => Promise<void>;

  // Wishlist actions
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;

  // Cart actions
  updateCartCount: (count: number) => void;

  // Browsing actions
  trackProductView: (productId: string) => Promise<void>;
  getRecentlyViewedIds: () => string[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      uid: "",
      name: "",
      email: "",
      role: "guest",
      token: "",
      photoURL: "",
      mobile: "",
      countryCode: "+91",
      addresses: [],
      preferences: [],
      cartItemCount: 0,
      wishlistCount: 0,
      wishlistIds: [],
      recentlyViewed: [],

      // Set user data
      setUser: (userData) => {
        console.log(
          "setUser: Setting complete user data in Zustand store",
          userData,
        );
        set((state) => ({ ...state, ...userData }));
      },

      // Clear user (logout helper)
      clearUser: () =>
        set({
          uid: "",
          name: "",
          email: "",
          role: "guest",
          token: "",
          photoURL: "",
          mobile: "",
          cartItemCount: 0,
          wishlistCount: 0,
          wishlistIds: [],
          recentlyViewed: [],
        }),

      // Check if authenticated
      isAuthenticated: () => !!get().token && !!get().uid,

      // Logout action
      logout: async () => {
        try {
          const { authAPI } = await import("@/lib/api");
          await authAPI.logout();
        } catch (error) {
          console.error("Logout API error:", error);
        } finally {
          get().clearUser();
          localStorage.removeItem("lepondy-user-storage");
        }
      },

      // Sync profile from backend
      syncProfile: async () => {
        if (!get().isAuthenticated()) return;

        try {
          const { authAPI } = await import("@/lib/api");
          const result = await authAPI.getMe();
          if (result.success && result.data?.user) {
            const user = result.data.user;
            console.log(
              "syncProfile: Received complete user dataset from backend",
              user,
            );
            set({
              name: user.name || "",
              email: user.email,
              mobile: user.mobile || "",
              countryCode: user.countryCode || "+91",
              photoURL: user.profilePhoto || "",
              role: user.role,
              addresses: user.addresses || [],
              preferences: user.preferences || [],
              cartItemCount: user.cartItemCount || 0,
              wishlistCount: user.wishlistCount || 0,
            });
            console.log(
              "syncProfile: Preferences saved in store:",
              user.preferences,
            );
          }
        } catch (error) {
          console.error("Profile sync error:", error);
        }
      },

      // Toggle wishlist item
      toggleWishlist: async (productId: string) => {
        // ... around line 115 in original file
        const state = get();
        if (!state.isAuthenticated()) {
          // For guests, store in local state only
          const isInWishlist = state.wishlistIds.includes(productId);
          if (isInWishlist) {
            set({
              wishlistIds: state.wishlistIds.filter((id) => id !== productId),
              wishlistCount: state.wishlistCount - 1,
            });
          } else {
            set({
              wishlistIds: [...state.wishlistIds, productId],
              wishlistCount: state.wishlistCount + 1,
            });
          }
          return !isInWishlist;
        }

        // For logged-in users, call API
        const result = await wishlistAPI.toggleWishlist(productId);
        if (result.success && result.data) {
          const isInWishlist = result.data.isInWishlist;
          if (isInWishlist) {
            set({
              wishlistIds: [...state.wishlistIds, productId],
              wishlistCount: result.data.count,
            });
          } else {
            set({
              wishlistIds: state.wishlistIds.filter((id) => id !== productId),
              wishlistCount: result.data.count,
            });
          }
          return isInWishlist;
        }
        return state.wishlistIds.includes(productId);
      },

      // Check if product is in wishlist
      isInWishlist: (productId: string) =>
        get().wishlistIds.includes(productId),

      // Fetch wishlist from server
      fetchWishlist: async () => {
        if (!get().isAuthenticated()) return;

        const result = await wishlistAPI.getWishlist();
        if (result.success && result.data) {
          set({
            wishlistIds: result.data.wishlist.map((item) => item.productId),
            wishlistCount: result.data.count,
          });
        }
      },

      // Update cart count
      updateCartCount: (count: number) => set({ cartItemCount: count }),

      // Track product view
      trackProductView: async (productId: string) => {
        const state = get();

        // Update local recently viewed
        const currentViewed = state.recentlyViewed.filter(
          (id) => id !== productId,
        );
        const newViewed = [productId, ...currentViewed].slice(0, 5);
        set({ recentlyViewed: newViewed });

        if (state.isAuthenticated()) {
          const result = await browsingAPI.trackProductView(productId);
          if (result.success && result.data) {
            console.log(
              "trackProductView: Preferences updated from server:",
              result.data.preferences,
            );
            set({ preferences: result.data.preferences });
          }
        }
      },

      // Get recently viewed product IDs
      getRecentlyViewedIds: () => get().recentlyViewed,
    }),
    {
      name: "lepondy-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        uid: state.uid,
        name: state.name,
        email: state.email,
        role: state.role,
        token: state.token,
        loginAt: state.loginAt,
        photoURL: state.photoURL,
        mobile: state.mobile,
        countryCode: state.countryCode,
        addresses: state.addresses,
        preferences: state.preferences,
        cartItemCount: state.cartItemCount,
        wishlistCount: state.wishlistCount,
        wishlistIds: state.wishlistIds,
        recentlyViewed: state.recentlyViewed,
      }),
    },
  ),
);
