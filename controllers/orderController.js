const Order = require("../models/Order");
const Menu = require("../models/Menu");

// Place Order
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const order = await Order.create({
      customer: req.user.id,
      items,
      totalAmount,
    });
    setTimeout(async () => {
      try {
        const currentOrder =
          await Order.findById(order._id);

        if (
          currentOrder &&
          currentOrder.status === "Pending"
        ) {
          currentOrder.status =
            "Preparing";

          await currentOrder.save();
        }
      } catch (error) {
        console.log(error);
      }
    }, 60000);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id,
    })
      .populate("customer", "name email")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled after preparation starts",
      });
    }

    const diffMinutes =
      (Date.now() -
        new Date(order.createdAt).getTime()) /
      (1000 * 60);

    if (diffMinutes > 1) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellation window expired",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};