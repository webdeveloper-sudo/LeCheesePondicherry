import { API_BASE_URL } from "@/config";


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
): Promise<{ 
  success: boolean; 
  data?: T; 
  message?: string; 
  error?: string;
  isNetworkError?: boolean;
}> {
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
        error: data.error || data.message || "Unknown error",
        data: data,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
      error: error instanceof Error ? error.message : "Unknown error",
      isNetworkError: true,
    };
  }
}

// Health Check
export const checkHealth = async () => {
  return apiRequest<{ success: boolean }>("/api/health", { method: "GET" });
};

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
  setPassword: async (
    email: string,
    password: string,
    tempToken: string,
    guestCart?: any[],
    guestWishlist?: string[]
  ) => {
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
      body: JSON.stringify({ email, password, tempToken, guestCart, guestWishlist }),
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
  login: async (
    email: string,
    password: string,
    guestCart?: any[],
    guestWishlist?: string[]
  ) => {
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
        wishlistIds: string[];
        preferences: any[];
      };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, guestCart, guestWishlist }),
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
        wishlistIds: string[];
      };
    }>("/api/auth/me", { method: "GET" });
  },

  // Authenticate with Google
  googleAuth: async (
    credential: string,
    guestCart?: any[],
    guestWishlist?: string[]
  ) => {
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
        wishlistIds: string[];
        preferences: any[];
      };
    }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential, guestCart, guestWishlist }),
    });
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
  addToCart: async (productId: string, quantity: number = 1, weight?: string, price?: number) => {
    return apiRequest("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, weight, price }),
    });
  },

  // Update cart item
  updateCartItem: async (productId: string, quantity: number, weight?: string) => {
    return apiRequest("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, quantity, weight }),
    });
  },

  // Remove from cart
  removeFromCart: async (productId: string, weight?: string) => {
    const query = weight ? `?weight=${encodeURIComponent(weight)}` : '';
    return apiRequest(`/api/cart/remove/${productId}${query}`, { method: "DELETE" });
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

// ============ ORDER API ============
export const orderAPI = {
  validateCoupon: async (couponCode: string, orderAmount: number) => {
    return apiRequest<{
      success: boolean;
      message?: string;
      data?: {
        couponCode: string;
        discountPercent: number;
        discountAmount: number;
        type: "first_time" | "flash_sale";
        requiresLoginForFinal?: boolean;
        message: string;
      };
    }>("/api/orders/validate-coupon", {
      method: "POST",
      body: JSON.stringify({ couponCode, orderAmount }),
    });
  },

  createOrder: async (orderData: any) => {
    return apiRequest<{
      success: boolean;
      message?: string;
      data: {
        payment_session_id: string;
        order_id: string;
      };
    }>("/api/orders/session", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  verifyPayment: async (orderId: string, orderData: any) => {
    return apiRequest<{
      success: boolean;
      message?: string;
      data: any;
    }>("/api/orders/verify", {
      method: "POST",
      body: JSON.stringify({ orderId, orderData }),
    });
  },

  getMyOrders: async () => {
    return apiRequest<{
      success: boolean;
      data: any[];
    }>("/api/orders/my-orders", {
      method: "GET",
    });
  },
};

// ============ SETTINGS API ============
export const settingsAPI = {
  getSettings: async () => {
    return apiRequest<{
      success: boolean;
      data: {
        flashSaleEnabled?: boolean;
        couponName?: string;
        validTime?: string | null;
        discountRate?: number;
        deliveryChargesEnabled?: boolean;
        firstTimeOffer?: {
          isEnabled: boolean;
          couponCode: string;
          discountPercent: number;
        };
      };
    }>("/api/settings", {
      method: "GET",
    });
  },

  updateSettings: async (settingsData: any) => {
    return apiRequest<{
      success: boolean;
      message?: string;
      data: any;
    }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    });
  },
};

// ============ ENQUIRY & LEAD API ============
export const enquiryAPI = {
  submitContact: async (data: { name: string; email: string; message: string; phone?: string; subject?: string }) => {
    return apiRequest<{ success: boolean; message: string; referenceId?: string }>("/api/enquiries/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitWholesale: async (data: any) => {
    return apiRequest<{ success: boolean; message: string; referenceId?: string }>("/api/enquiries/wholesale", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitOfferLead: async (email: string, couponCode?: string) => {
    return apiRequest<{ success: boolean; message: string; couponCode?: string }>("/api/enquiries/offer-lead", {
      method: "POST",
      body: JSON.stringify({ email, couponCode }),
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
      "/api/products?admin=true",
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
      "/api/orders/all",
      {
        method: "GET",
      },
    );
  },

  updateOrder: async (orderId: string, orderData: any) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  },

  deleteOrder: async (orderId: string) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: "DELETE",
    });
  },

  // Admin Account & Permission Management (Super Admin Only)
  getAdmins: async () => {
    return apiRequest<{ success: boolean; data: any[] }>("/api/admin/admins", {
      method: "GET",
    });
  },

  createAdmin: async (adminData: {
    name: string;
    email: string;
    password?: string;
    permissions: string[];
    isActive?: boolean;
  }) => {
    return apiRequest<{ success: boolean; message: string; data: any }>(
      "/api/admin/admins",
      {
        method: "POST",
        body: JSON.stringify(adminData),
      }
    );
  },

  updateAdmin: async (
    id: string,
    adminData: {
      name?: string;
      email?: string;
      password?: string;
      permissions?: string[];
      isActive?: boolean;
    }
  ) => {
    return apiRequest<{ success: boolean; message: string; data: any }>(
      `/api/admin/admins/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(adminData),
      }
    );
  },

  deleteAdmin: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/api/admin/admins/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};

// Customer Reviews API
export const reviewAPI = {
  // Get all reviews for a product with statistics
  getProductReviews: async (
    productId: string,
    params?: { star?: number | string; withImages?: boolean; verified?: boolean; sort?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.star) query.append("star", String(params.star));
    if (params?.withImages) query.append("withImages", "true");
    if (params?.verified) query.append("verified", "true");
    if (params?.sort) query.append("sort", params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<{
      success: boolean;
      data: {
        reviews: any[];
        stats: {
          averageRating: number;
          totalReviews: number;
          starCounts: Record<number, number>;
          starPercentages: Record<number, number>;
          totalWithImages: number;
        };
        allImages: Array<{
          url: string;
          reviewId: string;
          userName: string;
          rating: number;
          createdAt: string;
          comment: string;
        }>;
        userReview: any | null;
      };
    }>(`/api/reviews/product/${productId}${queryString}`, {
      method: "GET",
    });
  },

  // Create review
  createReview: async (
    productId: string,
    reviewData: {
      rating: number;
      title?: string;
      comment: string;
      userArea?: string;
      imagesBase64?: Array<{ name: string; mimeType: string; data: string }>;
    }
  ) => {
    return apiRequest<{ success: boolean; message: string; data: any }>(
      `/api/reviews/product/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(reviewData),
      }
    );
  },

  // Update existing review (owner only)
  updateReview: async (
    reviewId: string,
    reviewData: {
      rating?: number;
      title?: string;
      comment?: string;
      existingImages?: string[];
      imagesBase64?: Array<{ name: string; mimeType: string; data: string }>;
    }
  ) => {
    return apiRequest<{ success: boolean; message: string; data: any }>(
      `/api/reviews/${reviewId}`,
      {
        method: "PUT",
        body: JSON.stringify(reviewData),
      }
    );
  },

  // Delete review (owner or admin)
  deleteReview: async (reviewId: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/api/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Vote review as helpful
  voteHelpful: async (reviewId: string) => {
    return apiRequest<{ success: boolean; voted: boolean; helpfulCount: number }>(
      `/api/reviews/${reviewId}/helpful`,
      {
        method: "POST",
      }
    );
  },

  // Admin get all reviews
  getAllReviewsAdmin: async (params?: { search?: string; rating?: number; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.rating) query.append("rating", String(params.rating));
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<{ success: boolean; count: number; total: number; data: any[] }>(
      `/api/reviews/admin/all${queryString}`,
      {
        method: "GET",
      }
    );
  },
};

// ============ BANNER & BREADCRUMB API ============
export interface BannerSlideItem {
  image: string;
  title?: string;
}

export interface BannerConfigData {
  _id?: string;
  pageKey: string;
  pageName: string;
  variant: "BreadcrumbSlider" | "BannerAndBreadCrumb";
  title?: string;
  images: string[];
  slides?: BannerSlideItem[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const bannerAPI = {
  // Get all banner configs
  getAllBanners: async () => {
    return apiRequest<{ success: boolean; data: BannerConfigData[] }>("/api/banners", {
      method: "GET",
    });
  },

  // Get banner config by page key
  getBannerByPage: async (pageKey: string) => {
    const safeKey = encodeURIComponent(pageKey.startsWith("/") ? pageKey.slice(1) : pageKey);
    return apiRequest<{ success: boolean; data: BannerConfigData }>(`/api/banners/${safeKey}`, {
      method: "GET",
    });
  },

  // Update banner config for a page
  updateBanner: async (
    pageKey: string,
    data: {
      pageName?: string;
      variant?: "BreadcrumbSlider" | "BannerAndBreadCrumb";
      title?: string;
      images?: string[];
      slides?: BannerSlideItem[];
      isActive?: boolean;
    }
  ) => {
    const safeKey = encodeURIComponent(pageKey.startsWith("/") ? pageKey.slice(1) : pageKey);
    return apiRequest<{ success: boolean; message: string; data: BannerConfigData }>(
      `/api/banners/${safeKey}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  // Upload banner image
  uploadBannerImage: async (imagePayload: {
    base64Data: string;
    fileName?: string;
    mimeType?: string;
  }) => {
    return apiRequest<{ success: boolean; message: string; url: string }>(
      "/api/banners/upload-image",
      {
        method: "POST",
        body: JSON.stringify(imagePayload),
      }
    );
  },
};

export { API_BASE_URL, getAuthHeaders, apiRequest };

