const express = require("express");

const user = require("../controllers/user");

const router = express.Router();

router.route("/signin").post(user.signin);

module.exports = router;
