const Admin = require("../models/Admin");
const { generateToken } = require("../utils/generateToken");

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Generate token valid for 7 days
    const token = generateToken(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      "7d",
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
};
