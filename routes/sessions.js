const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");

router.route("/getracesessionsforyear").get(sessionsController.getracesessionsforyear);

module.exports = router;