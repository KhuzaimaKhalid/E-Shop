const mongoose = require('mongoose')
const paymentMethods = {
  values: ['card', 'cash'],
  message: 'enum validator failed for payment Methods'
}
const orderSchema = new mongoose.Schema({
  items: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  totalAmount: {
    type: Number
  },
  totalItems: {
    type: Number
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, required: true, enum: paymentMethods },
  paymentStatus: { type: String, default: "pending" },
  Status: { type: String, default: "pending" },
  selectedAddress: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  currentLocation: { type: String, default: "Processing" },
  trackingHistory: [{
    location: String,
    timestamp: Date,
    status: String
  }]
  
},{timestamps: true})

const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('order', orderSchema)