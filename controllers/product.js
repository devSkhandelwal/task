const Product = require("../models/product");

exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, createdBy } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      createdBy: req.user._id,
    });

    res.json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error.message);
    return next(new Error(error.message));
  }
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  if (!products) {
    res.json("No product");
  } else {
    res.json(products);
  }
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("product no loger exist"));
  } else {
    res.json(product);
  }
};
