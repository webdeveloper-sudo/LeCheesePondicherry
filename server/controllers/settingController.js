const Setting = require("../models/Setting");

/**
 * @desc    Get system settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Initialize settings with defaults if none exists
      settings = await Setting.create({
        flashSaleEnabled: false,
        couponName: "",
        validTime: null,
        discountRate: 0,
        deliveryChargesEnabled: true,
        firstTimeOffer: {
          isEnabled: true,
          couponCode: "CHEESE15",
          discountPercent: 15,
        },
      });
    } else if (!settings.firstTimeOffer || !settings.firstTimeOffer.couponCode) {
      settings.firstTimeOffer = {
        isEnabled: settings.firstTimeOffer?.isEnabled !== undefined ? settings.firstTimeOffer.isEnabled : true,
        couponCode: settings.firstTimeOffer?.couponCode || "CHEESE15",
        discountPercent: settings.firstTimeOffer?.discountPercent || 15,
      };
      await settings.save();
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    const {
      flashSaleEnabled,
      couponName,
      validTime,
      discountRate,
      deliveryChargesEnabled,
      firstTimeOffer,
    } = req.body;

    if (flashSaleEnabled !== undefined) {
      settings.flashSaleEnabled = flashSaleEnabled;
    }
    if (couponName !== undefined) {
      settings.couponName = couponName.trim().toUpperCase();
    }
    if (validTime !== undefined) {
      settings.validTime = validTime ? new Date(validTime) : null;
    }
    if (discountRate !== undefined) {
      settings.discountRate = Number(discountRate);
    }
    if (deliveryChargesEnabled !== undefined) {
      settings.deliveryChargesEnabled = deliveryChargesEnabled;
    }

    if (firstTimeOffer && typeof firstTimeOffer === "object") {
      const currentOffer = settings.firstTimeOffer || { isEnabled: true, couponCode: "CHEESE15", discountPercent: 15 };
      settings.firstTimeOffer = {
        isEnabled: firstTimeOffer.isEnabled !== undefined ? Boolean(firstTimeOffer.isEnabled) : currentOffer.isEnabled,
        couponCode: firstTimeOffer.couponCode !== undefined ? String(firstTimeOffer.couponCode).trim().toUpperCase() : currentOffer.couponCode,
        discountPercent: firstTimeOffer.discountPercent !== undefined ? Math.max(1, Math.min(100, Number(firstTimeOffer.discountPercent))) : currentOffer.discountPercent,
      };
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
