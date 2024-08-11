const mongoose = require("mongoose");
const Product = require("./products").schema;
const Order = require("./order").schema;

const purchaseHistory = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
  productImage: String,
});

const userSchema = mongoose.Schema({
  points: Number,
  email: String,
  password: String,
  name: String,
  lastName: String,
  phoneNumber: String || "",
  address: String || "",
  zip: String || "",
  town: String || "",
  cart: [Order],
  purchaseHistory: [purchaseHistory] || [],
  wishList: [Product],
});

module.exports = mongoose.model("User", userSchema);
