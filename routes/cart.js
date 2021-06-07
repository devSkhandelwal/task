const express = require("express");

const cart = require("../controllers/cart");

const router = express.Router();

router.route("/add").post(cart.addToCart);

module.exports = router;
