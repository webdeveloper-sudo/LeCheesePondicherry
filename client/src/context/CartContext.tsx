"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { products as staticProducts, Product } from "@/data/products";
import { blogs as staticBlogs, BlogPost } from "@/data/blogs";
import { cartAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { FETCH_MODE } from "@/config";
import axios from "axios";

export interface CartItem {
  productId: string;
  quantity: number;
  weight: string;
  price: number; // Added price to store weight-based price
  selected?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    productId: string,
    quantity: number,
    weight: string,
    price: number,
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  updateWeight: (index: number, weight: string, price: number) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  totalItems: number;
  subtotal: number;
  totalWeight: number;
  loading: boolean;
  toggleSelectItem: (index: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  syncWithBackend: () => Promise<void>;
  isServerDown: boolean;
  allProducts: Product[];
  allBlogs: any[]; // Changed to any to handle internal mapping or keep as BlogPost
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isDynamicId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);
  const { uid, token, isAuthenticated, updateCartCount } = useUserStore();

  const CART_KEY = `lepondy-cart-${FETCH_MODE}`;

  // Load cart from localStorage on mount (only if guest or first load)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // STRICT FILTERING: Remove items that don't match the current mode
        const isDynamic = FETCH_MODE === "dynamic";
        const filtered = parsed.filter((item: any) => 
          isDynamic ? isDynamicId(item.productId) : !isDynamicId(item.productId)
        );
        console.log(`CartProvider: Initial local load [${FETCH_MODE}] (Filtered: ${parsed.length} -> ${filtered.length})`, filtered);
        setItems(filtered);
      } catch (e) {
        console.error("CartProvider: Failed to parse local cart", e);
      }
    } else {
      setItems([]); // Clear if no items for this mode
    }
  }, [FETCH_MODE]);

  // Effect to handle user transitions (Login/Logout)
  useEffect(() => {
    if (!mounted) return;

    const isCurrentlyAuth = !!uid && !!token;
    if (isCurrentlyAuth) {
      if (FETCH_MODE === "dynamic") {
        syncWithBackend();
      }
    } else {
      // Guest: Items are managed by mode-specific storage, 
      // but let's clear if completely logged out (or keep them?)
      // The user wants strict duality, so let's keep guest items in their respective mode buckets.
    }
  }, [uid, token, mounted]);

  // Save cart to localStorage and update global count
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      updateCartCount(totalItems);
    }
  }, [items, mounted, updateCartCount, FETCH_MODE]);

  const [allProducts, setAllProducts] = useState<Product[]>(
    FETCH_MODE === "static" ? staticProducts : [],
  );
  const [allBlogs, setAllBlogs] = useState<any[]>(
    FETCH_MODE === "static" ? staticBlogs : [],
  );

  useEffect(() => {
    if (FETCH_MODE !== "dynamic") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Products and Blogs in parallel
        const [productsRes, blogsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { timeout: 5000 }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`, { timeout: 5000 })
        ]);

        if (productsRes.data) {
          const fetchedData = productsRes.data.data || productsRes.data;
          const mappedProducts = fetchedData.map((p: any) => {
            let hash = 0;
            const id = p._id || "";
            for (let i = 0; i < id.length; i++) {
              hash = id.charCodeAt(i) + ((hash << 5) - hash);
            }
            const assignedRating = 4.0 + (Math.abs(hash) % 6) / 10;
            return {
              ...p,
              id: p._id,
              rating: p.rating && p.rating > 0 ? p.rating : assignedRating,
            };
          });
          setAllProducts(mappedProducts);
        }

        if (blogsRes.data.success) {
          const fetchedBlogs = blogsRes.data.data || [];
          const publishedBlogs = fetchedBlogs
            .filter((b: any) => b.isPublished !== false)
            .map((b: any) => ({
              ...b,
              id: b._id,
              slug: b.slug || b._id,
            }));
          setAllBlogs(publishedBlogs);
        }
        
        setIsServerDown(false);
      } catch (error: any) {
        console.error("CartProvider: Failed to fetch dynamic data, falling back to static:", error);
        
        // Check if it's a network error or connection timeout
        if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
          setIsServerDown(true);
          // Fallback to static data
          setAllProducts(staticProducts);
          setAllBlogs(staticBlogs.map(b => ({ ...b, _id: b.id, slug: b.id })));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProduct = (id: string) => allProducts.find((p) => p.id === id);

  // Sync with backend when user logs in
  const syncWithBackend = async () => {
    if (!isAuthenticated()) return;

    setLoading(true);
    try {
      const result = await cartAPI.getCart();
      if (result.success && result.data) {
        const backendItems = result.data.cart.map((item: any) => {
          const product = allProducts.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            weight: item.weight || "200g",
            price: item.price || (product ? product.price : 0),
            selected: true,
          };
        });

        console.log("CartProvider: Backend cart items", backendItems);

        // If local cart is empty, just use backend
        if (items.length === 0) {
          setItems(backendItems);
          return;
        }

        // Logic to merge local cart into backend if desired
        const localOnly = items.filter(
          (local) => !backendItems.find((b) => b.productId === local.productId && b.weight === local.weight),
        );

        if (localOnly.length > 0) {
          console.log(
            "CartProvider: Merging local items to backend",
            localOnly,
          );
          for (const item of localOnly) {
            await cartAPI.addToCart(item.productId, item.quantity, item.weight, item.price);
          }
        }

        const mergedItems = [...backendItems, ...localOnly];
        setItems(mergedItems);
      }
    } catch (error) {
      console.error("Failed to sync cart with backend:", error);
    } finally {
      setLoading(false);
    }
  };


  const addToCart = async (
    productId: string,
    quantity: number,
    weight: string,
    price: number,
  ) => {
    // Update local state immediately
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.weight === weight,
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          price: price, 
        };
        return updated;
      }

      return [...prev, { productId, quantity, weight, price, selected: true }];
    });

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      try {
        await cartAPI.addToCart(productId, quantity, weight, price);
      } catch (error) {
        console.error("Failed to sync cart addition with backend:", error);
      }
    }
  };

  const removeFromCart = async (index: number) => {
    const item = items[index];
    setItems((prev) => prev.filter((_, i) => i !== index));

    // Sync with backend if authenticated
    if (isAuthenticated() && item) {
      try {
        await cartAPI.removeFromCart(item.productId, item.weight);
      } catch (error) {
        console.error("Failed to sync cart removal with backend:", error);
      }
    }
  };

  const updateQuantity = async (index: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(index);
      return;
    }

    const item = items[index];
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });

    // Sync with backend if authenticated
    if (isAuthenticated() && item) {
      try {
        await cartAPI.updateCartItem(item.productId, quantity, item.weight);
      } catch (error) {
        console.error("Failed to sync cart update with backend:", error);
      }
    }
  };

  const clearCart = async () => {
    console.log("🛒 CartContext: clearCart called");
    setItems([]);

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error("Failed to sync cart clear with backend:", error);
      }
    }
  };

  const updateWeight = async (index: number, weight: string, price: number) => {
    setItems((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], weight, price };
      }
      return updated;
    });
  };

  const toggleSelectItem = (index: number) => {
    setItems((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          selected: !updated[index].selected,
        };
      }
      return updated;
    });
  };

  const toggleSelectAll = (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const selectedItems = items.filter((item) => item.selected !== false);

  const totalItemsForCheckout = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const subtotal = selectedItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const totalWeight = selectedItems.reduce((sum, item) => {
    let weightInGrams = 0;
    const weightStr = item.weight.toLowerCase();
    if (weightStr.endsWith("kg")) {
      weightInGrams = parseFloat(weightStr) * 1000;
    } else if (weightStr.endsWith("g")) {
      weightInGrams = parseFloat(weightStr);
    }
    return sum + weightInGrams * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateWeight,
        clearCart,
        getProduct,
        totalItems: totalItemsForCheckout,
        subtotal,
        totalWeight,
        loading,
        toggleSelectItem,
        toggleSelectAll,
        syncWithBackend,
        isServerDown,
        allProducts,
        allBlogs,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
