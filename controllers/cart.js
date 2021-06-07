const Cart = require("../models/cart");
const Product = require("../models/product");

exports.addToCart = async (req, res, next) => {
  const { user, productId, qty } = req.body;

  const cart = await Cart.findOne({ userId: user });

  const product = await Product.findById(id);
  if (product.stock < qty) {
    res.json("not in stock try with diffrent seller");
  }

  if (cart) {
    const foundIndex = cart.items.findIndex(
      (item) => item.productId + "" === productId + ""
    );

    if (foundIndex !== -1) {
      cart.items.splice(foundIndex, 1);
      cart.items.push({ productId, qty });
      await cart.save();
    } else {
      cart.items.push({ productId, qty });
      await cart.save();
    }
  } else {
    await Cart.create({
      userId: user,
      items: [{ productId, qty }],
    });
  }

  res.json(cart);
};

exports.removeToCart = async (req, res, next) => {
  const { user, productId } = req.body;

  const cart = await Cart.findOne({ userId: user });

  if (cart) {
    const foundIndex = cart.items.findIndex(
      (item) => item.productId + "" === productId + ""
    );

    if (foundIndex !== -1) {
      cart.items.splice(foundIndex, 1);
      await cart.save();
    } else {
      res.json({
        message: "this item not found in your cart",
      });
    }
  } else {
    res.json({
      message: "no item in your cart",
    });
  }

  res.json(cart);
};
