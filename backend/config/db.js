// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // options در نسخه‌های جدید mongoose دیگر اغلب نیاز نیست
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
