const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");

router.route("/getsessionsforyear").get(sessionsController.getsessionsforyear);

module.exports = router;