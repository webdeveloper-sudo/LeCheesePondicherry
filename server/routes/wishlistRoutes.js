const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  toggleWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateWishlistItem,
  validateProductIdParam,
} = require("../middleware/validationMiddleware");

// All wishlist routes are protected
router.use(protect);

router.get("/", getWishlist);
router.post("/add", validateWishlistItem, addToWishlist);
router.post("/toggle", validateWishlistItem, toggleWishlist);
router.delete("/remove/:productId", validateProductIdParam, removeFromWishlist);
router.post("/move-to-cart/:productId", validateProductIdParam, moveToCart);

module.exports = router;
