const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    landmark: String,
    city: { type: String },
    state: { type: String },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    countryCode: { type: String, default: "+91" },
    mobile: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const preferenceItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const browsingHistoryItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: String,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    orderPlacedOn: { type: Date, default: Date.now },
    orderDeliveredOn: Date,
    estimatedDeliveryDate: Date,
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMode: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod", "wallet", "online", "unknown"],
    },
    paymentOn: Date,
    transactionId: String,
    orderAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },
    items: [orderItemSchema],
    deliveryAddress: addressSchema,
    trackingNumber: String,
    courierPartner: String,
    notes: String,
    cancellationReason: String,
    refundAmount: Number,
    refundedOn: Date,
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, trim: true },
    profilePhoto: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: { type: String, trim: true },

    // Authentication
    hashedPassword: { type: String },

    // Address Management
    addresses: [addressSchema],

    // Shopping
    cart: [cartItemSchema],
    wishlist: [wishlistItemSchema],
    orders: [orderSchema],

    // Browsing & Preferences
    browsingHistory: [browsingHistoryItemSchema],
    preferences: [preferenceItemSchema], // Last 5 viewed items auto-updated

    // Account Status
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },

    // Analytics & Tracking
    lastLoginAt: Date,
    loginCount: { type: Number, default: 0 },

    // Marketing Preferences
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    newsletterSubscribed: { type: Boolean, default: false },

    // Referral System
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Loyalty & Rewards
    loyaltyPoints: { type: Number, default: 0 },

    // Device & Session Info (for analytics)
    lastDeviceInfo: {
      type: String,
      userAgent: String,
      ip: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Indexes for better query performance
userSchema.index({ mobile: 1 });
userSchema.index({ "orders.orderId": 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name display
userSchema.virtual("displayName").get(function () {
  return this.name || this.email.split("@")[0];
});

// Method to check if user has items in cart
userSchema.methods.hasItemsInCart = function () {
  return this.cart && this.cart.length > 0;
};

// Method to get cart total (would need product prices from elsewhere)
userSchema.methods.getCartItemCount = function () {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
};

// Pre-save hook to generate referral code
userSchema.pre("save", function (next) {
  if (!this.referralCode && this.isEmailVerified) {
    this.referralCode = "LPC" + this._id.toString().slice(-6).toUpperCase();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
