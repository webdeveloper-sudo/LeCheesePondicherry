const Order = require("../models/Order");
const User = require("../models/User");
const { createOrderSession, getCashfreeOrder } = require("../utils/cashfree");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

/**
 * @desc    Initiate payment session (WITHOUT creating order in DB)
 * @route   POST /api/orders/session
 * @access  Private
 */
const createPaymentSession = async (req, res) => {
  try {
    const { finalAmount, shippingAddress } = req.body;

    if (!finalAmount || isNaN(finalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
        error: `Amount received: ${finalAmount}`,
      });
    }

    if (!shippingAddress || !shippingAddress.mobile) {
      return res.status(400).json({
        success: false,
        message: "Shipping address or phone is missing",
        error: "Phone number is required for payment",
      });
    }

    // Generate unique Order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log(
      `[Order] Creating session for ${req.user.email}, amount: ${finalAmount}`,
    );

    // Create Cashfree Payment Session
    const cashfreeOrder = await createOrderSession({
      orderId,
      amount: finalAmount,
      customerId: req.user._id.toString(),
      customerName: req.user.name || "Customer",
      customerEmail: req.user.email,
      customerPhone: shippingAddress.mobile,
    });

    res.status(200).json({
      success: true,
      data: {
        payment_session_id: cashfreeOrder.payment_session_id,
        order_id: cashfreeOrder.order_id,
      },
    });
  } catch (error) {
    console.error("Create Session Error Stack:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate payment",
      error: error.message || "Unknown error",
    });
  }
};

/**
 * @desc    Verify payment & ONLY THEN create order in DB
 * @route   POST /api/orders/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { orderId, orderData } = req.body;

    // 1. Get status from Cashfree
    const cfOrder = await getCashfreeOrder(orderId);

    // 2. Check if order already exists (prevent duplicate creation)
    let order = await Order.findOne({ orderId });

    if (cfOrder.order_status === "PAID") {
      try {
        if (!order) {
          // Create Order ONLY NOW
          order = await Order.create({
            orderId,
            user: req.user._id,
            items: orderData.items,
            orderAmount: orderData.orderAmount,
            discount: orderData.discount || 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            taxAmount: orderData.taxAmount || 0,
            finalAmount: orderData.finalAmount,
            deliveryAddress: orderData.shippingAddress,
            paymentStatus: "completed",
            orderStatus: "placed",
            paymentOn: new Date(),
            transactionId: cfOrder.cf_order_id,
            paymentMode: cfOrder.payment_session_id ? "online" : "unknown",
            trackingHistory: [
              {
                status: "placed",
                title: "Order Placed",
                description: "Your order has been placed successfully.",
                timestamp: new Date(),
              },
            ],
          });

          // Sync to User History & Clear Cart
          await User.findByIdAndUpdate(req.user._id, {
            $push: { orders: order.toObject() },
            $set: { cart: [] },
          });

          // Trigger Emails
          try {
            await sendOrderConfirmationEmail(order, req.user);
          } catch (emailErr) {
            console.error("Email Error:", emailErr);
          }
        }

        return res.status(200).json({
          success: true,
          message: "Order placed successfully",
          data: order,
        });
      } catch (dbError) {
        console.error("DB Error during order creation:", dbError);
        return res.status(500).json({
          success: false,
          message:
            "Failed to save order after payment. Please contact support.",
          error: dbError.message,
        });
      }
    } else {
      // Payment NOT successful (Failed, Cancelled, or Pending)
      // We can choose to save a "failed" order if we want tracking of failures
      if (
        !order &&
        (cfOrder.order_status === "FAILED" ||
          cfOrder.order_status === "CANCELLED")
      ) {
        order = await Order.create({
          orderId,
          user: req.user._id,
          items: orderData.items,
          orderAmount: orderData.orderAmount,
          finalAmount: orderData.finalAmount,
          deliveryAddress: orderData.shippingAddress,
          paymentStatus: "failed",
          orderStatus: "cancelled", // Or a specific failed status
          trackingHistory: [
            {
              status: "cancelled",
              title: "Payment Failed / Cancelled",
              description: "The payment session failed or was cancelled.",
              timestamp: new Date(),
            },
          ],
        });
      }

      console.log(
        `[Cashfree Verify] Order: ${orderId}, Status: ${cfOrder.order_status}`,
      );

      const retryableStatuses = ["ACTIVE", "PENDING", "INITIALIZED"];
      const isRetryable = retryableStatuses.includes(cfOrder.order_status);

      return res.status(200).json({
        success: false,
        message: isRetryable
          ? "Payment processing..."
          : `Payment failed with status: ${cfOrder.order_status}`,
        cfStatus: cfOrder.order_status,
        canRetry: isRetryable,
      });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's own orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/all
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

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
 * @desc    Update order status and tracking info
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const updateOrder = async (req, res) => {
  try {
    const {
      orderStatus,
      trackingNumber,
      courierPartner,
      estimatedDeliveryDate,
      notes,
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update fields
    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      
      const statusTitles = {
        placed: "Order Placed",
        confirmed: "Order Confirmed",
        processing: "Order Processing",
        shipped: "Order Shipped",
        out_for_delivery: "Out for Delivery",
        delivered: "Order Delivered",
        cancelled: "Order Cancelled",
        returned: "Order Returned",
      };
      
      const statusDescriptions = {
        placed: "We have received your order.",
        confirmed: "Your payment has been verified and your order is confirmed.",
        processing: "We are preparing your delicious cheese order.",
        shipped: `Your package has been handed over to courier partner${courierPartner ? " " + courierPartner : ""}.`,
        out_for_delivery: "Your package is out for delivery and will arrive today.",
        delivered: "Enjoy your delicious cheese! Delivered successfully.",
        cancelled: "Your order has been cancelled.",
        returned: "The package has been returned to our facility.",
      };

      order.trackingHistory.push({
        status: orderStatus,
        title: statusTitles[orderStatus] || `Status Updated: ${orderStatus}`,
        description: statusDescriptions[orderStatus] || `Order status has been updated to ${orderStatus}.`,
        timestamp: new Date(),
      });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierPartner) order.courierPartner = courierPartner;
    if (estimatedDeliveryDate)
      order.estimatedDeliveryDate = estimatedDeliveryDate;
    if (notes) order.notes = notes;
    if (req.body.trackingHistory) {
      order.trackingHistory = req.body.trackingHistory;
    }

    await order.save();

    // Sync to User's nested orders array
    await User.updateOne(
      { _id: order.user, "orders._id": order._id },
      {
        $set: {
          "orders.$.orderStatus": order.orderStatus,
          "orders.$.trackingNumber": order.trackingNumber,
          "orders.$.courierPartner": order.courierPartner,
          "orders.$.estimatedDeliveryDate": order.estimatedDeliveryDate,
          "orders.$.notes": order.notes,
          "orders.$.trackingHistory": order.trackingHistory,
        },
      }
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentSession,
  verifyPayment,
  getMyOrders,
  getOrders,
  updateOrder,
};
