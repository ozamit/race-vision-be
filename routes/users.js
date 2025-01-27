const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/login").post(usersController.login);
router.route("/register").post(usersController.register);
router.route("/getOneUser").post(usersController.getOneUser);
router.route("/getAllUsers").get(usersController.getAllUsers);

module.exports = router;