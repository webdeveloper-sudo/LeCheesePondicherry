const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require("../models/User");

dotenv.config({ path: path.join(__dirname, "../.env") });

const resetAndSeedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB");

    // 1. Delete all admins from Admin collection
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️ Removed ${deleteResult.deletedCount} existing admin(s) from 'admin' collection.`);

    // 2. Also check User collection for any admin roles and revert them to user
    const userAdminUpdate = await User.updateMany(
      { role: "admin" },
      { $set: { role: "user" } }
    );
    if (userAdminUpdate.modifiedCount > 0) {
      console.log(`🔄 Reverted ${userAdminUpdate.modifiedCount} user(s) with 'admin' role to 'user' in User collection.`);
    }

    // 3. Hash password and seed new admin
    const adminEmail = "vp.expansions@hopemarket.in";
    const plainPassword = "comathaagro@26";
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const newAdmin = await Admin.create({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("✅ Successfully seeded new Admin:");
    console.log({
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt,
    });

    // 4. Verify password comparison
    const isMatch = await newAdmin.comparePassword(plainPassword);
    console.log(`🔐 Password verification test: ${isMatch ? "SUCCESS (PASS)" : "FAILED (FAIL)"}`);

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting and seeding admin:", error);
    process.exit(1);
  }
};

resetAndSeedAdmin();
