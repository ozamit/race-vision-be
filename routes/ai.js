const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.route("/trackInsight").post(aiController.trackInsight);

module.exports = router;