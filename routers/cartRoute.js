const express = require("express");
var nodemailer = require("nodemailer");
const ejs = require("ejs");
//var smtpTransport = require("nodemailer-smtp-transport");
var Orders = require("../models/orders");
let User = require("../models/userModel");
let ProductsService = require("../services/products.service");

const router = express.Router();
var _ = require("lodash");
const fs = require("fs");
var pdf = require("html-pdf");
var tableToCsv = require("node-table-to-csv");
const Cart = require("../models/cartModel");
let CONFIG = require("../config/config");

router.get("/getCart/:userId", async (req, res, next) => {
  Cart.find({ user_Id: req.params.userId })
    .then(async (cart) => {
      if (cart.length > 0) {
        // Fetch User Information
        let userInfo = await User.findById(req.params.userId);
        console.log('=== userinfo , ', userInfo )
        let productsData = [];
        let priceSummary = {};
        if (userInfo.userType == "Dealer") {
          console.log('----- ENTERED ---  Dealer ',userInfo.userType )
          // Loop through products
          for (let product of cart[0].products) {
            let updatedProduct = {};
            // Apply Dealer Percentage
            let totalProductsActualPrice = parseFloat(product.price);
            let retailPrice = parseFloat(product.retailPrice);
            let discountForTotalPrice =
              (parseFloat(totalProductsActualPrice) *
                parseFloat(product.dealDiscount)) /
              100;
            let discountedPrice =
              parseFloat(totalProductsActualPrice) -
              parseFloat(discountForTotalPrice);
            updatedProduct["sNo"] = product.sNo;
            updatedProduct["basePrice"] = product.basePrice;
            //updatedProduct["retailPrice"] = parseFloat(product.retailPrice);
            updatedProduct["actualPrice"] = parseFloat(product.price);
            updatedProduct["dealDiscount"] = parseFloat(product.dealDiscount);
            updatedProduct["discountedPrice"] = parseFloat(
              discountedPrice
            ).toFixed(2);
            updatedProduct["productTax"] = parseFloat(
              (discountedPrice * 18) / 100
            ).toFixed(2);
            updatedProduct["productType"] = product.productType;
            updatedProduct["productCategory"] = product.productCategory;
            updatedProduct["quantity"] = product.quantity;
            updatedProduct["size"] = product.size;
            updatedProduct["sku_Code"] = product.sku_Code;
            updatedProduct["sku_Description"] = product.sku_Description;
            updatedProduct["item"] = product.item;
            updatedProduct["std_Pkg"] = product.std_Pkg;
            productsData.push(updatedProduct);
          }
        } else if (userInfo.userType == "Distributor") {
          console.log('----- ENTERED ---  Distributor ',userInfo.userType )
          // Loop through products
          for (let product of cart[0].products) {
            let updatedProduct = {};
            // Apply Dealer Percentage
            let totalProductsActualPrice = parseFloat(product.price);
            //let retailPrice = parseFloat(product.retailPrice);
            let discountForTotalPrice =
              (parseFloat(totalProductsActualPrice) *
                parseFloat(product.disDiscount)) /
              100;
            let discountedPrice =
              parseFloat(totalProductsActualPrice) -
              parseFloat(discountForTotalPrice);
            updatedProduct["sNo"] = product.sNo;
            updatedProduct["basePrice"] = product.basePrice;
            //updatedProduct["retailPrice"] = parseFloat(product.retailPrice);
            updatedProduct["actualPrice"] = parseFloat(product.price);
            updatedProduct["disDiscount"] = parseFloat(product.disDiscount);
            updatedProduct["discountedPrice"] = parseFloat(
              discountedPrice
            ).toFixed(2);
            updatedProduct["productTax"] = parseFloat(
              (discountedPrice * 18) / 100
            ).toFixed(2);
            updatedProduct["productType"] = product.productType;
            updatedProduct["productCategory"] = product.productCategory;
            updatedProduct["quantity"] = product.quantity;
            updatedProduct["size"] = product.size;
            updatedProduct["sku_Code"] = product.sku_Code;
            updatedProduct["sku_Description"] = product.sku_Description;
            updatedProduct["item"] = product.item;
            updatedProduct["std_Pkg"] = product.std_Pkg;
            productsData.push(updatedProduct);
          }
        } else if (userInfo.userType == "Statehead") {
          for (let product of cart[0].products) {
            let updatedProduct = {};
            updatedProduct["sNo"] = product.sNo;
            updatedProduct["basePrice"] = 0;
            updatedProduct["quantity"] = product.quantity;
            updatedProduct["size"] = product.size;
            updatedProduct["sku_Code"] = product.sku_Code;
            updatedProduct["sku_Description"] = product.sku_Description;
            updatedProduct["item"] = product.item;
            updatedProduct["std_Pkg"] = 0;
            productsData.push(updatedProduct);
          }
        } else {
        }

        const finalPrice = productsData.reduce(
          (a, { discountedPrice }) => a + parseFloat(discountedPrice),
          0
        );
        const finalTax = productsData.reduce(
          (a, { productTax }) => a + parseFloat(productTax),
          0
        );
        res.json({
          success: true,
          message: "Cart data successfully fetched",
          data: {
            _id: cart[0]._id,
            productsData: productsData,
            summary: {
              finalPriceWithoutTax: finalPrice.toFixed(2),
              totalTax: finalTax.toFixed(2),
              finalPriceAfterTax: (
                parseFloat(finalPrice) + parseFloat(finalTax)
              ).toFixed(2),
            },
          },
        });
      } else {
        res.json({
          success: true,
          message: "Cart data successfully fetched",
          data: [],
        });
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/addToCart", (req, res, next) => {
  let userid = req.body.user_Id;
  Cart.find({ user_Id: userid }).then((carts) => {
    if (carts.length) {
      var exist = carts[0].products.find(
        (item) => item.sNo == req.body.item.sNo
      );
      if (exist) {
        (exist.quantity += req.body.item.quantity),
          (exist.price += req.body.item.price);
      } else {
        carts[0].products.push(req.body.item);
      }
      Cart.findOneAndUpdate(
        { user_Id: req.body.user_Id },
        { $set: carts[0] },
        { new: true }
      )
        .then((response) => {
          if (response) {
            res.send({
              success: true,
              message: "Added to Cart Successfully",
              data: response,
            });
          }
        })
        .catch((e) => {
          res.send(e);
        });
    } else {
      var cart = new Cart({
        user_Id: userid,
      });
      cart.products.push(req.body.item);
      cart
        .save()
        .then((response) => {
          if (response) {
            res.send({
              success: true,
              message: "Added to Cart Successfully",
              data: response,
            });
          }
        })
        .catch((e) => {
          res.send(e);
        });
    }
  });
});

router.post("/placeOrder", async (req, res) => {
  let customerDetails = await User.findById(req.body.userId);
  if (customerDetails.isDocumentsApproved === true) {
    let transporter = nodemailer.createTransport({
      host: CONFIG.mail.config.smtpHost, //host of mail service provider
      port: CONFIG.mail.config.smtpPort,
      secure: CONFIG.mail.config.smtpSecurity,
      auth: {
        user: CONFIG.mail.config.smtpUser,
        pass: CONFIG.mail.config.smtpPassword,
      },
    });
    let OrderObj = new Orders({
      products: req.body.products,
      orderValue: req.body.total,
      orderDate: new Date(),
      updatedDate: new Date(),
      status: "Ordered",
      email: req.body.email,
      userId: req.body.userId,
    });
    // Place Order
    let OrderResponse = await OrderObj.save();
    if (OrderResponse) {
      // clear the CART after successful order
      await Cart.remove({ user_Id: req.body.userId });
      res.json({
        success: true,
        message: "Order placed successfully",
        data: OrderResponse,
      });
      // Get ProductsSummary
      let productSummary = await ProductsService.calculateProductsSummary(
        req.body.products
      );
      //if (customerDetails.userType !== 'Statehead') {
          // Send Email
      ejs.renderFile(
        "./views/products.ejs",
        {
          items: req.body.products,
          Date: {
            invoiceDate: OrderResponse.orderDate,
          },
          summary: {
            finalPriceWithoutTax: req.body.beforePrice,
            finalPriceAfterTax: req.body.total,
            totalTax: req.body.totalTax,
          },
          productSummary: productSummary,
          customerData: {
            firmName: customerDetails.firmName || "",
            address: customerDetails.address || "",
            city: customerDetails.city || "",
            state: customerDetails.state || "",
            pinCode: customerDetails.pinCode || "",
            gstNo: customerDetails.gstNo || "",
          },
        },
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            //Generate PDF
            var html = data;
            var options = { format: "Letter" };
            pdf
              .create(html, options)
              .toFile(`./uploads/invoices/Invoice-${Date.now()}.pdf`, function (
                err,
                result
              ) {
                if (err) return console.log(err);
                // Send Mail to customer
                let maillist = CONFIG.mail.orderEmail.pdfFormat;
                maillist.push(customerDetails.email);
                var mainOptions = {
                  from: CONFIG.mail.orderEmail.fromEmail,
                  to: maillist,
                  subject: CONFIG.mail.orderEmail.subject,
                  html: `<b>
Dear Channel partner,</b>
                                </br>
                                <p>We thank you for placing your order with us,  We have forwarded your order to our dispatch department who will verify with the accounts department and arrange to dispatch the same as per our financial policy.</p>
                                </br>
                                <p>Your order copy is attached herewith.</p>
                                </br>
                                <b>Thanks & Regards,</b>
                                <h2>-- Team SentiniFlopipes India. Pvt. Ltd.--</h2>`,
                  attachments: [
                    {
                      // utf-8 string as an attachment
                      filename: "Sales Order-Sentini.pdf",
                      content: fs.createReadStream(result.filename),
                    },
                  ],
                };
                transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                    console.log(
                      "=== ERROR WHILE SENDING MAIL FOR ORDER === ",
                      OrderResponse._id
                    );
                    console.log(err);
                  } else {
                    console.log(
                      "=== PDF MAIL SUCCESSFULLY SENT FOR ORDER === ",
                      OrderResponse._id
                    );
                  }
                });
              });

            if (CONFIG.mail.orderEmail.excelFormat.length > 0) {
              // Generate Excel
              csv = tableToCsv(data);
              // writeFile function with filename, content and callback function
              let filePath = `./uploads/invoices/Invoice-${Date.now()}.xlsx`;
              fs.writeFile(filePath, csv, function (err) {
                if (err) throw err;
                console.log("Excel file created successfully.");
              });
              let excelMailList = CONFIG.mail.orderEmail.excelFormat;
              // Send Mail to Accounts Department
              var mainOptions = {
                from: CONFIG.mail.orderEmail.fromEmail,
                to: excelMailList,
                subject: CONFIG.mail.orderEmail.subject,
                html: `<b>Oder place succesfully</b>
                            </br>
                            -
                            </br>
                            <h2>-- Sentini FloPipes</h2>`,
                attachments: [
                  {
                    // utf-8 string as an attachment
                    filename: "Sales Order-Sentini.xlsx",
                    content: fs.createReadStream(filePath),
                  },
                ],
              };
              transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                  console.log(
                    "=== ERROR WHILE SENDING MAIL FOR ORDER === ",
                    OrderResponse._id
                  );
                  console.log(err);
                } else {
                  console.log(
                    "=== EXCEL MAIL SUCCESSFULLY SENT FOR ORDER === ",
                    OrderResponse._id
                  );
                }
              });
            }
          }
        }
      );
      //}
      
    } else {
      res.send({
        success: false,
        message: "Error while placing the order",
      });
    }
  } else {
    res.send({
      success: false,
      message:
        "Your documents are under review. Please contact support team :)",
    });
  }
});

router.post("/updatecart", (req, res, next) => {
  console.log(req.body);
  // if quantity is ZERO
  if (req.body.item.quantity == 0) {
    console.log("=== UPDATE CALLED  == ", req.body.item.sku_Code);
    // pull the cart item from Products list
    Cart.updateOne(
      { _id: req.body._id },
      { $pull: { products: { sku_Code: req.body.item.sku_Code } } }
    ).then((response) => {
      res.send({
        success: true,
        message: "updated product details",
      });
    });
  } else {
    console.log("=== FASAK", req.body._id);
    Cart.updateOne(
      { _id: req.body._id, "products.sku_Code": req.body.item.sku_Code },
      {
        $set: {
          "products.$.quantity": req.body.item.quantity,
          "products.$.price": req.body.item.price,
        },
      }
    ).then((response) => {
      console.log(response);
      res.send({
        success: true,
        message: "updated product details",
      });
    });
  }
});

router.post("/deleteCart", (req, res, next) => {
  Cart.find({ _id: req.body._id }).then((carts) => {
    var index = carts[0].products.findIndex(
      (item) => item.sku_Code == req.body.item.sku_Code
    );
    carts[0].products.splice(index, 1);
    Cart.update({ _id: req.body._id }, { $set: carts[0] }, { new: true })
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        res.send(error);
      });
  });
});

router.get("/allOrders", (req, res) => {
  Orders.find()
    .then((orders) => {
      res.send(orders);
    })
    .catch((error) => {
      res.send(e);
    });
});

router.get("/myOrders/:userId", (req, res) => {
  Orders.find({ userId: req.params.userId })
    .then((orders) => {
      res.send(orders);
    })
    .catch((e) => {
      console.log("errror while fetching order ", e);
      res.send(e);
    });
});

module.exports = router;
