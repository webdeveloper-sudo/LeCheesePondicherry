const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");

async function patchUrls() {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) throw new Error("MONGODB_URI missing");

    await mongoose.connect(dbUri, { dbName: process.env.DB_NAME });
    console.log("🔌 Connected to MongoDB");

    const products = await Product.find({});
    console.log(`🔍 Found ${products.length} products to patch`);

    for (const product of products) {
      console.log(`📦 Patching: ${product.name}`);

      // Function to convert URL to stable thumbnail format
      const getStableUrl = (url) => {
        if (!url || typeof url !== "string") return url;

        // If it's already a thumbnail URL, keep it
        if (url.includes("thumbnail?id=")) return url;

        // Extract ID from lh3 or drive.google.com/open?id= format
        let fileId = "";
        if (url.includes("lh3.googleusercontent.com/d/")) {
          fileId = url.split("/d/")[1].split(/[?&]/)[0];
        } else if (url.includes("id=")) {
          fileId = url.split("id=")[1].split(/[?&]/)[0];
        }

        if (fileId) {
          return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
        return url;
      };

      const updatedImage = getStableUrl(product.image);
      const updatedImages = product.images.map((img) => getStableUrl(img));

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            image: updatedImage,
            images: updatedImages,
          },
        },
      );
      console.log(`   ✅ Patch applied`);
    }

    console.log("\n✨ All URLs patched successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Patch failed:", error);
    process.exit(1);
  }
}

patchUrls();
