let FileUpload = require('../models/fileupload.model')
let { ApplicationError } = require('../utilities/error')
let CONFG = require('../config/config')
const _ = require('lodash');

class UserController {
    constructor() { }

    uploadDocuments = async (req, res, next) => {
        try {
            if (req.files.length == 0) {
                res.json({
                    success: false,
                    message: 'Please select minimum 1 file'
                })
            } else {
                let bulkWriteObj = [];
                req.files.forEach(element => {
                    bulkWriteObj.push({
                        updateOne: {
                            filter: { userId: req.user._id, documentType: element.fieldname },
                            update: {
                                userId: req.user._id,
                                fileInfo: element,
                                documentType: element.fieldname,
                                uploadType: CONFG.storageOption
                            },
                            upsert: true
                        }
                    })
                });
                let response = await FileUpload.bulkWrite(bulkWriteObj)
                res.json({
                    success: true,
                    message: 'Files upload successfully',
                    data: response,
                    filesData: req.files
                })
            }
        } catch (error) {
            throw new ApplicationError(412, error.message)
        }
    }

    getDocuments = async (req, res, next) => {
        try {
            let response = await FileUpload.find({ userId: req.params.userId })
            res.json({
                success: true,
                message: 'Files data fetched successfully',
                data: _.map(response, element => {
                    return {
                        uploadType: element.uploadType,
                        documentType: element.documentType,
                        fileType: element.fileInfo.mimetype,
                        fileUrl: element.fileUrl
                    }
                })
            })
        } catch (error) {
            throw new ApplicationError(412, error.message)
        }
    }
}

module.exports = new UserController()