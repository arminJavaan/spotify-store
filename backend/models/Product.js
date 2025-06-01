// backend/models/Product.js

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bannerUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  maxDevices: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Product', ProductSchema)
