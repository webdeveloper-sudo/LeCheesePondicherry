const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
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
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productImage: String,
  productName: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  weight: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderPlacedOn: {
      type: Date,
      default: Date.now,
    },
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
    orderAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
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
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
