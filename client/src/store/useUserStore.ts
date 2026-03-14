import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistAPI, cartAPI, browsingAPI } from "@/lib/api";
import { FETCH_MODE } from "@/config";

const isDynamicId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

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
  preferences: any[]; // Current mode's list
  staticPreferences: any[];
  dynamicPreferences: any[];

  // Shopping state
  cartItemCount: number;
  wishlistCount: number;
  wishlistIds: string[]; // Current mode's list
  staticWishlistIds: string[];
  dynamicWishlistIds: string[];
  recentlyViewed: string[]; // Current mode's list
  staticRecentlyViewed: string[];
  dynamicRecentlyViewed: string[];

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
      staticPreferences: [],
      dynamicPreferences: [],
      cartItemCount: 0,
      wishlistCount: 0,
      wishlistIds: [],
      staticWishlistIds: [],
      dynamicWishlistIds: [],
      recentlyViewed: [],
      staticRecentlyViewed: [],
      dynamicRecentlyViewed: [],

      // Set user data
      setUser: (userData) => {
        console.log(
          "setUser: Setting complete user data in Zustand store",
          userData,
        );
        // Important: When setting from backend, we update dynamic lists
        set((state) => ({ 
          ...state, 
          ...userData,
          dynamicWishlistIds: userData.wishlistIds || state.dynamicWishlistIds,
          dynamicPreferences: userData.preferences || state.dynamicPreferences,
          wishlistIds: FETCH_MODE === "dynamic" ? (userData.wishlistIds || state.wishlistIds) : state.wishlistIds,
          preferences: FETCH_MODE === "dynamic" ? (userData.preferences || state.preferences) : state.preferences,
          wishlistCount: FETCH_MODE === "dynamic" ? (userData.wishlistCount ?? state.wishlistCount) : state.wishlistCount
        }));
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
          wishlistCount: FETCH_MODE === "static" ? get().wishlistCount : 0,
          wishlistIds: FETCH_MODE === "static" ? get().wishlistIds : [],
          dynamicWishlistIds: [],
          dynamicRecentlyViewed: [],
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
            
            const isDynamic = FETCH_MODE === "dynamic";
            set((state) => ({
              name: user.name || "",
              email: user.email,
              mobile: user.mobile || "",
              countryCode: user.countryCode || "+91",
              photoURL: user.profilePhoto || "",
              role: user.role,
              addresses: user.addresses || [],
              dynamicPreferences: user.preferences || [],
              preferences: isDynamic ? (user.preferences || []) : state.staticPreferences,
              // Partitioning
              cartItemCount: isDynamic ? (user.cartItemCount || 0) : state.cartItemCount,
              wishlistCount: isDynamic ? (user.wishlistCount || 0) : state.wishlistCount,
              dynamicWishlistIds: isDynamic ? (user.wishlistIds || []) : state.dynamicWishlistIds,
              wishlistIds: isDynamic ? (user.wishlistIds || []) : state.wishlistIds,
            }));
          }
        } catch (error) {
          console.error("Profile sync error:", error);
        }
      },

      // Toggle wishlist item
      toggleWishlist: async (productId: string) => {
        const state = get();
        const isDynamic = FETCH_MODE === "dynamic";
        const currentIds = isDynamic ? state.dynamicWishlistIds : state.staticWishlistIds;
        const isInWishlist = currentIds.includes(productId);

        if (!state.isAuthenticated()) {
          // For guests, store in local state only
          let newIds;
          let newCount;
          if (isInWishlist) {
            newIds = currentIds.filter((id) => id !== productId);
            newCount = Math.max(0, state.wishlistCount - 1);
          } else {
            newIds = [...currentIds, productId];
            newCount = state.wishlistCount + 1;
          }

          if (isDynamic) {
            set({
              dynamicWishlistIds: newIds,
              wishlistIds: newIds,
              wishlistCount: newCount,
            });
          } else {
            set({
              staticWishlistIds: newIds,
              wishlistIds: newIds,
              wishlistCount: newCount,
            });
          }
          return !isInWishlist;
        }

        // For logged-in users, call API (only for dynamic products usually, but we handle both)
        const result = await wishlistAPI.toggleWishlist(productId);
        if (result.success && result.data) {
          const actuallyIn = result.data.isInWishlist;
          const newCount = result.data.count;
          
          if (isDynamic) {
            const newIds = actuallyIn 
              ? [...state.dynamicWishlistIds, productId]
              : state.dynamicWishlistIds.filter(id => id !== productId);
            set({
              dynamicWishlistIds: newIds,
              wishlistIds: newIds,
              wishlistCount: newCount,
            });
          } else {
             // For static products even if logged in, we keep them local if the API doesn't support them well
             // But usually dynamic mode is for DB. 
             const newIds = actuallyIn 
              ? [...state.staticWishlistIds, productId]
              : state.staticWishlistIds.filter(id => id !== productId);
             set({
              staticWishlistIds: newIds,
              wishlistIds: newIds,
              wishlistCount: newCount,
             });
          }
          return actuallyIn;
        }
        return isInWishlist;
      },

      // Check if product is in wishlist
      isInWishlist: (productId: string) => {
        const state = get();
        const list = FETCH_MODE === "dynamic" ? state.dynamicWishlistIds : state.staticWishlistIds;
        return list.includes(productId);
      },

      // Fetch wishlist from server
      fetchWishlist: async () => {
        if (!get().isAuthenticated() || FETCH_MODE !== "dynamic") return;

        const result = await wishlistAPI.getWishlist();
        if (result.success && result.data) {
          const ids = result.data.wishlist.map((item: any) => item.productId);
          
          // Only update if IDs have changed to prevent infinite loops in subscribers
          const currentIds = get().dynamicWishlistIds;
          if (JSON.stringify(ids) !== JSON.stringify(currentIds)) {
            set({
              dynamicWishlistIds: ids,
              wishlistIds: ids,
              wishlistCount: result.data.count,
            });
          }
        }
      },

      // Update cart count
      updateCartCount: (count: number) => set({ cartItemCount: count }),

      // Track product view
      trackProductView: async (productId: string) => {
        const state = get();
        const isDynamic = FETCH_MODE === "dynamic";
        const currentViewed = isDynamic ? state.dynamicRecentlyViewed : state.staticRecentlyViewed;
        const currentPrefs = isDynamic ? state.dynamicPreferences : state.staticPreferences;

        // Strict filtering: Don't track if the ID doesn't match the mode
        const idMatchesMode = isDynamic ? isDynamicId(productId) : !isDynamicId(productId);
        if (!idMatchesMode) return;

        // Update local recently viewed
        const filtered = currentViewed.filter((id) => id !== productId);
        const newViewed = [productId, ...filtered].slice(0, 5);
        
        // Update local preferences (simple LRU of 10 items for static mode)
        const filteredPrefs = currentPrefs.filter((p: any) => (p.productId || p.id || p) !== productId);
        const newPrefs = [{ productId, viewedAt: new Date().toISOString() }, ...filteredPrefs].slice(0, 10);

        if (isDynamic) {
          set({ 
            dynamicRecentlyViewed: newViewed, 
            recentlyViewed: newViewed,
            dynamicPreferences: newPrefs,
            preferences: newPrefs
          });
        } else {
          set({ 
            staticRecentlyViewed: newViewed, 
            recentlyViewed: newViewed,
            staticPreferences: newPrefs,
            preferences: newPrefs
          });
        }

        if (state.isAuthenticated() && isDynamic) {
          const result = await browsingAPI.trackProductView(productId);
          if (result.success && result.data) {
            set({ 
              dynamicPreferences: result.data.preferences,
              preferences: result.data.preferences 
            });
          }
        }
      },

      // Get recently viewed product IDs
      getRecentlyViewedIds: () => {
        const isDynamic = FETCH_MODE === "dynamic";
        const list = isDynamic ? get().dynamicRecentlyViewed : get().staticRecentlyViewed;
        // Double check filtering
        return list.filter(id => isDynamic ? isDynamicId(id) : !isDynamicId(id));
      },
    }),
    {
      name: "lepondy-user-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isDynamic = FETCH_MODE === "dynamic";

          // --- MIGRATION & CLEANUP LOGIC ---
          // 1. If dynamic list has static IDs, move them to static list
          // 2. If static list has dynamic IDs, move them to dynamic list
          const allKnownIds = Array.from(new Set([
            ...state.wishlistIds,
            ...state.staticWishlistIds,
            ...state.dynamicWishlistIds
          ]));

          state.staticWishlistIds = allKnownIds.filter(id => !isDynamicId(id));
          state.dynamicWishlistIds = allKnownIds.filter(id => isDynamicId(id));

          // Same for recently viewed
          const allViewedIds = Array.from(new Set([
            ...state.recentlyViewed,
            ...state.staticRecentlyViewed,
            ...state.dynamicRecentlyViewed
          ]));
          state.staticRecentlyViewed = allViewedIds.filter(id => !isDynamicId(id)).slice(0, 5);
          state.dynamicRecentlyViewed = allViewedIds.filter(id => isDynamicId(id)).slice(0, 5);

          // Partition preferences if not already partitioned
          if (!state.staticPreferences || !state.dynamicPreferences) {
            const allPrefs = state.preferences || [];
            state.staticPreferences = allPrefs.filter((p: any) => {
              const id = p.productId || p.id || p;
              return !isDynamicId(id);
            });
            state.dynamicPreferences = allPrefs.filter((p: any) => {
              const id = p.productId || p.id || p;
              return isDynamicId(id);
            });
          }

          // 3. Set current active list based on mode
          state.wishlistIds = isDynamic ? state.dynamicWishlistIds : state.staticWishlistIds;
          state.recentlyViewed = isDynamic ? state.dynamicRecentlyViewed : state.staticRecentlyViewed;
          state.preferences = isDynamic ? state.dynamicPreferences : state.staticPreferences;
          
          // 4. Force count to be based on CURRENT mode only
          state.wishlistCount = state.wishlistIds.length;
        }
      },
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
        staticPreferences: state.staticPreferences,
        dynamicPreferences: state.dynamicPreferences,
        cartItemCount: state.cartItemCount,
        wishlistCount: state.wishlistCount,
        wishlistIds: state.wishlistIds,
        staticWishlistIds: state.staticWishlistIds,
        dynamicWishlistIds: state.dynamicWishlistIds,
        recentlyViewed: state.recentlyViewed,
        staticRecentlyViewed: state.staticRecentlyViewed,
        dynamicRecentlyViewed: state.dynamicRecentlyViewed,
      }),
    },
  ),
);
