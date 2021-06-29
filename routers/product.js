const express = require("express");
const router = express.Router();
const multer = require("multer");
let ProductsValidator = require("../middleware/products.validator");
const products = require("../models/product");
var _ = require("lodash");
var editHistory = {};
const excelToJson = require("convert-excel-to-json");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", (req, res, next) => {
  products
    .find()
    .then((prod) => {
      res.send(prod);
    })
    .catch((e) => console.log(e));
});

router.post("/checkforsample", (req, res, next) => {
  console.log('innnnnnnnnnnnn');
  products.updateOne({ _id: req.body._id }, { $set: { checked: req.body.checked } },{ upsert: true }, function (err, products) {
    res.json({
          success: true,
          message: `sample status changed successfully!`,
          data: products,
        });
  });
});

router.get("/samples", (req, res, next) => {
  products
    .find({
      checked:true
    })
    .then((response) => {
      let groupedSampleProducts = [];
      response.forEach((element) => {
        groupedSampleProducts.push({
          
          item: element.item,
          sku_Code: element.sku_Code,
          sku_Description: response
            .map((value) => {
              if (value.item == element.item) {
                return value.sku_Description;
              }
            })
            .filter((n) => n),
          size: response
            .map((value) => {
              if (value.item == element.item) {
                return value.size;
              }
            })
            .filter((n) => n)
        });
        console.log('from samples',groupedSampleProducts)
      });
      res.send({
        success: true,
        message: "Products list successfully fetched!",
        data: _.uniqBy(groupedSampleProducts, "item"),
      });
    });
});

router.post(
  "/upload",
  checkInput,
  upload.single("xlsxfile"),
  async (req, res, next) => {
    const excelData = await excelToJson({
      sourceFile: "uploads/" + req.file.filename,
    });
    // res.send(excelData);
    let counter = 1;
    let lastRecord = await products.findOne({}).sort({ sNo: -1 });
    if (lastRecord) {
      counter = lastRecord.sNo + 1;
    }
    let finalData = Object.values(excelData)[0]
      .slice(1)
      .map(function (item, index) {
        console.log("==== ", Object.values(item)[3], Object.values(item)[8]);
        let newRecord = {
          sNo: counter + index,
          item: Object.values(item)[1],
          size: Object.values(item)[2],
          sku_Code: Object.values(item)[3],
          sku_Description: Object.values(item)[4],
          std_Pkg: Object.values(item)[5],
          covers: Object.values(item)[6],
          pcs: Object.values(item)[7],
          price: parseFloat(Object.values(item)[8]).toFixed(2),
          productType: req.query.productType,
          productCategory: req.query.productCategory
        };
        if (
          req.query.dealerdiscount == undefined ||
          req.query.dealerdiscount == "" ||
          req.query.dealerdiscount == null
        ) {
        } else {
          newRecord["dealDiscount"] = req.query.dealerdiscount;
        }
        if (
          req.query.distributordiscount == undefined ||
          req.query.distributordiscount == "" ||
          req.query.distributordiscount == null
        ) {
        } else {
          newRecord["disDiscount"] = req.query.distributordiscount;
        }
        return newRecord;
      });
    let newData = [];
    finalData.forEach((element) => {
      let newProduct = {
        updateOne: {
          filter: { sku_Code: element.sku_Code },
          update: { $set: element },
          upsert: true,
        },
      };
      newData.push(newProduct);
    });
    // Insert records to the database
    products
      .bulkWrite(newData)
      .then((result) => {
        res.json({
          success: true,
          message: `${req.file.originalname} uploaded successfully!`,
          data: result,
        });
      })
      .catch((error) => res.json({ success: false, message: error.message }));
  }
);

function checkInput(req, res, next) {
  // Strict Validation for file Type and Category
  if (
    "productType" in req.query === true &&
    "productCategory" in req.query === true
  ) {
    if (req.query.productType != "") {
      let productTypes = [
        "CPVC",
        "UPVC",
        "SWR",
        "AGRI",
        "COLUMN",
        "CASING",
        "UGD",
      ];
      let productCategories = ["Pipes", "Fittings", "Solvents", "Combo"];
      if (productTypes.includes(req.query.productType) === false) {
        res.json({
          success: false,
          message: `Invalid productType sent`,
        });
      } else if (
        productCategories.includes(req.query.productCategory) === false
      ) {
        res.json({
          success: false,
          message: `Invalid productCategory sent`,
        });
      }
      next();
    }
  } else {
    res.json({
      success: false,
      message: `productType and productCategory required to upload the Excel Data`,
    });
  }
}

router.post(
  "/saveProduct",
  upload.single("productImage"),
  async (req, res, next) => {
    var data = req.body;
    let counter = 1;
    let lastRecord = await products.findOne({}).sort({ sNo: -1 });
    if (lastRecord) {
      counter = lastRecord.sNo + 1;
    }
    var prod = new products({
      category: data.category,
      // prod_Id: prodId,
      prod_Type: data.prod_Type,
      item: data.item,
      size: data.size,
      sku_Code: data.sku_Code,
      sku_Description: data.sku_Description,
      std_Pkg: data.std_Pkg,
      covers: data.covers,
      pcs: data.pcs,
      price: data.price,
      dealDiscount: data.dealDiscount,
      disDiscount: data.disDiscount,
      sNo: counter,
      productImage: req.file ? req.file.path : null,
    });
    prod
      .save()
      .then((prod) => {
        res.send(prod);
      })
      .catch((e) => {
        console.log(e);
      });
  }
);

// Save combo products
router.post("/combo", async (req, res, next) => {
  let newProducts = [];
  let counter = 1;
  let lastRecord = await products.findOne({}).sort({ sNo: -1 });
  if (lastRecord) {
    counter = lastRecord.sNo + 1;
  }
  await req.body.combos.forEach(async (element) => {
    newProducts.push({
      item: req.body.item,
      sku_Code: req.body.sku_Code,
      sku_Description: element.sku_Description,
      size: element.size,
      std_Pkg: element.std_Pkg,
      covers: element.covers,
      pcs: element.pcs,
      price: req.body.price,
      productType: req.body.productType,
      productCategory: req.body.productCategory,
      dealDiscount: req.body.dealDiscount || "",
      disDiscount: req.body.disDiscount || "",
    });
  });
  newProducts.forEach((element, index) => {
    Object.assign(element, { sNo: counter + index });
  });
  products.insertMany(newProducts).then((response) =>
    res.send({
      success: true,
      message: "Combo products data uploaded successfully",
      data: response,
    })
  );
});

// GET Combo products
router.get("/combo", async (req, res, next) => {
  products
    .find({
      productType: req.query.productType,
      productCategory: req.query.productCategory,
    })
    .then((response) => {
      let groupedComboProducts = [];
      response.forEach((element) => {
        groupedComboProducts.push({
          sNo: response
            .map((value) => {
              if (value.item == element.item) {
                return value.sNo;
              }
            })
            .filter((n) => n),
          item: element.item,
          sku_Code: element.sku_Code,
          sku_Description: response
            .map((value) => {
              if (value.item == element.item) {
                return value.sku_Description;
              }
            })
            .filter((n) => n),
          price: element.price,
          size: response
            .map((value) => {
              if (value.item == element.item) {
                return value.size;
              }
            })
            .filter((n) => n),
          std_Pkg: response
            .map((value) => {
              if (value.item == element.item) {
                return value.std_Pkg;
              }
            })
            .filter((n) => n),
          covers: response
            .map((value) => {
              if (value.item == element.item) {
                return value.covers;
              }
            })
            .filter((n) => n),
          pcs: response
            .map((value) => {
              if (value.item == element.item) {
                return value.pcs;
              }
            })
            .filter((n) => n),
          dealDiscount: element.dealDiscount,
          disDiscount: element.disDiscount,
        });
      });
      res.send({
        success: true,
        message: "Products list successfully fetched!",
        data: _.uniqBy(groupedComboProducts, "item"),
      });
    });
});

// Update combo products
router.put("/combo", async (req, res, next) => {
  let newProducts = [];
  await req.body.combos.forEach(async (element) => {
    newProducts.push({
      updateOne: {
        filter: { sku_Code: req.body.sku_Code, sNo: element.sNo },
        update: {
          item: req.body.item,
          sku_Code: req.body.sku_Code,
          sku_Description: element.sku_Description || "",
          size: element.size,
          std_Pkg: element.std_Pkg,
          covers: element.covers,
          pcs: element.pcs,
          price: req.body.price,
          productType: req.body.productType,
          productCategory: req.body.productCategory,
          dealDiscount: req.body.dealDiscount || "",
          disDiscount: req.body.disDiscount || "",
        },
        upsert: true,
      },
    });
  });

  products.bulkWrite(newProducts).then((response) =>
    res.send({
      success: true,
      message: "Combo products data updated successfully",
      data: response,
    })
  );
});

// Save  Sample products
router.post("/sample", async (req, res, next) => {
  let newProducts = [];
  let counter = 1;
  let lastRecord = await products.findOne({}).sort({ sNo: -1 });
  if (lastRecord) {
    counter = lastRecord.sNo + 1;
  }
  await req.body.samples.forEach(async (element) => {
    newProducts.push({
      item: req.body.item,
      sku_Description: element.sku_Description,
      size: element.size,
      pcs: element.pcs,
      productType: req.body.productType,
      productCategory: req.body.productCategory,
    });
  });
  newProducts.forEach((element, index) => {
    Object.assign(element, { sNo: counter + index });
  });
  products.insertMany(newProducts).then((response) =>
    res.send({
      success: true,
      message: "sample products data created successfully",
      data: response,
    })
  );
});

router.get("/productList/:id", (req, res, next) => {
  products
    .find({ sNo: req.params.id })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/editProduct", (req, res, next) => {
  var data = req.body;
  products
    .findOne({ sNo: data.sNo })
    .then((prod) => {
      editHistory = {
        sNo: prod.sNo,
        price: prod.price,
        dealDiscount: prod.dealDiscount,
        disDiscount: prod.disDiscount,
        updated: new Date(),
      };
      prod.editHistory.push(editHistory);
      data.editHistory = prod.editHistory;
      editHistory = {};
      products
        .update({ sNo: data.sNo }, { $set: data }, { new: true })
        .then((prod) => {
          res.send(prod);
        })
        .catch((e) => {
          res.send(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.post("/uploadImage", upload.single("productImage"), (req, res) => {
  var data = req.body;
  products
    .findOne({ sNo: data.sNo })
    .then((prod) => {})
    .catch((e) => {
      console.log(e);
    });
  data.productImage = req.file.path;
  console.log("upload", req.file);
  products
    .update({ sNo: data.Sno }, { $set: data }, { new: true })
    .then((prod) => {
      res.send(prod);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.get("/items", async (req, res) => {
  let distinctItemNames = await products.distinct("item");
  if (distinctItemNames) {
    res.json({ success: true, data: distinctItemNames });
  } else {
    res.json({ success: false, message: "No items found! :(" });
  }
});

router.post("/images", upload.single("productImage"), async (req, res) => {
  products
    .updateMany(
      { item: req.body.itemName },
      { $set: { imgPath: req.file.path } },
      { multi: true }
    )
    .then((response) => {
      res.json({ success: true, message: "Image uploaded successfully" });
    })
    .catch((error) => res.json({ success: false, message: error.message }));
});

router.post(
  "/list",
  ProductsValidator.getProductsListValidation,
  async (req, res, next) => {
    let query = {};
    if (
      "productType" in req.body === true &&
      req.body.productType != null &&
      req.body.productType != ""
    ) {
      query["productType"] = req.body.productType;
    }
    if (
      "productCategory" in req.body === true &&
      req.body.productType != null &&
      req.body.productType != ""
    ) {
      query["productCategory"] = req.body.productCategory;
    }
    // execute query with page and limit values
    let response = await products.find(query);

    // get total documents in the Posts collection
    const count = await products.countDocuments(query);
    if (response.length > 0) {
      let productListByGroup = _.groupBy(response, function (product) {
        return product.item;
      });
      res.send({
        success: true,
        message: "Products list successfully fetched",
        data: {
          productsList: response,
          totalRecords: count,
          // totalPages: Math.ceil(count / parseInt(req.query.limit)),
          // currentPage: parseInt(req.query.page)
        },
      });
    } else {
      res.json({
        success: true,
        message: "No products found",
        data: response,
      });
    }
  }
);

router.post(
  "/updatepercentage",
  ProductsValidator.updateProductDiscountVaiation,
  async (req, res, next) => {
    let query = {
      productType: req.body.productType,
      productCategory: req.body.productCategory,
    };
    let updateObj = {};
    if ("dealDiscount" in req.body) {
      updateObj["dealDiscount"] = req.body.dealDiscount;
    }
    if ("disDiscount" in req.body) {
      updateObj["disDiscount"] = req.body.disDiscount;
    }
    products
      .update(query, updateObj, { multi: true })
      .then((response) => {
        res.send({
          success: true,
          message: "New discounts updated",
        });
      })
      .catch((error) => {
        res.send({
          success: false,
          message: "Error while updating discounts",
          data: error,
        });
      });
  }
);

module.exports = router;
