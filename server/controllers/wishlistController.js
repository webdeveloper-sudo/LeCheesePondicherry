const User = require("../models/User");

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist || [],
      count: user.wishlist?.length || 0,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist/add
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Check if item already exists in wishlist
    const exists = user.wishlist.some((item) => item.productId === productId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Item already in wishlist",
      });
    }

    user.wishlist.push({
      productId,
      addedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to wishlist",
      wishlist: user.wishlist,
      count: user.wishlist.length,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to wishlist",
    });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
      (item) => item.productId !== productId,
    );

    if (user.wishlist.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      wishlist: user.wishlist,
      count: user.wishlist.length,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from wishlist",
    });
  }
};

/**
 * @desc    Move item from wishlist to cart
 * @route   POST /api/wishlist/move-to-cart/:productId
 * @access  Private
 */
const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Check if item is in wishlist
    const wishlistIndex = user.wishlist.findIndex(
      (item) => item.productId === productId,
    );

    if (wishlistIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    // Remove from wishlist
    user.wishlist.splice(wishlistIndex, 1);

    // Add to cart (or update quantity if exists)
    const cartIndex = user.cart.findIndex(
      (item) => item.productId === productId,
    );

    if (cartIndex > -1) {
      user.cart[cartIndex].quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity,
        addedAt: new Date(),
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item moved to cart",
      wishlist: user.wishlist,
      cart: user.cart,
      wishlistCount: user.wishlist.length,
      cartItemCount: user.getCartItemCount(),
    });
  } catch (error) {
    console.error("Move to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to move item to cart",
    });
  }
};

/**
 * @desc    Toggle wishlist item (add if not exists, remove if exists)
 * @route   POST /api/wishlist/toggle
 * @access  Private
 */
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const existingIndex = user.wishlist.findIndex(
      (item) => item.productId === productId,
    );

    let action;
    if (existingIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1);
      action = "removed";
    } else {
      // Add to wishlist
      user.wishlist.push({
        productId,
        addedAt: new Date(),
      });
      action = "added";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Item ${action} ${action === "added" ? "to" : "from"} wishlist`,
      action,
      isInWishlist: action === "added",
      wishlist: user.wishlist,
      count: user.wishlist.length,
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  toggleWishlist,
};
