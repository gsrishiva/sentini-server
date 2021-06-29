const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    products: [],
    // invoice_Id: {
    //     type: String,
    //     unique: true
    // },
    invoiceDate: {
        type: Date,
    },
    orderValue: {
        type: String,
    },
    orderDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
    },
    status: {
        type: String,
    },
    email: {
        type: String
    },
    userId: {
        type: String
    }
})
const Orders = mongoose.model('orders', orderSchema)
module.exports = Orders;