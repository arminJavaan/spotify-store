// backend/models/Order.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
})

const OrderSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['whatsapp', 'other']
  },
  paymentDetails: {
    type: String
  },
  whatsappOrderUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
