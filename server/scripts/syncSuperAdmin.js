const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("../models/Admin");

const ALL_ADMIN_PAGES = ["orders", "users", "products", "reviews", "blogs", "settings"];

async function syncSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("Connected to MongoDB:", process.env.DB_NAME);

    const email = "vp.expansions@hopemarket.in";
    let admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Creating Super Admin...");
      admin = new Admin({
        name: "Super Administrator",
        email,
        password: "comathaagro@26",
        role: "admin",
        permissions: ALL_ADMIN_PAGES,
        isSuperAdmin: true,
        isActive: true,
      });
      await admin.save();
      console.log("Created Super Admin:", admin.email);
    } else {
      admin.name = "Super Administrator";
      admin.isSuperAdmin = true;
      admin.permissions = ALL_ADMIN_PAGES;
      admin.isActive = true;
      await admin.save();
      console.log("Updated Super Admin:", admin.email, "isSuperAdmin:", admin.isSuperAdmin);
    }

    process.exit(0);
  } catch (error) {
    console.error("Sync error:", error);
    process.exit(1);
  }
}

syncSuperAdmin();
