const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    city : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    isAdmin: {
        type : Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)