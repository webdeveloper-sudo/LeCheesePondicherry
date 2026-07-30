const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public route to fetch settings (e.g. for header and checkout pages)
router.get("/", getSettings);

// Protected admin route to update settings
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
