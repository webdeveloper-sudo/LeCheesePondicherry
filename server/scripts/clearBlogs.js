const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Blog = require("../models/Blog");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const clearBlogs = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB"
    });
    console.log(`🟢 Connected to MongoDB: ${process.env.DB_NAME || "LeCheesePondyDB"}`);

    console.log("🧨 Clearing blogs collection...");
    const result = await Blog.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} blogs.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing blogs:", error);
    process.exit(1);
  }
};

clearBlogs();
