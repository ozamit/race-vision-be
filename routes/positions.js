const express = require("express");
const router = express.Router();
const positionsController = require("../controllers/positionsController");

router.route("/getallpositions").get(positionsController.getAllPositions);
router.route("/saveFinalRaceResultToDB").get(positionsController.saveFinalRaceResultToDB);
router.route("/getRaceResultFromDB").get(positionsController.getRaceResultFromDB);

router.route("/testing").get(positionsController.testing);

// New routes without connection to external API
router.route("/saveFinalRaceResultFromAdminToDB").post(positionsController.saveFinalRaceResultFromAdminToDB);

module.exports = router;