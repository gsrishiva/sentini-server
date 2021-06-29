const mongoose = require('mongoose')
const User = require('./userModel')
const cartSchema = new mongoose.Schema({
  user_Id: {
    type: String,
    ref: User
  },
  products: [{}]

})
const cart = mongoose.model('Cart', cartSchema)
module.exports = cart;