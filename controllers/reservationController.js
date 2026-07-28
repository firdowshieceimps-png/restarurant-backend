const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// Customer Reserve Table
const createReservation = async (req, res) => {
  try {
    const {
      tableNumber,
      reservationDate,
      reservationTime,
      numberOfGuests,
    } = req.body;

    if (
      !tableNumber ||
      !reservationDate ||
      !reservationTime ||
      !numberOfGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const table = await Table.findOne({ tableNumber });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (numberOfGuests > table.capacity) {
      return res.status(400).json({
        success: false,
        message: `This table can accommodate only ${table.capacity} guests`,
      });
    }

    const existingReservation = await Reservation.findOne({
      tableNumber,
      reservationDate,
      reservationTime,
      status: "Booked",
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "Table already booked for this date and time",
      });
    }

    const reservation = await Reservation.create({
      customer: req.user.id,
      tableNumber,
      reservationDate,
      reservationTime,
      numberOfGuests,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer - View My Reservations
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      customer: req.user.id,
    }).populate("customer", "name email");

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - View All Reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("customer", "name email");

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin - Update Reservation Status
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    reservation.status = status;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer - Cancel Reservation
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Only owner can cancel
    if (reservation.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    reservation.status = "Cancelled";

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
};
