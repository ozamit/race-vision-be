const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");

router.route("/getracesessionsforyear").get(sessionsController.getracesessionsforyear);
router.route("/getNextRaceSession").get(sessionsController.getNextRaceSession);


module.exports = router;