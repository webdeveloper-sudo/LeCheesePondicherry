const express = require("express");
const router = express.Router();
const {
  trackProductView,
  getBrowsingHistory,
  getPreferences,
  clearBrowsingHistory,
  getRecentlyViewed,
} = require("../controllers/browsingController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const { validateWishlistItem } = require("../middleware/validationMiddleware");

// Protected routes
router.post("/track", protect, validateWishlistItem, trackProductView);
router.get("/history", protect, getBrowsingHistory);
router.get("/preferences", protect, getPreferences);
router.delete("/history", protect, clearBrowsingHistory);

// Optional auth (works for both logged in and guest users)
router.get("/recently-viewed", optionalAuth, getRecentlyViewed);

module.exports = router;
