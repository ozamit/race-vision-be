const express = require("express");
const router = express.Router();
const driversController = require("../controllers/driversController");

router.route("/getdrivers").get(driversController.getDrivers);

module.exports = router;