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
      });
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
