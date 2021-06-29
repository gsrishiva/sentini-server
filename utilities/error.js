class ApplicationError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
const handleError = (err, res) => {
    let { statusCode, message } = err;
    if (!statusCode) {
        statusCode = 500;
    }
    res.status(statusCode).json({
        message
    });
};
module.exports = {
    ApplicationError,
    handleError
};
