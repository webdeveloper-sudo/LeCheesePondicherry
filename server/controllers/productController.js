const Product = require("../models/Product");
const { createFolder, uploadFile } = require("../utils/googleDrive");

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  console.log("🚀 Starting Product Creation for:", req.body.name);
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      weight,
      inStock,
      featured,
      tastingNotes,
      pairings,
      ingredients,
      variants,
      imagesBase64, // Array of { name: string, mimeType: string, data: string }
    } = req.body;

    // 1. Target the Main Folder from .env
    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.log("📂 Uploading images to main folder...");

    // 2. Upload images if provided
    const imageUrls = [];
    if (imagesBase64 && Array.isArray(imagesBase64)) {
      for (const img of imagesBase64) {
        try {
          if (mainFolderId) {
            const url = await uploadFile(
              img.name,
              img.mimeType,
              img.data,
              mainFolderId,
            );
            imageUrls.push(url);
          } else {
            console.warn(
              `Skipping upload for ${img.name} because main folder ID is missing in .env`,
            );
          }
        } catch (uploadError) {
          console.error(
            `❌ Image upload failed for ${img.name}:`,
            uploadError.message,
          );
        }
      }
    }

    // 3. Save product to MongoDB
    console.log("📝 Saving product to MongoDB...");
    const productData = {
      name,
      description,
      shortDescription: shortDescription || description?.substring(0, 100),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      weight,
      inStock: inStock === "true" || inStock === true,
      featured: featured === "true" || featured === true,
      tastingNotes,
      pairings,
      ingredients,
      variants,
      googleDriveFolderId: mainFolderId,
      image: imageUrls.length > 0 ? imageUrls[0] : "",
      images: imageUrls, // These are the Drive URLs
    };

    const product = await Product.create(productData);
    console.log("✅ Product saved successfully:", product._id);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { imagesBase64, images: existingImages, ...updateData } = req.body;

    // Handle image uploads if provided
    let finalImages = existingImages
      ? [...existingImages]
      : product.images || [];

    if (imagesBase64 && Array.isArray(imagesBase64)) {
      const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      const newImageUrls = [];

      for (const img of imagesBase64) {
        try {
          const url = await uploadFile(
            img.name,
            img.mimeType,
            img.data,
            mainFolderId,
          );
          newImageUrls.push(url);
        } catch (uploadError) {
          console.error(
            `❌ Image upload failed for ${img.name}:`,
            uploadError.message,
          );
        }
      }
      finalImages = [...finalImages, ...newImageUrls];
    }

    // Update main image to the first one in the list
    updateData.images = finalImages;
    updateData.image = finalImages.length > 0 ? finalImages[0] : "";
    updateData.googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // We keep the Drive folder for safety, but we could delete it if requested
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
