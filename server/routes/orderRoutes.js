const express = require("express");
const router = express.Router();
const {
  createPaymentSession,
  verifyPayment,
  getMyOrders,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// User Routes
router.post("/session", protect, createPaymentSession);
router.post("/verify", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);

// Admin Routes
router.get("/all", protect, adminOnly, getOrders);
router.put("/:id", protect, adminOnly, updateOrder);
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;
