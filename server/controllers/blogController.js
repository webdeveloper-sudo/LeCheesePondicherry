const Blog = require("../models/Blog");
const { uploadFile } = require("../utils/googleDrive");

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single blog by slug
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private/Admin
 */
const createBlog = async (req, res) => {
  console.log("🚀 Starting Blog Creation for:", req.body.title);
  try {
    const {
      title,
      excerpt,
      content,
      author,
      category,
      tags, // Array or string
      date,
      readTime,
      mainImageBase64, // { name, mimeType, data }
      galleryBase64, // Array
      quote,
    } = req.body;

    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // 1. Upload Main Image
    let mainImageUrl = "";
    if (mainImageBase64 && mainImageBase64.data) {
      try {
        mainImageUrl = await uploadFile(
          mainImageBase64.name,
          mainImageBase64.mimeType,
          mainImageBase64.data,
          mainFolderId,
        );
      } catch (uploadError) {
        console.error("❌ Main Blog Image upload failed:", uploadError.message);
      }
    }

    // 2. Upload Gallery Images
    const galleryUrls = [];
    if (galleryBase64 && Array.isArray(galleryBase64)) {
      for (const img of galleryBase64) {
        try {
          const url = await uploadFile(
            img.name,
            img.mimeType,
            img.data,
            mainFolderId,
          );
          galleryUrls.push(url);
        } catch (uploadError) {
          console.error(
            `❌ Blog Gallery Image upload failed for ${img.name}:`,
            uploadError.message,
          );
        }
      }
    }

    // 3. Save to MongoDB
    console.log("📝 Constructing blog data for MongoDB...");
    const blogData = {
      title,
      excerpt,
      content,
      author,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags
          ? tags.split(",").map((t) => t.trim())
          : [],
      date:
        date ||
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      readTime,
      image: mainImageUrl,
      gallery: galleryUrls,
      quote,
    };

    console.log("📝 Blog Data to Save:", JSON.stringify(blogData, null, 2));

    const blog = await Blog.create(blogData);
    console.log("✅ Blog saved successfully:", blog._id);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("❌ Blog Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private/Admin
 */
const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { mainImageBase64, galleryBase64, tags, ...updateData } = req.body;

    const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Handle Main Image Update
    if (mainImageBase64 && mainImageBase64.data) {
      try {
        const url = await uploadFile(
          mainImageBase64.name,
          mainImageBase64.mimeType,
          mainImageBase64.data,
          mainFolderId,
        );
        updateData.image = url;
      } catch (uploadError) {
        console.error("❌ Main Blog Image upload failed:", uploadError.message);
      }
    }

    // Handle Gallery Update (Append or Replace logic could be improved, here simple append/replace if new provided)
    if (
      galleryBase64 &&
      Array.isArray(galleryBase64) &&
      galleryBase64.length > 0
    ) {
      const newGalleryUrls = [];
      for (const img of galleryBase64) {
        try {
          const url = await uploadFile(
            img.name,
            img.mimeType,
            img.data,
            mainFolderId,
          );
          newGalleryUrls.push(url);
        } catch (uploadError) {
          console.error(
            `❌ Blog Gallery Image upload failed for ${img.name}:`,
            uploadError.message,
          );
        }
      }
      // If we want to replace gallery, use newGalleryUrls. If append, concatenate.
      // For simplicity, let's say if new provided, we replace or append.
      // A better approach often involves sending "existingGallery" array + "newImages".
      // Assuming user sends 'existingGallery' in body if they want to keep them.

      // However, for this simplified implementation let's just use what's sent in 'gallery' field if we were passing urls.
      // But since we are processing base64, we might need a strategy.
      // Let's assume the frontend sends everything needed or we just append new ones.
      // Better: let's assume we handle new uploads and stick them in.
      updateData.gallery = [...(blog.gallery || []), ...newGalleryUrls];
    }

    if (tags) {
      updateData.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private/Admin
 */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
