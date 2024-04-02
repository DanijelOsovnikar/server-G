const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({ order });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
