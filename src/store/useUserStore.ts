import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  uid: string;
  name: string;
  email: string;
  role: string;
  token: string;
  photoURL?: string;
  mobile?: string;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      uid: "",
      name: "",
      email: "",
      role: "guest",
      token: "",
      photoURL: "",
      mobile: "",
      setUser: (userData) => set((state) => ({ ...state, ...userData })),
      clearUser: () =>
        set({
          uid: "",
          name: "",
          email: "",
          role: "guest",
          token: "",
          photoURL: "",
          mobile: "",
        }),
      isAuthenticated: () => !!get().uid,
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
        photoURL: state.photoURL,
        mobile: state.mobile,
      }), // Persist specific fields
    },
  ),
);
