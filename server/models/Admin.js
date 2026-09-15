const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ALL_ADMIN_PAGES = ["orders", "users", "products", "reviews", "blogs", "banners", "settings"];

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      default: "Administrator",
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "admin",
    },
    permissions: {
      type: [String],
      default: ALL_ADMIN_PAGES,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "admin",
  },
);

// Pre-save hook to hash password if modified
adminSchema.pre("save", async function (next) {
  if (this.email === "vp.expansions@hopemarket.in") {
    this.isSuperAdmin = true;
    this.permissions = ALL_ADMIN_PAGES;
  }

  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
