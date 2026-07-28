const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const admin = require("./middleware/adminMiddleware");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tableRoutes = require("./routes/tableRoutes");



dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.get("/api/profile", protect, (req, res) => {

  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user
  });

});

app.get("/api/admin/dashboard", protect, admin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin"
  });
});

app.get("/", (req, res) => {
  res.send("Restaurant Management API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
