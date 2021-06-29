const Validator = require('../utilities/validator');
let CommonService = require('../utilities/common');
const { verifyOTP } = require('../services/sms.service');

let sendOTPRule = {
    mobileNo: 'required|digits:10',
    resend: 'boolean'
};

let verifyOTPRule = {
    mobileNo: 'required|digits:10',
    otp: 'required|numeric'
};

class SMSValidator {
    constructor() { }
    async sendOTP(req, res, next) {
        try {
            await Validator(req.body, sendOTPRule, {}, (err, status) => {
                CommonService.validationResponse(res, err, status, next);
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyOTP(req, res, next) {
        try {
            await Validator(req.body, verifyOTPRule, {}, (err, status) => {
                CommonService.validationResponse(res, err, status, next);
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new SMSValidator();
