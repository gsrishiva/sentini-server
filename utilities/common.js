
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { ApplicationError } = require('../utilities/error')
let CONFIG = require('../config/config');
let User = require('../models/userModel');

class CommonService {
    constructor() { }

    //common function to return error response or make next() call to controller
    validationResponse = (res, err, status, next) => {
        if (!status) {
            res.status(400).send({
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    };
    createToken = (data, expiresIn) => {
        try {
            return jwt.sign(data, CONFIG.jwt.secret, {
                // expiresIn: CONFIG.CLIENT_TOKEN_EXPIRY_DURATION
                expiresIn: expiresIn,
                mutatePayload: true
            });
        } catch (error) {
            logger.log('error', error);
            throw new ApplicationError(500, `Error while creating JWT`);
        }
    };

    decodeToken = jwtToken => {
        try {
            return jwt.decode(jwtToken, {
                complete: true,
                json: true
            });
        } catch (error) {
            logger.log('error', error);
            throw new ApplicationError(500, `Error while decoding jwt token`);
        }
    };

    verifyToken = jwtToken => {
        try {
            return jwt.verify(jwtToken, CONFIG.jwt.secret);
        } catch (error) {
            throw new ApplicationError(401, error.message);
        }
    };

    authenticateUser = async (req, res, next) => {
        try {
            // Gather the jwt access token from the request header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) throw new ApplicationError(401, 'Unauthorized client'); // if there isn't any token
            if (authHeader.split(' ')[0]) {
                if (authHeader.split(' ')[0] != 'Bearer') {
                    throw new ApplicationError(401, 'Unauthorized client');
                }
            }
            await jwt.verify(token, CONFIG.jwt.secret, async (err, user) => {
                if (err) throw new ApplicationError(403, 'Access Forbidden');
                let userInfo = await User.findById(user._id).exec();
                if (userInfo) {
                    if (userInfo._id.toString() == user._id) {
                        req.user = userInfo;
                    } else {
                        throw new ApplicationError(403, 'Access Forbidden');
                    }
                } else {
                    throw new ApplicationError(403, 'Access Forbidden');
                }
                next(); // pass the execution off to whatever request the client intended
            });
        } catch (error) {
            next(error);
        }
    };

    createPasswordHash = password => {
        try {
            return bcrypt.hashSync(password, 10);
        } catch (error) {
            throw new ApplicationError(500, `Error while creating Password Hash`);
        }
    };

    comparePassword = (password, hashedPassword) => {
        try {
            return bcrypt.compareSync(password, hashedPassword);
        } catch (error) {
            throw new ApplicationError(401, `Invalid Credentials`);
        }
    };

}

module.exports = new CommonService();
