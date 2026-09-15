const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const bannerConfigSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: [true, "Page key is required (e.g. /shop, /about)"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    pageName: {
      type: String,
      required: [true, "Page name is required"],
      trim: true,
    },
    variant: {
      type: String,
      enum: ["BreadcrumbSlider", "BannerAndBreadCrumb"],
      default: "BannerAndBreadCrumb",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    slides: {
      type: [slideSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "banner_configs",
  }
);

const BannerConfig = mongoose.model("BannerConfig", bannerConfigSchema);

module.exports = BannerConfig;
