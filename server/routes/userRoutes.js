const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddresses,
  getOrderHistory,
  getAllUsers,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  validateProfile,
  validateAddress,
} = require("../middleware/validationMiddleware");

// All user routes are protected
router.use(protect);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", validateProfile, updateProfile);

// Address routes
router.get("/addresses", getAddresses);
router.post("/address", validateAddress, addAddress);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);
router.put("/address/:addressId/default", setDefaultAddress);

// Order history
router.get("/orders", getOrderHistory);

// Admin routes
router.get("/all", protect, adminOnly, getAllUsers);

module.exports = router;
