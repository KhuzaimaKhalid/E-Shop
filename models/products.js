const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: [String],
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("products",productsSchema)