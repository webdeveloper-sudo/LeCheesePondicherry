const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateCartItem,
  validateProductIdParam,
} = require("../middleware/validationMiddleware");

// All cart routes are protected
router.use(protect);

router.get("/", getCart);
router.post("/add", validateCartItem, addToCart);
router.put("/update", validateCartItem, updateCartItem);
router.delete("/remove/:productId", validateProductIdParam, removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
