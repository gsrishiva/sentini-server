const axios = require('axios').default;
let authKey = '339754A6d8CS8w85f437dbfP1'

let templateId = '5f49034ad6fc057bd87555b9'

class SMSService {
    constructor() {
    }
    async sendOTP(data) {
        return new Promise(async (resolve, reject) => {
            // resolve({ success: true, message: 'Please Enter OTP received on your Registered Mobile' })
            await axios
                .get(`https://api.msg91.com/api/v5/otp?authkey=${authKey}&template_id=${templateId}&mobile=91${data.mobileNo}&otp_length=6&otp_expiry=5`)
                .then(result => {
                    if (result.data.type == 'success') {
                        resolve({ success: true, message: 'Please Enter OTP received on your Registered Mobile' })
                    }
                    if (result.data.type == 'error') {
                        resolve({ success: false, message: result.data.message })
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async reSendOTP(data) {
        return new Promise(async (resolve, reject) => {
            await axios
                .post(`https://api.msg91.com/api/v5/otp/retry?mobile=91${data.mobileNo}&authkey=${authKey}&retrytype=text`)
                .then(result => {
                    if (result.data.type == 'success') {
                        resolve({ message: 'OTP Resent Successfully' })
                    }
                    if (result.data.type == 'error') {
                        resolve({ success: false, message: result.data.message })
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async verifyOTP(data) {
        return new Promise(async (resolve, reject) => {
            // resolve({
            //     success: true,
            //     message: 'OTP Verified Successfully. Click order to place order'
            // })
            await axios
                .post(`https://api.msg91.com/api/v5/otp/verify?mobile=91${data.mobileNo}&authkey=${authKey}&otp=${data.otp}`)
                .then(result => {
                    if (result.data.type == 'success') {
                        resolve({
                            success: true,
                            message: 'OTP Verified Successfully. Click order to place order'
                        })
                    }
                    if (result.data.type == 'error') {
                        resolve({ success: false, message: result.data.message })
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
module.exports = new SMSService()