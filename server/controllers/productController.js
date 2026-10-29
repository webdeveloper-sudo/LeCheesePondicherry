const Product = require("../models/Product");
const { uploadFile } = require("../utils/imageUpload");

// Lowercase, hyphen-separated URL endpoint: "Buy Fresh Paneer!" -> "buy-fresh-paneer"
const normalizeUrlSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// A URL endpoint is taken if another product uses it as its endpoint or its slug
// (both resolve on /products/:slug).
const findUrlConflict = (value, excludeId) => {
  const filter = { $or: [{ urlSlug: value }, { slug: value }] };
  if (excludeId) filter._id = { $ne: excludeId };
  return Product.findOne(filter).select("name");
};

// Stop the save when any image failed, so a product is never stored with images silently missing
const uploadFailureResponse = (res, failures) =>
  res.status(422).json({
    success: false,
    message: `Image upload failed, nothing was saved. ${failures.join("; ")}`,
  });

const urlConflictResponse = (res, value, conflict) =>
  res.status(409).json({
    success: false,
    message: `The URL endpoint "/products/${value}" is already used by "${conflict.name}". Please choose a different one.`,
  });

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

const mongoose = require("mongoose");

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const product = await Product.findOne({
      $or: [
        ...(isObjectId ? [{ _id: id }] : []),
        { slug: id },
      ],
    });
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
      urlSlug: rawUrlSlug,
    } = req.body;

    // 0. Validate the URL endpoint before uploading anything
    const urlSlug = normalizeUrlSlug(rawUrlSlug);
    if (urlSlug) {
      const conflict = await findUrlConflict(urlSlug);
      if (conflict) return urlConflictResponse(res, urlSlug, conflict);
    }
    // The slug generated from the name also opens the product, so it must not clash with another endpoint
    const generatedSlug = normalizeUrlSlug(name);
    if (generatedSlug && generatedSlug !== urlSlug) {
      const conflict = await findUrlConflict(generatedSlug);
      if (conflict) return urlConflictResponse(res, generatedSlug, conflict);
    }

    // 1. Target the Main Folder from .env
    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.log("📂 Uploading images to main folder...");

    // 2. Upload images if provided
    const imageUrls = [];
    const uploadFailures = [];
    if (imagesBase64 && Array.isArray(imagesBase64)) {
      for (const img of imagesBase64) {
        try {
          const url = await uploadFile(
            img.name,
            img.mimeType,
            img.data,
            mainFolderId,
            { folder: "products" },
          );
          imageUrls.push(url);
        } catch (uploadError) {
          console.error(`❌ Image upload failed for ${img.name}:`, uploadError.message);
          uploadFailures.push(uploadError.message);
        }
      }
    }

    // 2.5 Handle Best Pairing Dishes images
    if (bestPairingDishes && Array.isArray(bestPairingDishes)) {
      for (let i = 0; i < bestPairingDishes.length; i++) {
        const dish = bestPairingDishes[i];
        if (dish.data) {
          try {
            console.log(`📂 Uploading image for dish: ${dish.dishName || i}`);
            const url = await uploadFile(
              `dish_${Date.now()}_${i}.jpg`,
              dish.imageMimeType || "image/jpeg",
              dish.data,
              mainFolderId,
              { folder: "products" },
            );
            dish.image = url;
          } catch (uploadError) {
            console.error(`❌ Dish image upload failed for ${dish.dishName || i}:`, uploadError.message);
            uploadFailures.push(`Dish "${dish.dishName || i + 1}": ${uploadError.message}`);
          } finally {
            // ALWAYS delete Base64 strings so we don't save them to MongoDB
            delete dish.data;
            delete dish.imageMimeType;
          }
        }
      }
    }

    if (uploadFailures.length > 0) return uploadFailureResponse(res, uploadFailures);

    // 3. Save product to MongoDB
    console.log("📝 Saving product to MongoDB...");
    const productData = {
      name,
      ...(urlSlug && { urlSlug }),
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
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This URL endpoint or product name is already used by another product. Please choose a different one.",
      });
    }
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

    const { imagesBase64, images: existingImages, urlSlug: rawUrlSlug, ...updateData } = req.body;

    // Validate the URL endpoint before uploading anything; empty clears it
    let unsetFields;
    if (rawUrlSlug !== undefined) {
      const urlSlug = normalizeUrlSlug(rawUrlSlug);
      if (urlSlug) {
        const conflict = await findUrlConflict(urlSlug, product._id);
        if (conflict) return urlConflictResponse(res, urlSlug, conflict);
        updateData.urlSlug = urlSlug;
      } else {
        unsetFields = { urlSlug: "" };
      }
    }

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
    const uploadFailures = [];

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
            { folder: "products" },
          );
          newImageUrls.push(url);
        } catch (uploadError) {
          console.error(
            `❌ Image upload failed for ${img.name}:`,
            uploadError.message,
          );
          uploadFailures.push(uploadError.message);
        }
      }
      finalImages = [...finalImages, ...newImageUrls];
    }

    // Handle Best Pairing Dishes images in update
    if (updateData.bestPairingDishes && Array.isArray(updateData.bestPairingDishes)) {
      const mainFolderId = driveFolderId;
      for (let i = 0; i < updateData.bestPairingDishes.length; i++) {
        const dish = updateData.bestPairingDishes[i];
        if (dish.data) {
          try {
            const url = await uploadFile(
              `dish_update_${Date.now()}_${i}.jpg`,
              dish.imageMimeType || "image/jpeg",
              dish.data,
              mainFolderId,
              { folder: "products" },
            );
            dish.image = url;
          } catch (uploadError) {
            console.error(`❌ Dish image upload failed for updated dish:`, uploadError.message);
            uploadFailures.push(`Dish "${dish.dishName || i + 1}": ${uploadError.message}`);
          } finally {
            // ALWAYS delete Base64 strings regardless of success or failure
            delete dish.data;
            delete dish.imageMimeType;
          }
        }
      }
    }

    if (uploadFailures.length > 0) return uploadFailureResponse(res, uploadFailures);

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
      { $set: updateData, ...(unsetFields && { $unset: unsetFields }) },
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
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This URL endpoint is already used by another product. Please choose a different one.",
      });
    }
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
