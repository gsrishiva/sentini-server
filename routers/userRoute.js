const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
let UserValidator = require("../middleware/user.validator");
let { ApplicationError } = require("../utilities/error");
const multer = require("multer");
const multerConfig = require("../config/multer");
const uploadMiddleware = multer(multerConfig);
let UserController = require("../controllers/user.controller");
let CommonService = require("../utilities/common");

router.post("/register", UserValidator.signupValidation, async function (
  req,
  res,
  next
) {
  let checkUser = await User.findOne({
    email: req.body.email,
    mobileNo: req.body.mobileNo,
  }).exec();
  if (checkUser) {
    res.status(412).json({
      success: false,
      message: `Email or MobileNo already registered`,
    });
  } else {
    req.body.password = CommonService.createPasswordHash(req.body.password);
    User.create(req.body)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "User registered successfully",
          data: result,
        });
      })
      .catch((error) => {
        res.status(412).json({
          success: false,
          message: error.message,
        });
      });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let response = await User.findOne({ email: req.body.email });
    if (response) {
      if (response.status == false) {
        res.status(400).json({
          success: false,
          message: "User suspended. Contact sales department for support",
        });
      }
      // check for password
      if (CommonService.comparePassword(req.body.password, response.password)) {
        delete response.password;
        res.json({
          success: true,
          message: "User logged in succesfully",
          data: response,
          token: CommonService.createToken(
            {
              _id: response._id,
              email: response.email,
              userType: response.userType,
            },
            "24h" // Expires in 3 Minutes
          ),
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid logins",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid logins",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid logins",
    });
  }
});

router.get("/getUser/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.get("/getAllusers", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  // execute query with page and limit values
  let response = await User.find({})
    .where("userType")
    .ne("Admin")
    .skip((page - 1) * limit)
    .limit()
    .exec();
  // get total documents in the Posts collection
  const count = await User.countDocuments({}).where("userType").ne("Admin");
  if (response.length > 0) {
    res.json({
      success: true,
      message: "Users list successfully fetched",
      data: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        usersList: response,
      },
    });
  }
});

router.post("/editUser", (req, res) => {
  var data = req.body;
  User.find({ _id: data._id }).then((user) => {
    User.update({ _id: data._id }, { $set: data }, { new: true })
      .then((user) => {
        res.send(user);
      })
      .catch((e) => {
        res.send(e);
      })
      .catch((e) => {});
  });
});

router.put("/changePassword", (req, res) => {
  console.log('from chng pwd')
  var email = req.body.email;
  var password = CommonService.createPasswordHash(req.body.password);
  User.findOneAndUpdate({ email: email }, { password: password }, { new: true })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "password changed successfully",
      });
    })
    .catch((e) => {
      res.send(e);
    });
});
// Document Upload Routes
router.post(
  "/upload/documents",
  CommonService.authenticateUser,
  uploadMiddleware.any(),
  UserController.uploadDocuments
);

router.get("/upload/documents/:userId", UserController.getDocuments);

module.exports = router;
