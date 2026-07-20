const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
} = require("../controllers/reservationController");

// Customer
router.post("/", protect, createReservation);

router.get("/my-reservations", protect, getMyReservations);

router.put("/cancel/:id", protect, cancelReservation);

// Admin
router.get("/", protect, admin, getAllReservations);

router.put("/:id", protect, admin, updateReservationStatus);

module.exports = router;