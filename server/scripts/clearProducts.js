const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/Product");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const clearProducts = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB"
    });
    console.log(`🟢 Connected to MongoDB: ${process.env.DB_NAME || "LeCheesePondyDB"}`);

    console.log("🧨 Clearing products collection...");
    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing products:", error);
    process.exit(1);
  }
};

clearProducts();
