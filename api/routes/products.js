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

//Older version

// router.get("/", (req, res, next) => {
//   Product.find({})
//     .exec()
//     .then((docs) => {
//       const response = {
//         count: docs.length,
//         products: docs,
//       };
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });

//New version

router.get("/", (req, res, next) => {
  let obj = {};
  if (req.query.filter === undefined) {
    obj = {};
  } else {
    obj = req.query.filter = JSON.parse(req.query.filter);
  }

  let filteredObj = {};

  for (let key in obj) {
    if (obj[key] !== "") {
      filteredObj[key] = obj[key];
    }
  }

  Product.find(filteredObj)
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
  let obj = { category: "Mobile" };

  if (req.query.filter === undefined) {
    obj = { category: "Mobile" };
  } else {
    obj = {
      ...(req.query.filter = JSON.parse(req.query.filter)),
      category: "Mobile",
    };
  }
  for (let i in obj) {
    if (obj[i].length === 0) {
      obj[i] = "";
    }
  }

  let filteredObj = {};
  let withOr = [];
  let withoutOr = [];

  for (let key in obj) {
    if (obj[key] !== "") {
      let arr = [];

      if (key === "internalMemory") {
        obj[key].map((elem) => {
          let m = { internalMemory: elem };
          arr.push(m);
        });
      } else if (key === "screenRes") {
        obj[key].map((elem) => {
          let m = { screenRes: elem };
          arr.push(m);
        });
      } else {
        filteredObj[key] = obj[key];
      }

      withOr = arr;
    }
  }

  let query = {};

  let objOr = {
    $or: [...withOr],
    category: "Mobile",
    ...filteredObj,
  };

  let objWOr = {
    category: "Mobile",
    ...filteredObj,
  };

  if (objOr.$or.length === 0) {
    query = objWOr;
  } else {
    query = objOr;
  }

  console.log(query);

  Product.find(query)
    .exec()
    .then((phones) => {
      const response = {
        count: phones.length,
        products: phones,
      };
      res.status(200).json(response);
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

router.get("/laptop/", (req, res, next) => {
  let obj = { category: "Laptop" };

  if (req.query.filter === undefined) {
    obj = { category: "Laptop" };
  } else {
    obj = {
      ...(req.query.filter = JSON.parse(req.query.filter)),
      category: "Laptop",
    };
  }
  for (let i in obj) {
    if (obj[i].length === 0) {
      obj[i] = "";
    }
  }
  let filteredObj = {};

  for (let key in obj) {
    if (obj[key] !== "") {
      filteredObj[key] = obj[key];
    }
  }

  Product.find(filteredObj)
    .exec()
    .then((laptops) => {
      const response = {
        count: laptops.length,
        products: laptops,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err), res.status(500).json({ error: err });
    });
});

router.post("/laptop/", upload.any("productImage", 10), (req, res, next) => {
  const laptop = new Product({
    _id: new mongoose.Types.ObjectId(),
    color: req.body.color,
    name: req.body.name,
    price: req.body.price,
    ean: req.body.ean,
    brand: req.body.brand,
    model: req.body.model,
    category: req.body.category,
    cpu: req.body.cpu,
    cpuDetails: req.body.cpuDetails,
    gpu: req.body.gpu,
    gpuDetails: req.body.gpuDetails,
    ram: req.body.ram,
    ramDetails: req.body.ramDetails,
    ssd: req.body.ssd,
    ssdDetails: req.body.ssdDetails,
    screenSize: req.body.screenSize,
    screenDetails: req.body.screenDetails,
    connection: req.body.connection,
    weight: req.body.weight,
    os: req.body.os,
    finger: req.body.finger,
    bluetooth: req.body.bluetooth,
    wifi: req.body.wifi,
    usb: req.body.usb,
    sound: req.body.sound,
    webCam: req.body.webCam,
    fastCharge: req.body.fastCharge,
    battery: req.body.battery,
    dimensions: req.body.dimensions,
    backlit: req.body.backlit,
    warranty: req.body.warranty,
    cashDiscount: req.body.cashDiscount,
    lockedPrice: req.body.lockedPrice,
    productNumber: req.body.productNumber,
    // productImage: req.files.map((file) => file.path),
  });
  laptop
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created laptop successfully!",
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

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

router.patch(
  "/:productId",
  upload.any("productImage", 10),
  (req, res, next) => {
    const id = req.params.productId;
    Product.findOneAndUpdate(
      { _id: id },
      { productImage: req.files.map((file) => file.path) }
    )
      .exec()
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

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
