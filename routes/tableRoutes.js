const express = require("express");
const router = express.Router();

const {
  getAvailableTables,
} = require("../controllers/tableController");

router.get("/available", getAvailableTables);

module.exports = router;
