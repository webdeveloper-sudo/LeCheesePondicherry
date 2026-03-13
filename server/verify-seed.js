const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("./models/Product");
const Blog = require("./models/Blog");

dotenv.config({ path: path.join(__dirname, ".env") });

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const productCount = await Product.countDocuments();
    const blogCount = await Blog.countDocuments();

    console.log(`Product count: ${productCount}`);
    console.log(`Blog count: ${blogCount}`);

    const firstProduct = await Product.findOne();
    console.log("First Product Name:", firstProduct?.name);
    console.log("First Product Image URL:", firstProduct?.image);
    console.log("First Product Image Count:", firstProduct?.images?.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Verification error:", error);
  }
};

verify();
