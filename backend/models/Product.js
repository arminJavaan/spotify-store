// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {         // قیمت به تومان
    type: Number,
    required: true
  },
  duration: {      // طول اشتراک (مثلاً “1 ماهه”)
    type: String,
    required: true
  },
  maxDevices: {    // حداکثر دستگاه مجاز
    type: Number,
    required: true
  },
  description: {   // توضیح کامل به زبان فارسی
    type: String,
    required: true
  },
  logoUrl: {       // نشانی لوگوی کوچک (در فولدر frontend/assets/logos خواهد بود)
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
