// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const storage = localStorage.getItem("lepondy-user-storage");
  if (storage) {
    const parsed = JSON.parse(storage);
    if (parsed.state?.token) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsed.state.token}`,
      };
    }
  }
  return { "Content-Type": "application/json" };
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
        error: data.message,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============ AUTH API ============
export const authAPI = {
  // Send OTP for signup
  sendOTP: async (email: string, purpose: string = "signup") => {
    return apiRequest<{ message: string; otp?: string }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    });
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string, purpose: string = "signup") => {
    return apiRequest<{ message: string; tempToken: string }>(
      "/api/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({ email, otp, purpose }),
      },
    );
  },

  // Set password after OTP verification
  setPassword: async (email: string, password: string, tempToken: string) => {
    return apiRequest<{
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/api/auth/set-password", {
      method: "POST",
      body: JSON.stringify({ email, password, tempToken }),
    });
  },

  // Complete profile after signup
  completeProfile: async (data: {
    name?: string;
    mobile?: string;
    address?: string;
    pincode?: string;
    city?: string;
    state?: string;
    countryCode?: string;
  }) => {
    return apiRequest("/api/auth/complete-profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    return apiRequest<{
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        mobile: string;
        profilePhoto: string;
        role: string;
        cartItemCount: number;
        wishlistCount: number;
        preferences: any[];
      };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest<{
      user: {
        id: string;
        email: string;
        name: string;
        mobile: string;
        countryCode: string;
        profilePhoto: string;
        role: string;
        addresses: any[];
        preferences: any[];
        cartItemCount: number;
        wishlistCount: number;
      };
    }>("/api/auth/me", { method: "GET" });
  },

  // Logout
  logout: async () => {
    return apiRequest("/api/auth/logout", { method: "POST" });
  },
};

// ============ CART API ============
export const cartAPI = {
  // Get cart
  getCart: async () => {
    return apiRequest<{
      cart: Array<{ productId: string; quantity: number; addedAt: string }>;
      itemCount: number;
    }>("/api/cart", { method: "GET" });
  },

  // Add to cart
  addToCart: async (productId: string, quantity: number = 1) => {
    return apiRequest("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Update cart item
  updateCartItem: async (productId: string, quantity: number) => {
    return apiRequest("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Remove from cart
  removeFromCart: async (productId: string) => {
    return apiRequest(`/api/cart/remove/${productId}`, { method: "DELETE" });
  },

  // Clear cart
  clearCart: async () => {
    return apiRequest("/api/cart/clear", { method: "DELETE" });
  },
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  // Get wishlist
  getWishlist: async () => {
    return apiRequest<{
      wishlist: Array<{ productId: string; addedAt: string }>;
      count: number;
    }>("/api/wishlist", { method: "GET" });
  },

  // Add to wishlist
  addToWishlist: async (productId: string) => {
    return apiRequest("/api/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Toggle wishlist (add or remove)
  toggleWishlist: async (productId: string) => {
    return apiRequest<{
      action: "added" | "removed";
      isInWishlist: boolean;
      count: number;
    }>("/api/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string) => {
    return apiRequest(`/api/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
  },

  // Move to cart
  moveToCart: async (productId: string, quantity: number = 1) => {
    return apiRequest(`/api/wishlist/move-to-cart/${productId}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
  },
};

// ============ BROWSING/PREFERENCES API ============
export const browsingAPI = {
  // Track product view (updates browsing history & preferences)
  trackProductView: async (productId: string) => {
    return apiRequest<{
      preferences: Array<{ productId: string; viewedAt: string }>;
      recentlyViewed: Array<{ productId: string; viewedAt: string }>;
    }>("/api/browsing/track", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  // Get browsing history
  getBrowsingHistory: async (limit: number = 20, page: number = 1) => {
    return apiRequest<{
      browsingHistory: Array<{ productId: string; viewedAt: string }>;
      totalItems: number;
    }>(`/api/browsing/history?limit=${limit}&page=${page}`, { method: "GET" });
  },

  // Get preferences (last 5 viewed items)
  getPreferences: async () => {
    return apiRequest<{
      preferences: Array<{ productId: string; viewedAt: string }>;
    }>("/api/browsing/preferences", { method: "GET" });
  },

  // Clear browsing history
  clearHistory: async () => {
    return apiRequest("/api/browsing/history", { method: "DELETE" });
  },

  // Get recently viewed (works for both logged in and guests)
  getRecentlyViewed: async (limit: number = 10) => {
    return apiRequest<{
      recentlyViewed: Array<{ productId: string; viewedAt: string }>;
    }>(`/api/browsing/recently-viewed?limit=${limit}`, { method: "GET" });
  },
};

// ============ USER PROFILE API ============
export const userAPI = {
  // Get profile
  getProfile: async () => {
    return apiRequest("/api/user/profile", { method: "GET" });
  },

  // Update profile
  updateProfile: async (data: {
    name?: string;
    mobile?: string;
    profilePhoto?: string;
  }) => {
    return apiRequest("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Get addresses
  getAddresses: async () => {
    return apiRequest("/api/user/addresses", { method: "GET" });
  },

  // Add address
  addAddress: async (address: {
    type?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    isDefault?: boolean;
  }) => {
    return apiRequest("/api/user/address", {
      method: "POST",
      body: JSON.stringify(address),
    });
  },

  // Update address
  updateAddress: async (addressId: string, address: any) => {
    return apiRequest(`/api/user/address/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(address),
    });
  },

  // Delete address
  deleteAddress: async (addressId: string) => {
    return apiRequest(`/api/user/address/${addressId}`, {
      method: "DELETE",
    });
  },

  // Set default address
  setDefaultAddress: async (addressId: string) => {
    return apiRequest(`/api/user/address/${addressId}/default`, {
      method: "PUT",
    });
  },

  // Get order history
  getOrderHistory: async (limit: number = 10, page: number = 1) => {
    return apiRequest(`/api/user/orders?limit=${limit}&page=${page}`, {
      method: "GET",
    });
  },
};

// ============ ADMIN API ============
export const adminAPI = {
  // Authentication
  login: async (email: string, password: string) => {
    return apiRequest<{
      token: string;
      user: {
        id: string;
        email: string;
        role: string;
      };
    }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Product Management
  getProducts: async () => {
    return apiRequest<{ success: boolean; count: number; data: any[] }>(
      "/api/products",
      {
        method: "GET",
      },
    );
  },

  createProduct: async (productData: any) => {
    return apiRequest("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId: string, productData: any) => {
    return apiRequest(`/api/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId: string) => {
    return apiRequest(`/api/products/${productId}`, {
      method: "DELETE",
    });
  },

  // User Management
  getUsers: async () => {
    return apiRequest<{ success: boolean; count: number; users: any[] }>(
      "/api/user/all",
      {
        method: "GET",
      },
    );
  },

  // Order Management
  getOrders: async () => {
    return apiRequest<{ success: boolean; count: number; data: any[] }>(
      "/api/orders",
      {
        method: "GET",
      },
    );
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/api/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

export { API_BASE_URL, getAuthHeaders, apiRequest };
