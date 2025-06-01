// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// اتصال به MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// ★ اضافه: سرو فولدر uploads به‌صورت استاتیک
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// مسیرهای عمومی
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// مسیرهای ادمین
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.send('Spotify Store API is running');
});

// 404 handler — حتماً بعد از همهٔ app.useهای بالا باشد
app.use((req, res) => {
  res.status(404).json({ msg: 'مسیر پیدا نشد' });
});

// **حذف این خط**
// app.use('/api/cart', require('./routes/cart'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
