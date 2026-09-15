import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShopState {
  activeCategory: string;
  sortBy: string;
  searchTerm: string;
  isSearchOpen: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  setActiveCategory: (cat: string) => void;
  setSortBy: (sort: string) => void;
  setSearchTerm: (term: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setMinRating: (rating: number | null) => void;
  setInStockOnly: (inStock: boolean) => void;
  clearFilters: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      activeCategory: "all",
      sortBy: "featured",
      searchTerm: "",
      isSearchOpen: false,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStockOnly: false,
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setIsSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
      setMinRating: (minRating) => set({ minRating }),
      setInStockOnly: (inStockOnly) => set({ inStockOnly }),
      clearFilters: () =>
        set({
          activeCategory: "all",
          sortBy: "featured",
          searchTerm: "",
          isSearchOpen: false,
          minPrice: null,
          maxPrice: null,
          minRating: null,
          inStockOnly: false,
        }),
    }),
    {
      name: "le-cheese-shop-storage", // name of the item in the storage (must be unique)
    }
  )
);


