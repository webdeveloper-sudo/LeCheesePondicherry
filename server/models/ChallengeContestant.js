const mongoose = require("mongoose");

const challengeContestantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    instagramHandle: {
      type: String,
      required: [true, "Instagram handle is required"],
      trim: true,
    },
    reelUrl: {
      type: String,
      required: [true, "Instagram Reel URL is required"],
      trim: true,
    },
    dishName: {
      type: String,
      default: "Cheesy Creation",
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "disqualified"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    city: {
      type: String,
      default: "Pondicherry",
    },
    isPublicAccount: {
      type: Boolean,
      default: true,
    },
    isFirst10SecIntro: {
      type: Boolean,
      default: true,
    },
    isTermsAgreed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast leaderboard queries
challengeContestantSchema.index({ views: -1, createdAt: 1 });
challengeContestantSchema.index({ fullName: "text", instagramHandle: "text" });

module.exports = mongoose.model("ChallengeContestant", challengeContestantSchema);
