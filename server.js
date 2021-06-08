const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");

const product = require("./routes/product");
const user = require("./routes/user");
const cart = require("./routes/cart");

const app = express();
dotenv.config();
connectDB();

app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/products", product);
app.use("/api/user", user);
app.use("/api/cart", cart);

app.all("*", (req, res, next) => {
  throw "not found";
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
