// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // اگر نیاز باشد می‌توانید فیلدهای بیشتری اضافه کنید مانند نقش کاربر (role)
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
