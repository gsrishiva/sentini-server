const Validator = require("../utilities/validator");
let CommonService = require("../utilities/common");

let productsValidationRule = {
  productType: "string|in:CPVC,UPVC,SWR,AGRI,COLUMN,CASING,UGD",
  productCategory:
    "string|in:Pipes,Fittings,Solvents,Lubricants, Pipes-Combo, Fittings-Combo, Solvents-Combo, Lubricants-Combo",
};

let productsDiscountValidationRule = {
  productType: "required|string|in:CPVC,UPVC,SWR,AGRI,COLUMN,CASING,UGD",
  productCategory:
    "required|string|in:Pipes,Fittings,Solvents,Lubricants,Pipes-Combo, Fittings-Combo, Solvents-Combo, Lubricants-Combo",
  dealDiscount: "numeric",
  disDiscount: "numeric",
};

class ProductsValidator {
  constructor() {}
  async getProductsListValidation(req, res, next) {
    try {
      Validator(
        {
          productType: req.body.productType,
          productCategory: req.body.productCategory,
        },
        productsValidationRule,
        {},
        (err, status) => {
          CommonService.validationResponse(res, err, status, next);
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProductDiscountVaiation(req, res, next) {
    try {
      Validator(req.body, productsDiscountValidationRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ProductsValidator();
