const mongoose = require("mongoose");

const purchaseHistory = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
});

const wishList = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
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
  purchaseHistory: [purchaseHistory] || [],
  wishList: [wishList] || [],
});

module.exports = mongoose.model("User", userSchema);
