const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);

router.put("/:id", protect, admin, updateOrderStatus);
router.put("/cancel/:id", protect, cancelOrder);

module.exports = router;