const express = require("express");
const router = express.Router();
const driversController = require("../controllers/driversController");

router.route("/getdrivers").get(driversController.getDrivers);
router.route("/getDriversLocalDB").get(driversController.getDriversLocalDB);
router.route("/saveDriversToDB").post(driversController.saveDriversToDB);

module.exports = router;