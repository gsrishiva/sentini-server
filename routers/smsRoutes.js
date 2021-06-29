const express = require('express')
const smsRouter = express.Router();
let SMSValidator = require('../middleware/sms.validator')
let SMSController = require('../controllers/sms.controller')

smsRouter.post('/sendotp', /* SMSValidator.sendOTP, */ SMSController.sendOTP)
smsRouter.post('/verifyotp', SMSValidator.verifyOTP, SMSController.verifyOTP)

module.exports = smsRouter