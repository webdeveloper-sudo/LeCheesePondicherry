const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const reviewImageService = require("../utils/reviewImageService");

/**
 * Helper to recalculate and update product rating and review count
 */
const updateProductStats = async (productId) => {
  try {
    const reviews = await Review.find({
      $or: [{ product: productId }, { productIdStr: productId.toString() }],
    });

    const total = reviews.length;
    const avg =
      total > 0
        ? Math.round(
            (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / total) * 10
          ) / 10
        : 5;

    await Product.findOneAndUpdate(
      { $or: [{ _id: mongoose.isValidObjectId(productId) ? productId : null }, { slug: productId }] },
      { $set: { rating: avg, reviewCount: total } }
    );
  } catch (err) {
    console.error("Error updating product stats:", err.message);
  }
};

/**
 * @desc    Get all reviews for a specific product with Amazon/Flipkart breakdown
 * @route   GET /api/reviews/product/:productId
 * @access  Public (Optional Auth for user specific state)
 */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { star, withImages, verified, sort = "newest" } = req.query;

    const sanitizedSlug = productId ? productId.toLowerCase().trim() : "";
    const sanitizedNoHyphen = sanitizedSlug.replace(/-/g, "");

    // 1. Find product to get its ObjectId and slug (flexible match)
    const product = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(productId) ? productId : null },
        { slug: productId },
        { slug: sanitizedSlug },
        { slug: sanitizedNoHyphen },
        { id: productId },
        { name: new RegExp(`^${productId.replace(/-/g, "[ -]?")}$`, "i") },
      ],
    });

    const matchConditions = [
      { productIdStr: productId },
      { productIdStr: sanitizedSlug },
      { productIdStr: sanitizedNoHyphen },
    ];

    if (product) {
      matchConditions.push({ product: product._id });
      if (product.slug) {
        matchConditions.push({ productIdStr: product.slug });
      }
    }

    const matchFilter = { $or: matchConditions };

    // 2. Fetch ALL reviews for summary calculation
    const allProductReviews = await Review.find(matchFilter).sort({ createdAt: -1 });

    const totalReviews = allProductReviews.length;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const allImages = [];

    allProductReviews.forEach((rev) => {
      const r = Math.min(Math.max(Math.round(rev.rating), 1), 5);
      starCounts[r] = (starCounts[r] || 0) + 1;

      if (rev.images && Array.isArray(rev.images)) {
        rev.images.forEach((img) => {
          if (img) {
            allImages.push({
              url: img,
              reviewId: rev._id,
              userName: rev.userName,
              rating: rev.rating,
              createdAt: rev.createdAt,
              comment: rev.comment,
            });
          }
        });
      }
    });

    const averageRating =
      totalReviews > 0
        ? Math.round(
            (allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) *
              10
          ) / 10
        : product?.rating || 5;

    const starPercentages = {
      5: totalReviews ? Math.round((starCounts[5] / totalReviews) * 100) : 0,
      4: totalReviews ? Math.round((starCounts[4] / totalReviews) * 100) : 0,
      3: totalReviews ? Math.round((starCounts[3] / totalReviews) * 100) : 0,
      2: totalReviews ? Math.round((starCounts[2] / totalReviews) * 100) : 0,
      1: totalReviews ? Math.round((starCounts[1] / totalReviews) * 100) : 0,
    };

    // 3. Filtered reviews query
    const query = { ...matchFilter };

    if (star && !isNaN(Number(star))) {
      query.rating = Number(star);
    }
    if (withImages === "true") {
      query.images = { $exists: true, $not: { $size: 0 } };
    }
    if (verified === "true") {
      query.isVerifiedPurchase = true;
    }

    // 4. Sort Options
    let sortOption = { createdAt: -1 };
    if (sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    if (sort === "lowest") sortOption = { rating: 1, createdAt: -1 };
    if (sort === "helpful") sortOption = { helpfulCount: -1, createdAt: -1 };

    const reviews = await Review.find(query).sort(sortOption);

    // 5. User's existing review (if logged in)
    let userReview = null;
    if (req.user) {
      userReview = allProductReviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
    }

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          averageRating,
          totalReviews,
          starCounts,
          starPercentages,
          totalWithImages: allImages.length,
        },
        allImages: allImages.slice(0, 20), // Top 20 customer review photos
        userReview,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new product review
 * @route   POST /api/reviews/product/:productId
 * @access  Private (Logged in user)
 */
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, imagesBase64, userArea } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide both a star rating and review comment.",
      });
    }

    const sanitizedSlug = productId ? productId.toLowerCase().trim() : "";
    const sanitizedNoHyphen = sanitizedSlug.replace(/-/g, "");

    // Find Product (flexible match)
    const product = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(productId) ? productId : null },
        { slug: productId },
        { slug: sanitizedSlug },
        { slug: sanitizedNoHyphen },
        { id: productId },
        { name: new RegExp(`^${productId.replace(/-/g, "[ -]?")}$`, "i") },
      ],
    });

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      $and: [
        { user: req.user._id },
        {
          $or: [
            ...(product ? [{ product: product._id }] : []),
            { productIdStr: productId },
            { productIdStr: sanitizedSlug },
            { productIdStr: sanitizedNoHyphen },
            ...(product?.slug ? [{ productIdStr: product.slug }] : []),
          ],
        },
      ],
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product. You can edit your review instead.",
        existingReviewId: existingReview._id,
      });
    }

    // Check if verified purchase
    let isVerifiedPurchase = false;
    try {
      const user = await User.findById(req.user._id);
      if (user && user.orders && Array.isArray(user.orders)) {
        isVerifiedPurchase = user.orders.some(
          (o) =>
            o.items &&
            o.items.some(
              (item) =>
                (product && item.productId === product._id.toString()) ||
                (product && item.productId === product.slug) ||
                item.productId === productId ||
                (product && item.productName === product.name)
            )
        );
      }
    } catch (e) {
      console.warn("Could not check verified purchase status:", e.message);
    }

    // Process and upload review images (up to 5)
    let imageUrls = [];
    if (imagesBase64 && Array.isArray(imagesBase64) && imagesBase64.length > 0) {
      imageUrls = await reviewImageService.uploadMultipleReviewImages(imagesBase64);
    }

    const review = await Review.create({
      product: product ? product._id : undefined,
      productIdStr: product?.slug || productId,
      user: req.user._id,
      userName: req.user.name || req.user.displayName || req.user.email?.split("@")[0] || "Customer",
      userEmail: req.user.email,
      userPhoto: req.user.profilePhoto || "",
      userArea: userArea || req.user.addresses?.[0]?.city || "",
      rating: Number(rating),
      title: title || "",
      comment,
      images: imageUrls,
      isVerifiedPurchase,
    });

    // Update Product Rating and Count if product exists in DB
    if (product) {
      await updateProductStats(product._id);
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully! Thank you for your feedback.",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

/**
 * @desc    Update an existing review
 * @route   PUT /api/reviews/:id
 * @access  Private (Owner only)
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, imagesBase64, existingImages } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Ownership check (Only the user who wrote it can edit)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own reviews",
      });
    }

    // Retain valid existing images
    let finalImages = Array.isArray(existingImages) ? [...existingImages] : [...review.images];

    // Upload any newly added images
    if (imagesBase64 && Array.isArray(imagesBase64) && imagesBase64.length > 0) {
      const newUrls = await reviewImageService.uploadMultipleReviewImages(imagesBase64);
      finalImages = [...finalImages, ...newUrls].slice(0, 5);
    }

    if (rating) review.rating = Number(rating);
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;
    review.images = finalImages;
    review.updatedAt = Date.now();

    await review.save();

    // Update Product Aggregate Stats
    await updateProductStats(review.product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Review Owner OR Admin)
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = review.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own review, or require admin access.",
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(id);

    // Update Product Aggregate Stats
    await updateProductStats(productId);

    res.status(200).json({
      success: true,
      message: isAdmin && !isOwner ? "Review deleted by administrator" : "Your review has been deleted",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

/**
 * @desc    Vote review as helpful (Amazon/Flipkart style)
 * @route   POST /api/reviews/:id/helpful
 * @access  Private (Logged in user)
 */
const voteHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const alreadyVoted = review.helpfulUsers.some(
      (uId) => uId.toString() === userId.toString()
    );

    if (alreadyVoted) {
      // Toggle off
      review.helpfulUsers = review.helpfulUsers.filter(
        (uId) => uId.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Toggle on
      review.helpfulUsers.push(userId);
      review.helpfulCount = (review.helpfulCount || 0) + 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      voted: !alreadyVoted,
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    console.error("Error voting helpful:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update helpful vote",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all reviews across all products for Admin management
 * @route   GET /api/reviews/admin/all
 * @access  Private (Admin only)
 */
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { search, rating, page = 1, limit = 50 } = req.query;
    const query = {};

    if (rating && !isNaN(Number(rating))) {
      query.rating = Number(rating);
    }

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("product", "name image slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      data: reviews,
    });
  } catch (error) {
    console.error("Admin reviews fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin reviews",
      error: error.message,
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  getAllReviewsAdmin,
};
