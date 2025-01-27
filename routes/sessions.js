const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");

router.route("/getracesessionsforyear").get(sessionsController.getracesessionsforyear);
router.route("/getNextRaceSession").get(sessionsController.getNextRaceSession);
router.route("/saveSessionsToDB").get(sessionsController.saveSessionsToDB);
router.route("/getNextRaceSessionFromDB").get(sessionsController.getNextRaceSessionFromDB);
router.route("/getRaceSessionsForYearFromDB").get(sessionsController.getRaceSessionsForYearFromDB);






module.exports = router;