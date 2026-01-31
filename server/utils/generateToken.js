const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for user authentication
 * @param {Object} payload - User data to encode (typically { id, email, role })
 * @param {string} expiresIn - Token expiry time (default: 7 days)
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Generate refresh token with longer expiry
 * @param {Object} payload - User data to encode
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
