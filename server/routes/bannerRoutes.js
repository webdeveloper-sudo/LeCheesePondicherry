const express = require("express");
const router = express.Router();
const {
  getAllBannerConfigs,
  getBannerConfigByPage,
  updateBannerConfig,
  uploadBannerImage,
} = require("../controllers/bannerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getAllBannerConfigs);
router.get("/:pageKey(*)", getBannerConfigByPage);

// Admin-only endpoints
router.put("/:pageKey(*)", protect, adminOnly, updateBannerConfig);
router.post("/upload-image", protect, adminOnly, uploadBannerImage);

module.exports = router;
