const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

const getAvailableTables = async (req, res) => {
  try {
    const { date, time } = req.query;

    const selectedDate = new Date(date);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const tables = await Table.find();

    const reservations = await Reservation.find({
      reservationDate: {
        $gte: selectedDate,
        $lt: nextDate,
      },
      reservationTime: time,
      status: "Booked",
    });

    const bookedTables = reservations.map(
      (reservation) => reservation.tableNumber
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
