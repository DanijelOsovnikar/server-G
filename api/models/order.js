const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: String,
  ean: Number,
  price: Number,
  productImage: String,
  quantity: Number,
});

module.exports = mongoose.model("Order", orderSchema);
