const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
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

const CartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema]
});

module.exports = mongoose.model('Cart', CartSchema);
