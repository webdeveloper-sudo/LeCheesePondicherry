const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  getAllReviewsAdmin,
} = require("../controllers/reviewController");
const { protect, optionalAuth, adminOnly } = require("../middleware/authMiddleware");

// Public / Optional Auth (to get user's own review & product stats)
router.get("/product/:productId", optionalAuth, getProductReviews);

// Protected routes (Logged-in user)
router.post("/product/:productId", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview); // Owner OR Admin
router.post("/:id/helpful", protect, voteHelpful);

// Admin moderation route
router.get("/admin/all", protect, adminOnly, getAllReviewsAdmin);

module.exports = router;
