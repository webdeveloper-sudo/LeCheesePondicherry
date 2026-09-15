const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    flashSaleEnabled: {
      type: Boolean,
      default: false,
    },
    couponName: {
      type: String,
      default: "",
      trim: true,
    },
    validTime: {
      type: Date,
      default: null,
    },
    discountRate: {
      type: Number,
      default: 0,
    },
    deliveryChargesEnabled: {
      type: Boolean,
      default: true,
    },
    firstTimeOffer: {
      isEnabled: {
        type: Boolean,
        default: true,
      },
      couponCode: {
        type: String,
        default: "CHEESE15",
        trim: true,
        uppercase: true,
      },
      discountPercent: {
        type: Number,
        default: 15,
        min: 1,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
