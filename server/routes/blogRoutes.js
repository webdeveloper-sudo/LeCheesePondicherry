const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(getBlogs).post(protect, adminOnly, createBlog);
router.route("/:slug").get(getBlogBySlug);
router
  .route("/:id")
  .put(protect, adminOnly, updateBlog)
  .delete(protect, adminOnly, deleteBlog);

module.exports = router;
