const mongoose = require('mongoose')


const msgSchema = new mongoose.Schema({

    name: {
        type: String
    },
    number: Number,
    msg: String

})



const Message = mongoose.model('Message', msgSchema)
module.exports = Message;