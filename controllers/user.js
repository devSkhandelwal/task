const User = require("../models/user");

exports.signin = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    res.json({
      id: newUser._id,
    });
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("provide all fields");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("user not exists");
    if (password !== user.password) throw new Error("Incorrect password");

    res.json({
      id: user._id,
    });
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
