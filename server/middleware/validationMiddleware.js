const { body, param, validationResult } = require("express-validator");

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Email validation
const validateEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  handleValidationErrors,
];

// OTP validation
const validateOTP = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
  handleValidationErrors,
];

// Password validation
const validatePassword = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage("Password must contain both letters and numbers"),
  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Profile validation
const validateProfile = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must only contain alphabets and spaces")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("mobile")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Mobile number must be numeric")
    .isLength({ min: 7, max: 15 })
    .withMessage("Mobile number must be between 7 and 15 digits"),
  body("countryCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country code is required"),
  handleValidationErrors,
];

// Address validation
const validateAddress = [
  body("type")
    .optional()
    .isIn(["home", "work", "other"])
    .withMessage("Address type must be home, work, or other"),
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 500 })
    .withMessage("Address must be less than 500 characters"),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .isNumeric()
    .withMessage("Pincode must be numeric")
    .isLength({ min: 5, max: 10 })
    .withMessage("Please provide a valid pincode"),
  body("countryCode").trim().notEmpty().withMessage("Country code is required"),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isNumeric()
    .withMessage("Mobile number must be numeric"),
  handleValidationErrors,
];

// Cart item validation
const validateCartItem = [
  body("productId").trim().notEmpty().withMessage("Product ID is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  handleValidationErrors,
];

// Wishlist item validation
const validateWishlistItem = [
  body("productId").trim().notEmpty().withMessage("Product ID is required"),
  handleValidationErrors,
];

// Product ID param validation
const validateProductIdParam = [
  param("productId").trim().notEmpty().withMessage("Product ID is required"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validateOTP,
  validatePassword,
  validateLogin,
  validateProfile,
  validateAddress,
  validateCartItem,
  validateWishlistItem,
  validateProductIdParam,
};
