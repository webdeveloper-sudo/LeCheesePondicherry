require("dotenv").config();
const fs = require("fs");
const path = require("path");
const logFile = path.join(__dirname, "server-debug.log");

// Set up file logging
const logStream = fs.createWriteStream(logFile, { flags: "a" });
const originalWriteOut = process.stdout.write.bind(process.stdout);
const originalWriteErr = process.stderr.write.bind(process.stderr);

process.stdout.write = (chunk, encoding, callback) => {
  logStream.write(`[INFO] ${new Date().toISOString()}: ${chunk}`);
  return originalWriteOut(chunk, encoding, callback);
};

process.stderr.write = (chunk, encoding, callback) => {
  logStream.write(`[ERROR] ${new Date().toISOString()}: ${chunk}`);
  return originalWriteErr(chunk, encoding, callback);
};

process.on("uncaughtException", (err) => {
  logStream.write(`[UNCAUGHT EXCEPTION] ${new Date().toISOString()}: ${err.stack || err}\n`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logStream.write(`[UNHANDLED REJECTION] ${new Date().toISOString()}: ${reason?.stack || reason}\n`);
});

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
      : "http://localhost:5174",
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
app.use("/api/blogs", require("./routes/blogRoutes"));

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

// Debug logs endpoint
app.get("/api/debug-logs", (req, res) => {
  if (fs.existsSync(logFile)) {
    res.setHeader("Content-Type", "text/plain");
    res.sendFile(logFile);
  } else {
    res.send("No logs available yet.");
  }
});

// Database Environment Diagnostics Endpoint (Masks actual password)
app.get("/api/diagnose-db-env", (req, res) => {
  const uri = process.env.MONGODB_URI || "";
  if (!uri) {
    return res.json({ error: "MONGODB_URI is empty or undefined" });
  }

  // Parse the URI: mongodb+srv://username:password@host/
  const match = uri.match(/mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@(.+)/);
  if (!match) {
    return res.json({
      validFormat: false,
      length: uri.length,
      hasPercent: uri.includes("%"),
      hasAt: uri.includes("@"),
      prefix: uri.substring(0, 15)
    });
  }

  const [_, username, password, host] = match;
  res.json({
    validFormat: true,
    username,
    passwordLength: password ? password.length : 0,
    passwordHasPercent: password ? password.includes("%") : false,
    passwordHasAt: password ? password.includes("@") : false,
    host: host.split("?")[0],
    uriLength: uri.length
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

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
