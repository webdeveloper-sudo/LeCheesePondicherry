const express = require("express");
const router = express.Router();
const {
  createPaymentSession,
  verifyPayment,
  getMyOrders,
  getOrders,
  updateOrder,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// User Routes
router.post("/session", protect, createPaymentSession);
router.post("/verify", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);

// Admin Routes
router.get("/all", protect, adminOnly, getOrders);
router.put("/:id", protect, adminOnly, updateOrder);

module.exports = router;
