const express = require("express");
const router = express.Router();
const positionsController = require("../controllers/positionsController");

router.route("/getallpositions").get(positionsController.getAllPositions);

module.exports = router;