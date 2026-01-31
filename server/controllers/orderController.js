const Order = require("../models/Order");

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  try {
    // For now, returning dummy data as requested
    // But we can also attempt to fetch from DB if there are any
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      // Return some dummy data for initial visualization in admin panel
      return res.status(200).json({
        success: true,
        count: 2,
        isDummy: true,
        data: [
          {
            _id: "dummy1",
            orderId: "ORD-12345",
            user: { name: "John Doe", email: "john@example.com" },
            orderPlacedOn: new Date(),
            orderAmount: 500,
            finalAmount: 550,
            orderStatus: "placed",
            paymentStatus: "completed",
            items: [{ productName: "Baby Swiss", quantity: 2, price: 250 }],
          },
          {
            _id: "dummy2",
            orderId: "ORD-12346",
            user: { name: "Jane Smith", email: "jane@example.com" },
            orderPlacedOn: new Date(),
            orderAmount: 300,
            finalAmount: 320,
            orderStatus: "shipped",
            paymentStatus: "completed",
            items: [{ productName: "Mozzarella", quantity: 1, price: 300 }],
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
};
