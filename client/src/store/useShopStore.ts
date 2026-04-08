import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShopState {
  activeCategory: string;
  sortBy: string;
  searchTerm: string;
  isSearchOpen: boolean;
  setActiveCategory: (cat: string) => void;
  setSortBy: (sort: string) => void;
  setSearchTerm: (term: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  clearFilters: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      activeCategory: "all",
      sortBy: "featured",
      searchTerm: "",
      isSearchOpen: false,
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      clearFilters: () =>
        set({
          activeCategory: "all",
          sortBy: "featured",
          searchTerm: "",
          isSearchOpen: false,
        }),
    }),
    {
      name: "le-cheese-shop-storage", // name of the item in the storage (must be unique)
    }
  )
);
