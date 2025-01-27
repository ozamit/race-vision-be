const express = require("express");
const router = express.Router();
const predictionsController = require("../controllers/predictionsController");

router.route("/savePredictions").post(predictionsController.savePredictions);
router.route("/getPredictionsByUserId").post(predictionsController.getPredictionsByUserId);
router.route("/updateFinalScoreforPrediction").get(predictionsController.updateFinalScoreforPrediction);



module.exports = router;
