const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const uri =
  "mongodb+srv://Danijel:" +
  process.env.MONGO_ATLAS_PW +
  "@clusterg.ikvqsnr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterG";
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET "
    );
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json({});
  }
  next();
});

app.use(cookieParser());
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
