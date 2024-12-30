const express = require("express");
const router = express.Router();
const predictionsController = require("../controllers/predictionsController");

router.route("/savePredictions").post(predictionsController.savePredictions);

module.exports = router;
