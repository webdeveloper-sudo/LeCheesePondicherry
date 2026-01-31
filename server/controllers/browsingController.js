const User = require("../models/User");

const MAX_PREFERENCES = 5;
const MAX_BROWSING_HISTORY = 50;

/**
 * @desc    Track product view and update browsing history & preferences
 * @route   POST /api/browsing/track
 * @access  Private
 */
const trackProductView = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // We still need to fetch the user to calculate the new history and preferences locally
    // but we use findOneAndUpdate to save it safely or use a retry logic.
    // However, the cleanest way to fix VersionError while maintaining complex array logic
    // is to fetch, modify, and save with a retry or use a more atomic approach.

    // ATOMIC APPROACH:
    // 1. Remove if exists ($pull)
    // 2. Add to front ($push with $position: 0)
    // 3. Slice to max ($slice)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { browsingHistory: { productId: productId } },
      },
      { new: true },
    );

    const finalUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          browsingHistory: {
            $each: [{ productId, viewedAt: new Date() }],
            $position: 0,
            $slice: MAX_BROWSING_HISTORY,
          },
        },
      },
      { new: true },
    );

    // 3. Update preferences atomically without using .save() to avoid VersionError
    const finalResult = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          preferences: finalUser.browsingHistory.slice(0, MAX_PREFERENCES),
        },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Product view tracked",
      preferences: finalResult.preferences,
      recentlyViewed: finalResult.browsingHistory.slice(0, 10),
    });
  } catch (error) {
    console.error("Track product view error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track product view",
    });
  }
};

/**
 * @desc    Get user's browsing history
 * @route   GET /api/browsing/history
 * @access  Private
 */
const getBrowsingHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const userId = req.user._id;

    const user = await User.findById(userId).select("browsingHistory");

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    const paginatedHistory = user.browsingHistory.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      browsingHistory: paginatedHistory,
      totalItems: user.browsingHistory.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(user.browsingHistory.length / limit),
    });
  } catch (error) {
    console.error("Get browsing history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch browsing history",
    });
  }
};

/**
 * @desc    Get user's preferences (last 5 viewed items)
 * @route   GET /api/browsing/preferences
 * @access  Private
 */
const getPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("preferences");

    res.status(200).json({
      success: true,
      preferences: user.preferences || [],
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch preferences",
    });
  }
};

/**
 * @desc    Clear browsing history
 * @route   DELETE /api/browsing/history
 * @access  Private
 */
const clearBrowsingHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      browsingHistory: [],
      preferences: [],
    });

    res.status(200).json({
      success: true,
      message: "Browsing history cleared",
    });
  } catch (error) {
    console.error("Clear browsing history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear browsing history",
    });
  }
};

/**
 * @desc    Get recently viewed products (for "Continue Shopping" section)
 * @route   GET /api/browsing/recently-viewed
 * @access  Private (optional auth for guests)
 */
const getRecentlyViewed = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    if (!req.user) {
      return res.status(200).json({
        success: true,
        recentlyViewed: [],
      });
    }

    const user = await User.findById(req.user._id).select("browsingHistory");

    res.status(200).json({
      success: true,
      recentlyViewed: user.browsingHistory.slice(0, parseInt(limit)),
    });
  } catch (error) {
    console.error("Get recently viewed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recently viewed",
    });
  }
};

module.exports = {
  trackProductView,
  getBrowsingHistory,
  getPreferences,
  clearBrowsingHistory,
  getRecentlyViewed,
};
