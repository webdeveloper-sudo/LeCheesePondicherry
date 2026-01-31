const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

/**
 * Protect routes - verify JWT token and attach user to request
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user/admin from token (exclude password)
      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        req.user = await User.findById(decoded.id).select("-hashedPassword");
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User/Admin not found",
        });
      }

      if (req.user.isActive === false) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

/**
 * Optional authentication - attaches user if token exists, but doesn't block
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        req.user = await User.findById(decoded.id).select("-hashedPassword");
      }
    } catch (error) {
      // Token is invalid, but we continue without user
      req.user = null;
    }
  }

  next();
};

/**
 * Admin only middleware - must be used after protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};

/**
 * Rate limiting for sensitive operations (simple in-memory implementation)
 * For production, use redis-based rate limiting
 */
const rateLimitMap = new Map();

const rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip + ":" + req.originalUrl;
    const now = Date.now();

    if (rateLimitMap.has(key)) {
      const record = rateLimitMap.get(key);

      // Reset if window has passed
      if (now - record.firstAttempt > windowMs) {
        rateLimitMap.set(key, { count: 1, firstAttempt: now });
        return next();
      }

      // Check if limit exceeded
      if (record.count >= maxAttempts) {
        return res.status(429).json({
          success: false,
          message: "Too many attempts. Please try again later.",
          retryAfter: Math.ceil((record.firstAttempt + windowMs - now) / 1000),
        });
      }

      record.count++;
      rateLimitMap.set(key, record);
    } else {
      rateLimitMap.set(key, { count: 1, firstAttempt: now });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  adminOnly,
  rateLimit,
};
