const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createFeedback,
  getAllFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

// Customer
router.post("/", protect, createFeedback);

// Public
router.get("/", getAllFeedback);

// Admin
router.delete("/:id", protect, admin, deleteFeedback);

module.exports = router;