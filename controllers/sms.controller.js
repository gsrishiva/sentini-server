let SMSService = require('../services/sms.service')
const { response } = require('express')

class SMSController {
    constructor() { }

    sendOTP(req, res, next) {
        try {
            if (req.body.resend === true) {
                SMSService.reSendOTP(req.body)
                    .then(response => res.json(response))
                    .catch(error => next(error))
            } else {
                SMSService.sendOTP(req.body)
                    .then(response => res.json(response))
                    .catch(error => next(error))
            }
        } catch (error) {
            next(error)
        }
    }

    verifyOTP(req, res, next) {
        try {
            SMSService.verifyOTP(req.body)
                .then(response => res.json(response))
                .catch(error => next(error))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SMSController()