// backend/models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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
    // مثال: برای crypto می‌تواند نوع ارز انتخابی باشد، 
    // یا برای کار به کار بانک اطلاعاتی که کاربر وارد کرده
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending'
  },
  whatsappOrderUrl: {
    type: String // URL واتساپ برای سفارش (اگر از روش واتساپ استفاده شده باشد)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
