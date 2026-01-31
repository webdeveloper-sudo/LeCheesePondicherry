const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "reset-password", "verify-email", "verify-mobile"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for automatic cleanup and fast lookups
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index - auto delete expired docs

// Method to check if OTP is valid
otpSchema.methods.isValid = function () {
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < 5;
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function (length = 6) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  ).toString();
};

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
