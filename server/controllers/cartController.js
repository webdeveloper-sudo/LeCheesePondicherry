const User = require("../models/User");

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("cart");

    if (!user) {
      if (req.user.role === "admin") {
        return res.status(200).json({
          success: true,
          cart: [],
          itemCount: 0,
          message: "Admins do not have a cart",
        });
      }
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart || [],
      itemCount:
        user.cart?.reduce((total, item) => total + item.quantity, 0) || 0,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, weight, price } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Check if item already exists in cart with same product ID AND weight
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId && item.weight === weight,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
      // Also update price in case it changed (though usually tied to weight)
      if (price) user.cart[existingItemIndex].price = price;
    } else {
      // Add new item
      user.cart.push({
        productId,
        quantity,
        weight: weight || "200g",
        price: price || 0,
        addedAt: new Date(),
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: user.cart,
      itemCount: user.getCartItemCount(),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, weight } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const user = await User.findById(userId);

    const itemIndex = user.cart.findIndex(
      (item) =>
        item.productId === productId && (weight ? item.weight === weight : true),
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
      itemCount: user.getCartItemCount(),
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { weight } = req.query; // Allow weight as query param for specific removal
    const userId = req.user._id;

    const user = await User.findById(userId);

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          (weight ? item.weight === weight : true)
        ),
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
      itemCount: user.getCartItemCount(),
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { cart: [] });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: [],
      itemCount: 0,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
