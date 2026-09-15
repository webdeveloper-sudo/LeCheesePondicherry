const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
      index: true,
    },
    productIdStr: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    userPhoto: {
      type: String,
      default: "",
    },
    userArea: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: [
        (val) => val.length <= 5,
        "Cannot upload more than 5 images per review",
      ],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to help query reviews quickly per product sorted by newest
reviewSchema.index({ productIdStr: 1, createdAt: -1 });
reviewSchema.index({ product: 1, rating: -1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
