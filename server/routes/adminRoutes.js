const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");
const { protect, superAdminOnly } = require("../middleware/authMiddleware");

// Public admin login route
router.post("/login", loginAdmin);

// Super Admin Only: Admin Management CRUD
router.get("/admins", protect, superAdminOnly, getAllAdmins);
router.post("/admins", protect, superAdminOnly, createAdmin);
router.put("/admins/:id", protect, superAdminOnly, updateAdmin);
router.delete("/admins/:id", protect, superAdminOnly, deleteAdmin);

module.exports = router;
