const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/users");
const Product = require("../models/products");

router.post("/signup", async (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.json({ status: false, message: "User already exist" });
  } else {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastName,
      email,
      password: hashPassword,
    });

    await newUser
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          status: true,
          message: "User registered!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
});

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ message: "user is not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ status: false, message: "password is incorrect" });
  }

  const token = jwt.sign({ email: user.email }, process.env.KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });

  User.findOne({ email: email })
    .exec()
    .then((user) => {
      res.json({
        status: true,
        message: "Login successfully",
        userFromReq: {
          name: user.name,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
          points: user.points,
          town: user.town,
          zip: user.zip,
          purchaseHistory: user.purchaseHistory,
          wishList: user.wishList,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update-user", async (req, res, next) => {
  const user = req.body;

  User.findOneAndUpdate({ email: user.email }, user)
    .exec()
    .then(() => {
      res.json({
        status: true,
        message: "Updated info successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: false,
        message: "Error",
        err: err,
      });
    });
});

router.post("/resetPassword-profilePage", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
    return res.json({ status: true, message: "Updated password!" });
  } catch (err) {
    return res.json({ status: false, message: "Invalid token!" });
  }
});

router.post("/forgot-password", async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ status: false, message: "User is not registered!" });
    }

    const token = jwt.sign({ email: user.email }, process.env.KEY, {
      expiresIn: "5m",
    });

    console.log(token);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "danijel.osovnikar@gmail.com",
        pass: "ficr xxft fpgp fajp",
      },
    });

    var mailOptions = {
      from: "danijel.osovnikar@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:4200/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: false, message: "Error sending email!" });
      } else {
        return res.json({ status: true, message: "Email sent!" });
      }
    });
  } catch (err) {}
});

router.post("/resetPassword/:token", async (req, res, next) => {
  const password = req.body.password;
  const token = req.params.token;

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const email = decoded.email;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: email }, { password: hashedPassword });
    return res.json({ status: true, message: "Updated password!" });
  } catch (err) {
    return res.json({ status: false, message: "Invalid token!" });
  }
});

router.post("/addToWishlist", async (req, res, next) => {
  const ean = req.body.ean;
  const email = req.body.email;

  Product.findOne({ ean: ean })
    .then(async (product) => {
      await User.findOneAndUpdate(
        { email: email },
        { $push: { wishList: product } }
      )
        .then((response) => {
          res.json({ status: true, message: "Item added" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getWishlistItems", (req, res, next) => {
  const email = JSON.parse(req.query.email);

  User.findOne({ email: email })
    .then((response) => {
      res.json({ status: true, wishlist: response.wishList });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/removeFromWishlist", async (req, res, next) => {
  console.log();
});

module.exports = router;