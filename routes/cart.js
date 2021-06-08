const express = require("express");

const cart = require("../controllers/cart");
const user = require("../controllers/user");
const router = express.Router();

router.route("/add").post(user.porotected, cart.addToCart);
router.route("/remove").post(user.porotected, cart.removeToCart);
router
  .route("/remove/items")
  .get(user.porotected, user.restrictTo("admin"), cart.userRemovedItemList);

module.exports = router;
