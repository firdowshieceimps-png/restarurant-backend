const Feedback = require("../models/Feedback");

// Customer Submit Feedback
const createFeedback = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Rating and review are required",
      });
    }

    const feedback = await Feedback.create({
      customer: req.user.id,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Public - View All Feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Delete Feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  deleteFeedback,
};