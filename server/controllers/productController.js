const Product = require("../models/Product");
const { createFolder, uploadFile } = require("../utils/googleDrive");

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.admin !== "true") {
      filter.onHold = { $ne: true };
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
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
  console.log("📦 Request Body Keys:", Object.keys(req.body));
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
      rating,
      reviewCount,
      ingredients,
      variants,
      onHold,
      bestPairingDishes,
      reviews,
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
          }
        } catch (uploadError) {
          console.error(`❌ Image upload failed for ${img.name}:`, uploadError.message);
        }
      }
    }

    // 2.5 Handle Best Pairing Dishes images
    if (bestPairingDishes && Array.isArray(bestPairingDishes)) {
      for (let i = 0; i < bestPairingDishes.length; i++) {
        const dish = bestPairingDishes[i];
        if (dish.data && mainFolderId) {
          try {
            console.log(`📂 Uploading image for dish: ${dish.dishName || i}`);
            const url = await uploadFile(
              `dish_${Date.now()}_${i}.jpg`,
              dish.imageMimeType || "image/jpeg",
              dish.data,
              mainFolderId,
            );
            dish.image = url;
          } catch (uploadError) {
            console.error(`❌ Dish image upload failed for ${dish.dishName || i}:`, uploadError.message);
          } finally {
            // ALWAYS delete Base64 strings so we don't save them to MongoDB
            delete dish.data;
            delete dish.imageMimeType;
          }
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
      pairings: Array.isArray(pairings)
        ? pairings.join(", ")
        : pairings
          ? pairings.split(",").map((p) => p.trim()).join(", ")
          : "",
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
      ingredients,
      variants,
      onHold: onHold === "true" || onHold === true,
      googleDriveFolderId: mainFolderId,
      image: imageUrls.length > 0 ? imageUrls[0] : "",
      images: imageUrls,
      bestPairingDishes: bestPairingDishes || [],
      reviews: reviews || [],
    };

    const product = await Product.create(productData);
    console.log("✅ Product saved successfully:", product._id);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
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
    console.log("🔄 Updating Product ID:", req.params.id);
    console.log("📦 Request Body onHold:", req.body.onHold);
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { imagesBase64, images: existingImages, ...updateData } = req.body;

    // Convert numeric fields if present
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice)
      updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.rating) updateData.rating = Number(updateData.rating);
    if (updateData.reviewCount) updateData.reviewCount = Number(updateData.reviewCount);
    if (updateData.onHold !== undefined) {
      updateData.onHold = updateData.onHold === "true" || updateData.onHold === true;
      console.log("✔️ Final updateData.onHold:", updateData.onHold);
    }

    if (updateData.pairings) {
      updateData.pairings = Array.isArray(updateData.pairings)
        ? updateData.pairings.join(", ")
        : updateData.pairings;
    }

    // Handle image uploads if provided
    let finalImages = existingImages
      ? [...existingImages]
      : product.images || [];

    const driveFolderId = product.googleDriveFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (imagesBase64 && Array.isArray(imagesBase64)) {
      const mainFolderId = driveFolderId;
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

    // Handle Best Pairing Dishes images in update
    if (updateData.bestPairingDishes && Array.isArray(updateData.bestPairingDishes)) {
      const mainFolderId = driveFolderId;
      for (let i = 0; i < updateData.bestPairingDishes.length; i++) {
        const dish = updateData.bestPairingDishes[i];
        if (dish.data && mainFolderId) {
          try {
            const url = await uploadFile(
              `dish_update_${Date.now()}_${i}.jpg`,
              dish.imageMimeType || "image/jpeg",
              dish.data,
              mainFolderId,
            );
            dish.image = url;
          } catch (uploadError) {
            console.error(`❌ Dish image upload failed for updated dish:`, uploadError.message);
          } finally {
            // ALWAYS delete Base64 strings regardless of success or failure
            delete dish.data;
            delete dish.imageMimeType;
          }
        }
      }
    }

    // Update main image to the first one in the list
    updateData.images = finalImages;
    updateData.image = finalImages.length > 0 ? finalImages[0] : "";
    updateData.googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Explicitly handle onHold to ensure it's not lost in spread
    if (req.body.onHold !== undefined) {
      const isHold = req.body.onHold === "true" || req.body.onHold === true;
      updateData.onHold = isHold;
      console.log(`📍 ID ${req.params.id}: Explicitly setting onHold to:`, isHold);
    }

    // Use a slightly different approach to ensure fields like onHold are definitely updated
    product = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
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
