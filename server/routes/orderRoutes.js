const express = require("express");
const router = express.Router();
const {
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All order routes are admin only
router.use(protect);
router.use(adminOnly);

router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
