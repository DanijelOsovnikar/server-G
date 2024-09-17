const mongoose = require("mongoose");
const Product = require("./products").schema;
const Order = require("./order").schema;

const Info = mongoose.Schema({
  name: String || null,
  phone: String || null,
  deliveryType: String,
  deliveryTo: String,
  city: String || null,
  zip: String || null,
  shop: String || null,
  nameIfShop: String || null,
  phoneIfShop: String || null,
  emailIfShop: String || null,
  personOrCompany: String,
  paymentMethod: String,
});

const CartOrder = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
  productImage: String,
  quantity: Number,
  _id: mongoose.Schema.Types.ObjectId,
});

const purchaseHistory = mongoose.Schema({
  info: Info,
  cart: [CartOrder],
  discount: String,
  points: String,
  totalAmount: String,
  date: Date,
  orderNum: Number,
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
