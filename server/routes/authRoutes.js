const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  setPassword,
  completeProfile,
  login,
  getMe,
  logout,
} = require("../controllers/authController");
const { protect, rateLimit } = require("../middleware/authMiddleware");
const {
  validateEmail,
  validateOTP,
  validatePassword,
  validateLogin,
  validateProfile,
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/send-otp", rateLimit(5, 60 * 1000), validateEmail, sendOTP);
router.post("/verify-otp", rateLimit(10, 60 * 1000), validateOTP, verifyOTP);
router.post("/set-password", validatePassword, setPassword);
router.post("/login", rateLimit(10, 15 * 60 * 1000), validateLogin, login);

// Protected routes
router.post("/complete-profile", protect, validateProfile, completeProfile);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
