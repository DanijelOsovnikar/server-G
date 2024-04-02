const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Product.find({})
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/mobilePhones/", (req, res, next) => {
  Product.find({ category: "Mobile Phone" })
    .select(
      "_id color name price ean category screenSize screenRes screenDetails weight build os chipset cpu gpu ram internalMemory mainCameraDetails mainCamera selfieCameraDetails selfieCamera stabilization gps bluetooth nfc wifi infrared usb seansors headphones battery charging wirelessCharging radio simSlot simSlotType ip dimension warranty productImage"
    )
    .exec()
    .then((phones) => {
      res.status(200).json(phones);
    })
    .catch((err) => {
      console.log(err), res.status(500).json({ error: err });
    });
});

router.post(
  "/mobilePhones/",
  upload.any("productImage", 10),
  (req, res, next) => {
    const mobilePhone = new Product({
      _id: new mongoose.Types.ObjectId(),
      color: req.body.color,
      name: req.body.name,
      price: req.body.price,
      ean: req.body.ean,
      category: req.body.category,
      screenSize: req.body.screenSize,
      screenRes: req.body.screenRes,
      screenDetails: req.body.screenDetails,
      weight: req.body.weight,
      build: req.body.build,
      os: req.body.os,
      chipset: req.body.chipset,
      cpu: req.body.cpu,
      gpu: req.body.gpu,
      ram: req.body.ram,
      internalMemory: req.body.internalMemory,
      mainCamera: req.body.mainCamera,
      mainCameraDetails: req.body.mainCameraDetails,
      stabilization: req.body.stabilization,
      selfieCamera: req.body.selfieCamera,
      selfieCameraDetails: req.body.selfieCameraDetails,
      seansors: req.body.seansors,
      bluetooth: req.body.bluetooth,
      gps: req.body.gps,
      wifi: req.body.wifi,
      usb: req.body.usb,
      nfc: req.body.nfc,
      radio: req.body.radio,
      headphones: req.body.headphones,
      infrared: req.body.infrared,
      wirelessCharging: req.body.wirelessCharging,
      charging: req.body.charging,
      battery: req.body.battery,
      simSlot: req.body.simSlot,
      simSlotType: req.body.simSlotType,
      ip: req.body.ip,
      dimension: req.body.dimension,
      warranty: req.body.warranty,
      // productImage: req.files.map((file) => file.path),
    });
    mobilePhone
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Created mobilePhone successfully!",
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
);

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
