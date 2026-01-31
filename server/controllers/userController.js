const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hashedPassword");

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        addresses: user.addresses,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        referralCode: user.referralCode,
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications,
        newsletterSubscribed: user.newsletterSubscribed,
        createdAt: user.createdAt,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      profilePhoto,
      emailNotifications,
      smsNotifications,
      newsletterSubscribed,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (emailNotifications !== undefined)
      updateData.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined)
      updateData.smsNotifications = smsNotifications;
    if (newsletterSubscribed !== undefined)
      updateData.newsletterSubscribed = newsletterSubscribed;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-hashedPassword");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

/**
 * @desc    Add new address
 * @route   POST /api/user/address
 * @access  Private
 */
const addAddress = async (req, res) => {
  try {
    const {
      type,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      country,
      countryCode,
      mobile,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    // If this is the first address or isDefault is true, make it default
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    // If making this default, unset other defaults
    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      type: type || "home",
      addressLine1,
      addressLine2,
      landmark,
      city: city || "",
      state: state || "",
      pincode,
      country: country || "India",
      countryCode: countryCode || "+91",
      mobile: mobile,
      isDefault: shouldBeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

/**
 * @desc    Update existing address
 * @route   PUT /api/user/address/:addressId
 * @access  Private
 */
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      type,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      country,
      countryCode,
      mobile,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update fields
    if (type !== undefined) address.type = type;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (landmark !== undefined) address.landmark = landmark;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (country !== undefined) address.country = country;
    if (countryCode !== undefined) address.countryCode = countryCode;
    if (mobile !== undefined) address.mobile = mobile;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/user/address/:addressId
 * @access  Private
 */
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default, make first address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

/**
 * @desc    Set address as default
 * @route   PUT /api/user/address/:addressId/default
 * @access  Private
 */
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Unset all defaults and set the new one
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};

/**
 * @desc    Get all addresses
 * @route   GET /api/user/addresses
 * @access  Private
 */
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
      defaultAddress: user.addresses?.find((addr) => addr.isDefault) || null,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

/**
 * @desc    Get user's order history
 * @route   GET /api/user/orders
 * @access  Private
 */
const getOrderHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1, status } = req.query;

    const user = await User.findById(req.user._id).select("orders");

    let orders = user.orders || [];

    // Filter by status if provided
    if (status) {
      orders = orders.filter((order) => order.orderStatus === status);
    }

    // Sort by most recent first
    orders.sort(
      (a, b) => new Date(b.orderPlacedOn) - new Date(a.orderPlacedOn),
    );

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(
      startIndex,
      startIndex + parseInt(limit),
    );

    res.status(200).json({
      success: true,
      orders: paginatedOrders,
      totalOrders: orders.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(orders.length / limit),
    });
  } catch (error) {
    console.error("Get order history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
    });
  }
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/user/all
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-hashedPassword")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddresses,
  getOrderHistory,
  getAllUsers,
};
