const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    firmName: {
      type: String,
    },
    constitution: {
      type: String,
    },
    regNo: {
      type: String,
    },
    estDate: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    panNo: {
      type: String,
    },
    userType: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    resetLink: {
      data: String,
      default: "",
    },
    mobileNo: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    address: {
      type: String,
    },
    authPersonName: {
      type: String,
    },
    authPersonMobileNo: {
      type: String,
    },
    godownLocation: {
      type: String,
    },
    godownArea: {
      type: String,
    },
    totalStaff: {
      type: Number,
    },
    noOfSalesStaff: {
      type: Number,
    },
    finWorkingCapital: {
      type: mongoose.Decimal128,
      set: (value) =>
        mongoose.Types.Decimal128.fromString(parseFloat(value).toFixed(2)),
      get: (value) => {
        if (value) {
          return value.toString();
        } else {
          return null;
        }
      },
    },
    finOwnCap: {
      type: mongoose.Decimal128,
      set: (value) =>
        mongoose.Types.Decimal128.fromString(parseFloat(value).toFixed(2)),
      get: (value) => {
        if (value) {
          return value.toString();
        } else {
          return null;
        }
      },
    },
    finBorrowCap: {
      type: mongoose.Decimal128,
      set: (value) =>
        mongoose.Types.Decimal128.fromString(parseFloat(value).toFixed(2)),
      get: (value) => {
        if (value) {
          return value.toString();
        } else {
          return null;
        }
      },
    },
    finTotalCap: {
      type: mongoose.Decimal128,
      set: (value) =>
        mongoose.Types.Decimal128.fromString(parseFloat(value).toFixed(2)),
      get: (value) => {
        if (value) {
          return value.toString();
        } else {
          return null;
        }
      },
    },
    bankName: {
      type: String,
    },
    bankBranch: {
      type: String,
    },
    bankAccountNo: {
      type: String,
    },
    existingBusinessYear: {
      type: Number,
    },
    existingProduct: {
      type: String,
    },
    existingLastYearTurnOver: {
      type: mongoose.Decimal128,
      set: (value) =>
        mongoose.Types.Decimal128.fromString(parseFloat(value).toFixed(2)),
      get: (value) => {
        if (value) {
          return value.toString();
        } else {
          return null;
        }
      },
    },
    existingNoOfDealers: {
      type: Number,
    },
    supplyMaterial: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
    isDocumentsApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
