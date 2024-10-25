const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
  productImage: String,
  quantity: Number,
  sava: Boolean,
  savaPrice: Number,
});

module.exports = mongoose.model("Order", orderSchema);
