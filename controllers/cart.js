const Cart = require("../models/cart");
const Product = require("../models/product");
const RemovedItemCart = require("../models/removedItem");

exports.addToCart = async (req, res, next) => {
  const { productId, qty } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });

  const product = await Product.findById(productId);
  if (product) {
    if (product.stock < qty) {
      res.json("not in stock try with diffrent seller");
    }
  } else {
    return next(new Error("this product no longer exist"));
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
      userId: req.user._id,
      items: [{ productId, qty }],
    });
  }

  res.json(cart);
};

exports.removeToCart = async (req, res, next) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    const foundIndex = cart.items.findIndex(
      (item) => item.productId + "" === productId + ""
    );

    if (foundIndex !== -1) {
      cart.items.splice(foundIndex, 1);
      addRemovedItem(req.user._id, productId);
      await cart.save();
    } else {
      res.json({
        message: "this item not found in your cart",
      });
      return;
    }
  } else {
    res.json({
      message: "no item in your cart",
    });
    return;
  }
  res.json(cart);
};

const addRemovedItem = async (user, product) => {
  const removedItem = await RemovedItemCart.findOne({ userId: user });

  if (!removedItem) {
    await RemovedItemCart.create({
      userId: user,
      removedProduct: [product],
    });
  } else {
    removedItem.removedProduct.push(product);
    await removedItem.save();
  }
};

exports.userRemovedItemList = async (req, res) => {
  const itemList = await RemovedItemCart.find();
  if (itemList) {
    res.json(itemList);
  } else {
    res.json("no item found");
  }
};
