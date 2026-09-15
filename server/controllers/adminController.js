const Admin = require("../models/Admin");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const SUPER_ADMIN_EMAIL = "vp.expansions@hopemarket.in";
const ALL_ADMIN_PAGES = ["orders", "users", "products", "reviews", "blogs", "settings"];

/**
 * @desc    Login admin (Supports Super Admin and Sub-Admins)
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find admin by email
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    if (admin.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your administrator account has been deactivated. Please contact the Super Admin.",
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

    const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL || admin.isSuperAdmin === true;
    const permissions = isSuperAdmin ? ALL_ADMIN_PAGES : (admin.permissions && admin.permissions.length > 0 ? admin.permissions : ALL_ADMIN_PAGES);

    // Generate token valid for 7 days
    const token = generateToken(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role || "admin",
        isSuperAdmin,
      },
      "7d",
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name || "Administrator",
        email: admin.email,
        role: "admin",
        permissions,
        isSuperAdmin,
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

/**
 * @desc    Get all admins
 * @route   GET /api/admin/admins
 * @access  Private / Super Admin Only
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const formatted = admins.map((admin) => {
      const isSuper = admin.email === SUPER_ADMIN_EMAIL || admin.isSuperAdmin === true;
      return {
        _id: admin._id,
        name: admin.name || "Administrator",
        email: admin.email,
        role: admin.role,
        permissions: isSuper ? ALL_ADMIN_PAGES : (admin.permissions || []),
        isSuperAdmin: isSuper,
        isActive: admin.isActive !== false,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get All Admins Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins list",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new admin
 * @route   POST /api/admin/admins
 * @access  Private / Super Admin Only
 */
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions, isActive } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if admin already exists
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `An administrator account with email ${cleanEmail} already exists.`,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const assignedPermissions = Array.isArray(permissions) && permissions.length > 0
      ? permissions
      : ["products", "orders"];

    const isSuper = cleanEmail === SUPER_ADMIN_EMAIL;

    const newAdmin = new Admin({
      name: name.trim(),
      email: cleanEmail,
      password: password, // Will be hashed by pre-save hook
      permissions: isSuper ? ALL_ADMIN_PAGES : assignedPermissions,
      isSuperAdmin: isSuper,
      isActive: isActive !== false,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: `Administrator "${name}" created successfully.`,
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        permissions: newAdmin.permissions,
        isSuperAdmin: newAdmin.isSuperAdmin,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create administrator",
      error: error.message,
    });
  }
};

/**
 * @desc    Update existing admin
 * @route   PUT /api/admin/admins/:id
 * @access  Private / Super Admin Only
 */
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, permissions, isActive } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found",
      });
    }

    const isSuper = admin.email === SUPER_ADMIN_EMAIL || admin.isSuperAdmin === true;

    if (name) {
      admin.name = name.trim();
    }

    if (email && email.toLowerCase().trim() !== admin.email) {
      const cleanEmail = email.toLowerCase().trim();
      const duplicate = await Admin.findOne({ email: cleanEmail, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `An administrator with email ${cleanEmail} already exists.`,
        });
      }
      if (admin.email === SUPER_ADMIN_EMAIL) {
        return res.status(400).json({
          success: false,
          message: "Super Admin email cannot be changed.",
        });
      }
      admin.email = cleanEmail;
    }

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }
      admin.password = password; // Trigger pre-save hash
    }

    // Only update permissions & active state if NOT the super admin
    if (!isSuper) {
      if (Array.isArray(permissions)) {
        admin.permissions = permissions;
      }
      if (typeof isActive === "boolean") {
        admin.isActive = isActive;
      }
    } else {
      admin.permissions = ALL_ADMIN_PAGES;
      admin.isActive = true;
      admin.isSuperAdmin = true;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: `Administrator "${admin.name}" updated successfully.`,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
        isSuperAdmin: admin.isSuperAdmin,
        isActive: admin.isActive,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update administrator",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an admin
 * @route   DELETE /api/admin/admins/:id
 * @access  Private / Super Admin Only
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found",
      });
    }

    if (admin.email === SUPER_ADMIN_EMAIL || admin.isSuperAdmin === true) {
      return res.status(403).json({
        success: false,
        message: "Super Administrator cannot be deleted.",
      });
    }

    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Administrator "${admin.name}" (${admin.email}) deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete administrator",
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
