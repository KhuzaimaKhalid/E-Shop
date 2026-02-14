const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    quantity: { type: Number, required: true },
    products: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

cartSchema.virtual('id').get(function () {
    return this._id.toString();         // explicit string id
});

const toJSONoptions = {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;                   // remove _id from JSON
    }
};

cartSchema.set('toJSON', toJSONoptions);
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('cart',cartSchema)