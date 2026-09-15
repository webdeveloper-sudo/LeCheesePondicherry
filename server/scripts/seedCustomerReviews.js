const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedReviews = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("MONGODB_URI missing in .env");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB",
    });
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    if (products.length === 0) {
      console.log("No products found to seed reviews for.");
      process.exit(0);
    }

    // Ensure dummy user exists for realistic reviews
    let user1 = await User.findOne({ email: "priya.sharma@example.com" });
    if (!user1) {
      user1 = await User.create({
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        isEmailVerified: true,
        role: "user",
      });
    }

    let user2 = await User.findOne({ email: "chef.david@example.com" });
    if (!user2) {
      user2 = await User.create({
        name: "Chef David Laurent",
        email: "chef.david@example.com",
        isEmailVerified: true,
        role: "user",
      });
    }

    let user3 = await User.findOne({ email: "arjun.menon@example.com" });
    if (!user3) {
      user3 = await User.create({
        name: "Arjun Menon",
        email: "arjun.menon@example.com",
        isEmailVerified: true,
        role: "user",
      });
    }

    // Clear existing reviews to avoid duplicates
    const deleteRes = await Review.deleteMany({});
    console.log(`Cleared ${deleteRes.deletedCount} old reviews.`);

    const sampleImages = [
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800",
    ];

    const sampleReviewsData = [
      {
        user: user1._id,
        userName: "Priya Sharma",
        userEmail: "priya.sharma@example.com",
        userArea: "Bangalore",
        rating: 5,
        title: "Phenomenal artisan texture & authentic taste!",
        comment:
          "Easily the best artisanal cheese crafted in India! We paired it with sourdough baguette, organic grapes, and some fig preserve. The creaminess and delicate flavor notes are truly restaurant grade.",
        images: [sampleImages[0], sampleImages[1]],
        isVerifiedPurchase: true,
        helpfulCount: 14,
      },
      {
        user: user2._id,
        userName: "Chef David Laurent",
        userEmail: "chef.david@example.com",
        userArea: "White Town, Pondicherry",
        rating: 5,
        title: "French artisanal standards met perfectly",
        comment:
          "As someone who grew up in Provence, I am genuinely amazed by the consistency, rind development, and subtle aging notes. A staple on our tasting boards.",
        images: [sampleImages[2]],
        isVerifiedPurchase: true,
        helpfulCount: 22,
      },
      {
        user: user3._id,
        userName: "Arjun Menon",
        userEmail: "arjun.menon@example.com",
        userArea: "Chennai",
        rating: 4,
        title: "Excellent quality and cold-pack delivery was prompt",
        comment:
          "Arrived well chilled in insulated packaging within 24 hours. Great melting characteristics and lovely aroma. Will definitely reorder again soon!",
        images: [sampleImages[3]],
        isVerifiedPurchase: true,
        helpfulCount: 8,
      },
    ];

    for (const product of products) {
      for (const rData of sampleReviewsData) {
        await Review.create({
          ...rData,
          product: product._id,
          productIdStr: product.slug || product._id.toString(),
        });
      }

      // Update product stats
      await Product.findByIdAndUpdate(product._id, {
        rating: 4.8,
        reviewCount: 3,
      });
    }

    console.log(`✅ Seeded reviews for all ${products.length} products successfully!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedReviews();
