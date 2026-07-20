const User = require("../models/User");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const Feedback = require("../models/Feedback");

const getDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalMenuItems = await Menu.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalReservations = await Reservation.countDocuments();

    const totalFeedback = await Feedback.countDocuments();

    const recentOrders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReservations = await Reservation.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,

      statistics: {
        totalUsers,
        totalMenuItems,
        totalOrders,
        totalReservations,
        totalFeedback,
      },

      recentOrders,

      recentReservations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getDashboard,
};