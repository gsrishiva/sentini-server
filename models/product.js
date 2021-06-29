const mongoose = require("mongoose");
let CONFIG = require("../config/config");
const ProductSchema = mongoose.Schema(
  {
    prod_Id: {
      type: String,
      // unique: true
    },
    prod_Type: {
      type: String,
      // required: true
    },
    item: {
      type: String,
      index: true,
      // required: true
    },
    size: {
      type: String,
      // required: true
    },
    sku_Code: {
      type: String,
      // required: true
    },
    sku_Description: {
      type: String,
      // required: true
    },
    std_Pkg: {
      type: String,
      // required: true
    },
    covers: {
      type: String,
    },
    pcs: {
      type: String,
    },
    price: {
      type: String,
      // required: true
    },
    retailPrice: {
      type:String,
    },
    dealDiscount: {
      type: Number,
      // required:true
    },
    disDiscount: {
      type: Number,
      // required:true
    },
    sNo: {
      type: Number,
      unique: true,
    },
    productType: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false
    },
    editHistory: [],
    productImage: { data: Buffer, contentType: String },
    imgPath: { type: String },
  },
  {
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
  }
);

ProductSchema.virtual("imgUrl").get(function () {
  if (this.imgPath) {
    return CONFIG.APP_URL + this.imgPath;
  } else {
    return null;
  }
});

module.exports = mongoose.model("Product", ProductSchema);
