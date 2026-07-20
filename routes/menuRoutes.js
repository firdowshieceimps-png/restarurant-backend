const express = require("express");
const router = express.Router();

const {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getMenus);
router.get("/:id", getMenuById);

// Admin Routes
router.post("/", protect, admin, createMenu);
router.put("/:id", protect, admin, updateMenu);
router.delete("/:id", protect, admin, deleteMenu);

module.exports = router;