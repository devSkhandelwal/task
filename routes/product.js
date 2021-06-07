const express = require("express");

const product = require("../controllers/product");

const router = express.Router();

router.route("/").post(product.addProduct).get(product.getProducts);

router.route("/:id").get(product.getProduct);

module.exports = router;
