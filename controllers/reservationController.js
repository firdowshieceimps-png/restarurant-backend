const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// Customer Reserve Table
const createReservation = async (req, res) => {
  try {
    console.log("Reservation Request Body:", req.body);
    const {
      reservationDate,
      reservationTime,
      numberOfGuests,
    } = req.body;

    if (
      !reservationDate ||
      !reservationTime ||
      !numberOfGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const selectedDate = new Date(reservationDate);

    const nextDate = new Date(reservationDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Find tables that can accommodate the guests
    const suitableTables = await Table.find({
      capacity: {
        $gte: Number(numberOfGuests),
      },
    }).sort({ capacity: 1 });

    if (suitableTables.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No table available for the selected number of guests",
      });
    }

    // Find booked tables for the selected date and time
    const bookedReservations =
      await Reservation.find({
        reservationDate: {
          $gte: selectedDate,
          $lt: nextDate,
        },
        reservationTime,
        status: "Booked",
      });

    const bookedTables =
      bookedReservations.map(
        (reservation) =>
          reservation.tableNumber
      );

    // Get first available table
    const availableTable =
      suitableTables.find(
        (table) =>
          !bookedTables.includes(
            table.tableNumber
          )
      );

    if (!availableTable) {
      return res.status(400).json({
        success: false,
        message:
          "No tables available for the selected date and time",
      });
    }

    const reservation =
      await Reservation.create({
        customer: req.user.id,
        tableNumber:
          availableTable.tableNumber,
        reservationDate,
        reservationTime,
        numberOfGuests,
      });

    res.status(201).json({
      success: true,
      message: `Table ${availableTable.tableNumber} reserved successfully`,
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
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

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
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

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

    const reservation =
      await Reservation.findById(
        req.params.id
      );

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
      message:
        "Reservation updated successfully",
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
    const reservation =
      await Reservation.findById(
        req.params.id
      );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (
      reservation.customer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    reservation.status = "Cancelled";

    await reservation.save();

    res.status(200).json({
      success: true,
      message:
        "Reservation cancelled successfully",
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
