"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { products, Product } from "@/data/products";
import { cartAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

export interface CartItem {
  productId: string;
  quantity: number;
  weight: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity: number, weight: string) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getProduct: (id: string) => Product | undefined;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  syncWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { uid, token, isAuthenticated, updateCartCount } = useUserStore();

  // Load cart from localStorage on mount (only if guest or first load)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lepondy-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("CartProvider: Initial local load", parsed);
        setItems(parsed);
      } catch (e) {
        console.error("CartProvider: Failed to parse local cart", e);
      }
    }
  }, []);
  // Effect to handle user transitions (Login/Logout)
  useEffect(() => {
    if (!mounted) return;

    const isCurrentlyAuth = !!uid && !!token;
    console.log("=== CART SYSTEM DIAGNOSTIC ===");
    console.log("User UID:", uid);
    console.log("Auth Status:", isCurrentlyAuth ? "LOGGED IN" : "GUEST");
    console.log("Current Cart Items:", items);
    console.log("===============================");

    if (isCurrentlyAuth) {
      syncWithBackend();
    } else {
      setItems([]);
      localStorage.removeItem("lepondy-cart");
    }
  }, [uid, token, mounted]);

  // Save cart to localStorage and update global count
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("lepondy-cart", JSON.stringify(items));
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      updateCartCount(totalItems);
      console.log("CartProvider: State persisted", {
        itemsCount: items.length,
        totalQty: totalItems,
      });
    }
  }, [items, mounted, updateCartCount]);

  // Sync with backend when user logs in
  const syncWithBackend = async () => {
    if (!isAuthenticated()) return;

    setLoading(true);
    try {
      // Get cart from backend
      const result = await cartAPI.getCart();
      console.log("CartProvider: Backend sync result", result);

      if (result.success && result.data) {
        const backendItems = result.data.cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          weight: "250g", // Default weight
        }));

        console.log("CartProvider: Backend cart items", backendItems);

        // If local cart is empty, just use backend
        if (items.length === 0) {
          setItems(backendItems);
          return;
        }

        // Logic to merge local cart into backend if desired,
        // or just prioritize backend if multiple devices are used.
        // For now, let's merge local into backend for a seamless experience.
        const localOnly = items.filter(
          (local) => !backendItems.find((b) => b.productId === local.productId),
        );

        if (localOnly.length > 0) {
          console.log(
            "CartProvider: Merging local items to backend",
            localOnly,
          );
          for (const item of localOnly) {
            await cartAPI.addToCart(item.productId, item.quantity);
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

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const addToCart = async (
    productId: string,
    quantity: number,
    weight: string,
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
        };
        return updated;
      }

      return [...prev, { productId, quantity, weight }];
    });

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      try {
        await cartAPI.addToCart(productId, quantity);
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
        await cartAPI.removeFromCart(item.productId);
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
        await cartAPI.updateCartItem(item.productId, quantity);
      } catch (error) {
        console.error("Failed to sync cart update with backend:", error);
      }
    }
  };

  const clearCart = async () => {
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getProduct,
        totalItems,
        subtotal,
        loading,
        syncWithBackend,
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
