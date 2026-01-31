const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { generateToken } = require("../utils/generateToken");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");

/**
 * @desc    Send OTP to email for signup
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res) => {
  try {
    const { email, purpose = "signup" } = req.body;

    // Check if email already exists for signup
    if (purpose === "signup") {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser.hashedPassword) {
        return res.status(400).json({
          success: false,
          message:
            "An account with this email already exists. Please login instead.",
        });
      }
    }

    // For password reset, check if user exists
    if (purpose === "reset-password") {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "No account found with this email address.",
        });
      }
    }

    // Delete any existing unused OTPs for this email and purpose
    await OTP.deleteMany({
      email: email.toLowerCase(),
      purpose,
      isUsed: false,
    });

    // Generate new OTP
    const otp = OTP.generateOTP(6);

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, purpose);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      // In production, don't send OTP in response
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose = "signup" } = req.body;

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      purpose,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used. Please request a new OTP.",
      });
    }

    // Check if OTP is still valid
    if (!otpRecord.isValid()) {
      return res.status(400).json({
        success: false,
        message:
          "OTP has expired or too many attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
        attemptsRemaining: 5 - otpRecord.attempts,
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate a temporary token for setting password (valid for 15 minutes)
    const tempToken = generateToken(
      { email: email.toLowerCase(), purpose, verified: true },
      "15m",
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      tempToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};

/**
 * @desc    Set password after OTP verification
 * @route   POST /api/auth/set-password
 * @access  Public (with temp token)
 */
const setPassword = async (req, res) => {
  try {
    const { email, password, tempToken } = req.body;

    // Verify temp token
    const jwt = require("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please verify your email again.",
      });
    }

    if (decoded.email !== email.toLowerCase() || !decoded.verified) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please verify your email again.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create or update user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user (for password reset)
      user.hashedPassword = hashedPassword;
      user.isEmailVerified = true;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        hashedPassword,
        isEmailVerified: true,
      });
    }

    // Generate auth token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set password. Please try again.",
    });
  }
};

/**
 * @desc    Complete user profile after signup
 * @route   POST /api/auth/complete-profile
 * @access  Private
 */
const completeProfile = async (req, res) => {
  try {
    const { name, mobile, address, pincode, city, state, countryCode } =
      req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;
    if (countryCode) updateData.countryCode = countryCode;

    // Add initial address if provided
    if (address && pincode) {
      updateData.$push = {
        addresses: {
          type: "home",
          addressLine1: address,
          pincode,
          city: city || "",
          state: state || "",
          countryCode: countryCode || "+91",
          mobile: mobile,
          isDefault: true,
        },
      };
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-hashedPassword");

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        countryCode: user.countryCode,
        role: user.role,
        addresses: user.addresses,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile. Please try again.",
    });
  }
};

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.hashedPassword) {
      return res.status(401).json({
        success: false,
        message: "Please complete your registration first",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        cartItemCount: user.getCartItemCount(),
        wishlistCount: user.wishlist?.length || 0,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-hashedPassword");

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        role: user.role,
        addresses: user.addresses,
        isEmailVerified: user.isEmailVerified,
        loyaltyPoints: user.loyaltyPoints,
        cartItemCount: user.getCartItemCount(),
        wishlistCount: user.wishlist?.length || 0,
        preferences: user.preferences || [],
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user info",
    });
  }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  // For JWT-based auth, logout is handled client-side by removing the token
  // This endpoint can be used for logging or analytics
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  sendOTP,
  verifyOTP,
  setPassword,
  completeProfile,
  login,
  getMe,
  logout,
};
