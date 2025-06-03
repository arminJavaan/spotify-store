// backend/models/Cart.js

import mongoose from 'mongoose';
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

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
