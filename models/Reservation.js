const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tableNumber: {
      type: Number,
      //required: true,
    },

    reservationDate: {
      type: Date,
      required: true,
    },

    reservationTime: {
      type: String,
      required: true,
    },

    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);