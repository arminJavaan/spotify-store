const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
});

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
    enum: ['shaparak', 'crypto', 'card-to-card', 'whatsapp'],
    required: true
  },
  paymentDetails: {
    // flexible field to store any JSON of payment info
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  whatsappOrderUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
