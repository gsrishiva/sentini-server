const Validator = require("../utilities/validator");
let CommonService = require("../utilities/common");

let userSignUpRule = {
  firstName: "required|string",
  lastName: "required|string",
  email: "required|string|email",
  password: "required|string|min:6|confirmed|strict",
  firmName: "required|string",
  constitution: "required|in:Proprietary Concern,Firm,Company,LLP",
  regNo: "required|string",
  estDate: "required|string",
  gstNo: "required|string",
  panNo: "required|string",
  userType: "required|in:Dealer,Distributor,Admin,Statehead,Techcoordinator",
  mobileNo: "required|digits:10",
  state: "string|min:3|max:30",
  city: "string|min:3|max:33",
  pinCode: "required|digits:6",
  address: "string",
  authPersonName: "required|string",
  authPersonMobileNo: "required|digits:10",
  godownLocation: "string",
  godownArea: "string",
  totalStaff: "numeric",
  noOfSalesStaff: "numeric",
  finWorkingCapital: "numeric",
  finOwnCap: "numeric",
  finBorrowCap: "numeric",
  finTotalCap: "numeric",
  bankName: "required|string",
  bankBranch: "required|string",
  bankAccountNo: "required|numeric",
  existingBusinessYear: "numeric",
  existingProduct: "string",
  existingLastYearTurnOver: "numeric",
  existingNoOfDealers: "numeric",
  supplyMaterial: "boolean",
};

let userLoginRule = {
  email: "required|string|email",
  password: "required|string",
};

class UserValidator {
  constructor() {}
  async signupValidation(req, res, next) {
    try {
      await Validator(req.body, userSignUpRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }
  async LoginValidation(req, res, next) {
    try {
      await Validator(req.body, userLoginRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserValidator();
