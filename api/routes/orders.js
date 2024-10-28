const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/products");
const User = require("../models/users");

router.get("/", (req, res, next) => {
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
  const sava = req.body.sava;
  const savaPrice = req.body.savaPrice;

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
        sava: sava,
        savaPrice: savaPrice,
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

router.post("/setSava/:ean", async (req, res, next) => {
  const email = req.body.email;
  const price = req.body.price;
  const ean = req.params.ean;

  User.findOne({ email: email }).then(async (response) => {
    for (let item of response.cart) {
      if (item.ean == ean) {
        item.savaPrice = price;
      }
    }
    await User.findOneAndUpdate(
      { email: email },
      { $set: { cart: response.cart } }
    )
      .then((result) => {
        res.json({
          status: true,
          message: "Item changed!",
          cart: response.cart,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/onOffSava/:ean", async (req, res, next) => {
  const email = req.body.email;
  const ean = req.params.ean;

  User.findOne({ email: email }).then(async (response) => {
    for (let item of response.cart) {
      if (item.ean == ean) {
        item.sava = !item.sava;
      }
    }
    await User.findOneAndUpdate(
      { email: email },
      { $set: { cart: response.cart } }
    )
      .then((result) => {
        res.json({
          status: true,
          message: "Item changed!",
          cart: response.cart,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/getSava", (req, res, next) => {
  const email = JSON.parse(req.query.email);

  User.findOne({ email: email })
    .then((response) => {
      let savaList = [];

      for (let i of response.purchaseHistory) {
        console.log(i);
        for (let j in i.cart) {
          if (i.cart[j].sava) {
            let first = 0;
            let second = 0;
            let qtyOfYears = 0;

            if (i.cart[j].price <= 30000) {
              first = 1045;
              second = 1832;
            } else if (i.cart[j].price > 30000 && i.cart[j].price < 60001) {
              first = 1378;
              second = 2461;
            } else if (i.cart[j].price > 60000 && i.cart[j].price < 90001) {
              first = 1970;
              second = 3220;
            } else if (i.cart[j].price > 90000 && i.cart[j].price < 120001) {
              first = 2784;
              second = 4449;
            } else if (i.cart[j].price > 120000 && i.cart[j].price < 180001) {
              first = 3416;
              second = 5502;
            } else if (i.cart[j].price > 180000 && i.cart[j].price <= 240000) {
              first = 3854;
              second = 6331;
            } else if (i.cart[j].price > 240000 && i.cart[j].price <= 300000) {
              first = 4398;
              second = 7200;
            }

            if (i.cart[j].savaPrice === first) {
              qtyOfYears = 1;
            }
            if (i.cart[j].savaPrice === second) {
              qtyOfYears = 2;
            }

            let obj = {
              itemImg: i.cart[j].productImage,
              itemName: i.cart[j].name,
              qtyOfYears: qtyOfYears,
              itemSavaPrice: i.cart[j].savaPrice,
              date: i.date,
            };

            savaList.push(obj);
          }
        }
      }
      res.json({ status: true, savaList: savaList });
    })
    .catch((err) => {
      res.json({ status: false, message: err });
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

router.post("/addOrder", async (req, res, next) => {
  const email = req.body.email;
  const ordered = req.body.orderItems;

  User.findOne({ email: email })
    .then(async (response) => {
      let points = response.points || 0;

      if (!response.points) {
        points = Number(ordered.points);
      } else {
        points = Number(response.points) + Number(ordered.points);
      }

      if (points >= 500) {
        points = 500;
      }

      await User.findOneAndUpdate(
        { email: email },
        {
          $push: { purchaseHistory: ordered },
          $set: { points: points },
        }
      )
        .then((result) => {
          res.json({ status: true, message: "Success" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allOrders", (req, res, next) => {
  const email = JSON.parse(req.query.email);
  console.log(email);

  User.findOne({ email: email })
    .then((response) => {
      res.json({ status: true, purchaseHistory: response.purchaseHistory });
    })
    .catch((err) => {
      res.json({ status: false, message: err });
    });
});

router.get("/points", (req, res, next) => {
  const email = JSON.parse(req.query.email);

  User.findOne({ email: email })
    .then((response) => {
      res.json({ status: true, points: response.points });
    })
    .catch((err) => {
      res.json({ status: false, message: err });
    });
});

router.delete("/emptyCart", (req, res, next) => {
  const email = JSON.parse(req.query.email);

  User.findOneAndUpdate({ email: email }, { $set: { cart: [] } })
    .then(async (response) => {})
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
