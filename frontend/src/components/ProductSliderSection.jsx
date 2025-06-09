// ProductSliderSection با طراحی مینیمال، راست/چپ چین شده و دارای توضیحات متنی کنار کارت

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import API from '../api';

const descriptions = {
  Individual: {
    title: 'اکانت پرمیوم تکی | Individual',
    text: `یه دنیا موسیقی، فقط برای خودت.

اگه دوست داری بی‌وقفه، بدون تبلیغ، و با کیفیت بالا موسیقی گوش بدی، این پلن مخصوص توئه.

• پخش نامحدود بدون تبلیغ
• دانلود و گوش دادن آفلاین
• کیفیت صدای بالا
• حساب کاملاً شخصی

💡 برای کسایی که تنها شنیدن رو ترجیح می‌دن.`
  },
  Duo: {
    title: 'اکانت پرمیوم دو نفره | Duo',
    text: `دو نفر، دوتا حساب، نصف هزینه.

برای دوستای صمیمی، زوج‌ها یا هم‌اتاقی‌هایی که با هم موزیک گوش می‌دن ولی حساب جداگانه می‌خوان.

• دو اکانت کاملاً جدا
• پلی‌لیست مشترک مخصوص شما دوتا
• بدون تبلیغ و با کیفیت بالا
• دانلود برای استفاده آفلاین

💡 اگه دوتایی می‌خواید لذت ببرید.`
  },
  Family: {
    title: 'اکانت پرمیوم خانواده | Family',
    text: `موزیک برای همه اعضای خانواده، بدون دردسر.

یه پلن اقتصادی برای خونواده‌ها یا چند تا دوست که می‌خوان هزینه رو تقسیم کنن.

• تا ۶ حساب جداگانه با یک آدرس مشترک
• بدون تبلیغ
• کنترل محتوای مخصوص کودک
• پلی‌لیست خانوادگی و مشترک

💡 برای خانوادگی شنیدن با سلیقه‌های مختلف.`
  },
  Member: {
    title: 'عضویت در خانواده (فمیلی ممبر)',
    text: `تمام امکانات پرمیوم، با نصف هزینه.

تو عضو یک خانواده اسپاتیفای می‌شی، اما فقط برای خودت استفاده می‌کنی.

• اکانت شخصی و مستقل
• بدون تبلیغ
• دانلود آفلاین
• کیفیت بالا

💡 اقتصادی‌ترین گزینه برای تجربه پرمیوم.`
  }
};

export default function ProductSliderSection() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('خطا در دریافت محصولات', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    console.log('افزودن به سبد:', productId);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [products]);

  if (!products.length) return null;

  const product = products[currentIndex];
  const desc = descriptions[product.type] || {
    title: product.name,
    text: product.description
  };

  return (
    <section className="py-20 px-6 bg-[#101010]">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-2xl md:text-3xl font-extrabold text-primary mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          پلن‌های پیشنهادی امروز 🎧
        </motion.h2>

        <motion.div
          key={product._id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 items-center gap-10"
        >
          {/* توضیحات سمت چپ */}
          <div className="text-right">
            <h3 className="text-xl font-bold text-white mb-4">{desc.title}</h3>
            <p className="text-gray-400 whitespace-pre-line leading-relaxed text-sm md:text-base">
              {desc.text}
            </p>
          </div>

          {/* کارت سمت راست */}
          <div className="max-w-md mx-auto">
            <ProductCard product={product} onAdd={handleAddToCart} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}