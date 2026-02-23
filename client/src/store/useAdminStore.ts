import { create } from "zustand";
import { adminAPI } from "@/lib/api";

interface AdminState {
  products: any[];
  users: any[];
  orders: any[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchOrders: () => Promise<void>;

  createProduct: (productData: any) => Promise<boolean>;
  updateProduct: (productId: string, productData: any) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;

  updateOrder: (orderId: string, orderData: any) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  products: [],
  users: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.getProducts();
    if (result.success && result.data) {
      set({ products: result.data.data, isLoading: false });
    } else {
      set({
        error: result.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.getUsers();
    if (result.success && result.data) {
      set({ users: result.data.users, isLoading: false });
    } else {
      set({
        error: result.message || "Failed to fetch users",
        isLoading: false,
      });
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.getOrders();
    if (result.success && result.data) {
      set({ orders: result.data.data, isLoading: false });
    } else {
      set({
        error: result.message || "Failed to fetch orders",
        isLoading: false,
      });
    }
  },

  createProduct: async (productData: any) => {
    console.log("🌐 useAdminStore: Calling createProduct API...");
    set({ isLoading: true, error: null });
    const result = await adminAPI.createProduct(productData);
    set({ isLoading: false });
    if (result.success) {
      console.log("✅ useAdminStore: Create success, refreshing products list");
      // Re-fetch products to update list
      const adminState = useAdminStore.getState();
      adminState.fetchProducts();
      return true;
    } else {
      console.error("❌ useAdminStore: Create failed", result.message);
      set({ error: result.message || "Failed to create product" });
      return false;
    }
  },

  updateProduct: async (productId: string, productData: any) => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.updateProduct(productId, productData);
    set({ isLoading: false });
    if (result.success) {
      const adminState = useAdminStore.getState();
      adminState.fetchProducts();
      return true;
    } else {
      set({ error: result.message || "Failed to update product" });
      return false;
    }
  },

  deleteProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.deleteProduct(productId);
    set({ isLoading: false });
    if (result.success) {
      const adminState = useAdminStore.getState();
      adminState.fetchProducts();
      return true;
    } else {
      set({ error: result.message || "Failed to delete product" });
      return false;
    }
  },

  updateOrder: async (orderId: string, orderData: any) => {
    set({ isLoading: true, error: null });
    const result = await adminAPI.updateOrder(orderId, orderData);
    set({ isLoading: false });
    if (result.success) {
      const adminState = useAdminStore.getState();
      adminState.fetchOrders();
      return true;
    } else {
      set({ error: result.message || "Failed to update order" });
      return false;
    }
  },
}));
