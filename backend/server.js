// backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// اتصال به دیتابیس
connectDB();

// میان‌افزارها
app.use(cors());
app.use(express.json()); // برای خواندن body به‌صورت JSON

// مسیرها
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// پورت
const PORT = process.env.PORT || 5000;

// وقتی سرور بالا آمد، اگر محصولات اولیه (seed) موجود نباشد، آنها را در دیتابیس ایجاد می‌کنیم
const Product = require('./models/Product');
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // چهار محصول اولیه را تعریف می‌کنیم:
      const initialProducts = [
        {
          name: 'اکانت فردی (Individual Premium)',
          price: 129000,            // به تومان
          duration: '۱ ماهه',
          maxDevices: 1,
          description: 'این اکانت اشتراک پرمیوم فردی اسپاتیفای است. قابل استفاده برای یک دستگاه به‌صورت هم‌زمان با کیفیت Hi-Fi و بدون تبلیغات.',
          logoUrl: '/assets/logos/individual.png'
        },
        {
          name: 'اکانت خانوادگی (Family Premium)',
          price: 229000, 
          duration: '۱ ماهه',
          maxDevices: 6,
          description: 'این اکانت امکان استفاده برای ۶ نفر در یک خانواده را فراهم می‌کند. هر نفر پروفایل شخصی و پلی‌لیست مستقل دارد.',
          logoUrl: '/assets/logos/family.png'
        },
        {
          name: 'اکانت دانشجویی (Student Premium)',
          price: 79000, 
          duration: '۱ ماهه',
          maxDevices: 1,
          description: 'این اکانت ویژه دانشجویان است با تخفیف ۵۰٪ نسبت به اشتراک فردی. جهت استفاده قانونی، احراز دانشجویی مورد نیاز است.',
          logoUrl: '/assets/logos/student.png'
        },
        {
          name: 'اکانت دو نفره (Duo Premium)',
          price: 179000, 
          duration: '۱ ماهه',
          maxDevices: 2,
          description: 'این اکانت امکان اشتراک دو نفر را فراهم می‌کند. هر نفر پروفایل شخصی و پلی‌لیست مستقل دارد. مناسب زوج‌ها یا دوستان نزدیک.',
          logoUrl: '/assets/logos/duo.png'
        }
      ];
      await Product.insertMany(initialProducts);
      console.log('✅ محصولات اولیه ریخته شد');
    }
  } catch (err) {
    console.error('خطا در seed کردن محصولات:', err);
  }
};

// شروع سرور
app.listen(PORT, async () => {
  console.log(`🚀 Server started on port ${PORT}`);
  await seedProducts();
});
