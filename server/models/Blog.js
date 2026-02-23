const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide blog title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please provide blog excerpt"],
    },
    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },
    author: {
      type: String,
      required: [true, "Please provide author name"],
    },
    category: {
      type: String,
      required: [true, "Please provide blog category"],
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Please provide blog main image"],
    },
    gallery: {
      type: [String],
      default: [],
    },
    date: {
      type: String,
      required: true,
      // Storing as string to match format like "May 12, 2024" or we can use Date and format it on frontend
      // Following the existing pattern in blogs.ts which uses "May 12, 2024" string
    },
    readTime: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    quote: {
      text: String,
      author: String,
    },
  },
  {
    timestamps: true,
  },
);

// Create slug from title before saving
blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
