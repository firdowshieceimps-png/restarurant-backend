const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

const getAvailableTables = async (req, res) => {
  try {
    const { date, time } = req.query;

    const tables = await Table.find();

    const reservations = await Reservation.find({
      reservationDate: date,
      reservationTime: time,
      status: "Booked",
    });

    const bookedTables = reservations.map(
      (r) => r.tableNumber
    );

    const result = tables.map((table) => ({
      _id: table._id,
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      available: !bookedTables.includes(
        table.tableNumber
      ),
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAvailableTables,
};
