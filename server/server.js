require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const browsingRoutes = require("./routes/browsingRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/browsing", browsingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Le Pondicherry Cheese API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Le Pondicherry Cheese API",
    version: "1.0.0",
    documentation: "/api/health",
    endpoints: {
      auth: "/api/auth",
      cart: "/api/cart",
      wishlist: "/api/wishlist",
      browsing: "/api/browsing",
      user: "/api/user",
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed Admin User if not exists
    const Admin = require("./models/Admin");
    const bcrypt = require("bcryptjs");
    const adminExists = await Admin.findOne({ email: "admin@achariya.org" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123", 12);
      await Admin.create({
        email: "admin@achariya.org",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });
      console.log("✅ Default admin user created");
    }

    app.listen(PORT, () => {
      console.log("\n========================================");
      console.log("🧀 LE PONDICHERRY CHEESE API SERVER");
      console.log("========================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
      console.log("========================================\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
