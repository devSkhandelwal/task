const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/user");

const signAccessToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ token });
};

exports.signin = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    signAccessToken(newUser._id, res);
  } catch (error) {
    console.log(error.message);
    return next(new Error(error.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("provide all fields"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) next(new Error("user not exists"));
    if (!(await user.checkPasword(password, user.password))) {
      return next(new Error("Incorrect password"));
    }

    signAccessToken(user._id, res);
  } catch (error) {
    console.log(error.message);
    return next(new Error(error.message));
  }
};

exports.porotected = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new Error("Please login"));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new Error("This user no longer exists"));
  }

  req.user = currentUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.roles);
    if (!roles.includes(req.user.roles)) {
      return next(new Error("you do not have permission for this route"));
    }
    next();
  };
};
