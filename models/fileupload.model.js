const mongoose = require('mongoose');
let CONFIG = require('../config/config')

const FileUploadSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        uploadType: {
            type: String
        },
        fileInfo: {
            type: Object
        },
        documentType: {
            type: String
        },
    },
    {
        collection: 'fileuploads',
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toObject: { getters: true, setters: true },
        toJSON: { getters: true, setters: true }
    }
);

FileUploadSchema.virtual('fileUrl').
    get(function () {
        if (this.uploadType == 'local') {
            return `${CONFIG.APP_URL}${this.fileInfo.path}`
        } else if (this.uploadType == 's3') {
            return this.fileInfo.location;
        } else {
            return null
        }
    });

FileUploadSchema.index({ userId: 1, documentType: 1 }, { unique: true });

module.exports = mongoose.model('FileUpload', FileUploadSchema);
