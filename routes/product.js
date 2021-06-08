const express = require("express");

const product = require("../controllers/product");
const user = require("../controllers/user");

const router = express.Router();

router
  .route("/")
  .post(user.porotected, user.restrictTo("shop", "admin"), product.addProduct)
  .get(product.getProducts);

router.route("/:id").get(user.porotected, product.getProduct);

module.exports = router;
