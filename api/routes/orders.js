const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/products");
const User = require("../models/users");

router.get("/", (req, res, next) => {
  console.log(req.query);
  const email = JSON.parse(req.query.email);

  User.findOne({ email: email })
    .then((response) => {
      res.json({ status: true, cart: response.cart });
    })
    .catch((err) => {
      res.json({ status: false, message: err });
    });
});

router.post("/addToCart", (req, res, next) => {
  const ean = req.body.ean;
  const email = req.body.email;
  const qty = req.body.quantity;

  Product.findOne({ ean: ean })
    .then(async (product) => {
      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
      }
      let item = await {
        name: product.name,
        ean: ean,
        price: product.price,
        productImage: product.productImage[0],
        quantity: qty,
      };

      await User.findOne({ email: email })
        .then(async (response) => {
          let filter = response.cart.filter((item) => {
            return item.ean == ean;
          });
          if (filter.length == 0) {
            await User.findOneAndUpdate(
              { email: email },
              { $push: { cart: item } }
            )
              .then((response) => {
                res.json({ status: true, message: "Item added" });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            for (let i of response.cart) {
              if (i.ean === ean) {
                i.quantity += qty;
              }
            }
            let newCart = response.cart;

            await User.findOneAndUpdate(
              { email: email },
              { $set: { cart: newCart } }
            )
              .then((response) => {
                res.json({ status: true, message: "Item added", item: item });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/addToCart/:ean", async (req, res, next) => {
  const email = req.body.email;
  const ean = req.params.ean;

  User.findOne({ email: email }).then(async (response) => {
    for (let item of response.cart) {
      if (item.ean == ean) {
        item.quantity += 1;
      }
    }
    await User.findOneAndUpdate(
      { email: email },
      { $set: { cart: response.cart } }
    )
      .then((result) => {
        res.json({ status: true, message: "Item added to cart!" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.delete("/removeFromCart/:ean", async (req, res, next) => {
  const ean = req.params.ean;
  const removeAll = JSON.parse(req.query.removeAll);
  const email = JSON.parse(req.query.email);

  if (removeAll === true) {
    User.findOne({ email: email }).then(async (response) => {
      let list = response.cart.filter((item) => {
        return item.ean != ean;
      });

      await User.findOneAndUpdate({ email: email }, { $set: { cart: list } })
        .then((result) => {
          res.json({ status: true, message: "Item deleted from cart!" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    User.findOne({ email: email }).then(async (response) => {
      for (let item of response.cart) {
        if (item.ean == ean) {
          item.quantity -= 1;
        }
      }
      await User.findOneAndUpdate(
        { email: email },
        { $set: { cart: response.cart } }
      )
        .then((result) => {
          res.json({ status: true, message: "Item deleted from cart!" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  // User.findOne({ email: email })
  //   .then(async (response) => {
  //     for (let item of response.cart) {
  //       if (item.ean == ean && item.quantity >= 2) {
  //         await User.findOneAndUpdate(
  //           { email: email },
  //           { $set: { "cart.$[t].quantity": item.quantity - 1 } },
  //           { arrayFilters: [{ "t.ean": ean }] }
  //         )
  //           .then((result) => {
  //             res.json({ status: true, message: "Item deleted from cart!" });
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       } else {
  //         let list = response.cart.filter((item) => {
  //           return item.ean != ean;
  //         });
  //         await User.findOneAndUpdate(
  //           { email: email },
  //           { $set: { cart: list } }
  //         )
  //           .then((result) => {
  //             res.json({ status: true, message: "Item deleted from cart!" });
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       }
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

// router.get("/:orderId", (req, res, next) => {
//   Order.findById(req.params.orderId)
//     .populate("product")
//     .exec()
//     .then((order) => {
//       if (!order) {
//         return res.status(404).json({
//           message: "Order not found",
//         });
//       }
//       res.status(200).json({ order });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

// router.delete("/:orderId", (req, res, next) => {
//   Order.deleteOne({ _id: req.params.orderId })
//     .then((result) => {
//       res.status(200).json({
//         message: "Order deleted",
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

module.exports = router;
