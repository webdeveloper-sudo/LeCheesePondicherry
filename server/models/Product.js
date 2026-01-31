const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    shortDescription: {
      type: String,
      required: [true, "Please provide product short description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    originalPrice: {
      type: Number,
    },
    image: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["aged", "fresh", "specialty", "melting", "subscriptions"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    weight: {
      type: String,
      required: [true, "Please provide product weight"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tastingNotes: {
      appearance: String,
      texture: String,
      aroma: String,
      flavor: String,
      finish: String,
    },
    pairings: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: String,
    },
    googleDriveFolderId: {
      type: String,
    },
    variants: [
      {
        weight: String,
        price: Number,
        inStock: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create slug from name before saving
productSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
