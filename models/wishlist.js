const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    products: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addedAT: {
        type:Date,
        default: Date.now()
    }
})

wishlistSchema.index({user:1,products:1}, {unique:true})

module.exports = mongoose.model('wishlist',wishlistSchema)