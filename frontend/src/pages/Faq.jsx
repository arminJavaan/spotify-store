import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

const faqs = [
  {
    question: 'چرا از سپاتیفای خرید کنم؟',
    answer:
      'برخلاف خیلی از سایت‌ها که با روش ترایال یا هکی فعال می‌کنن و هی پرمیوم قطع میشه، ما مستقیم با کارت بانکی خارجی پرداخت می‌کنیم. پس اکانت بن نمیشه و پرمیوم ثابت می‌مونه.',
  },
  {
    question: 'اگه اکانت اسپاتیفای نداشته باشم چی؟',
    answer: 'هیچ مشکلی نیست! همه این کارا به عهده خودمونه😉',
  },
  {
    question: 'روی اکانت خودم پرمیوم میشه یا یکی جدید؟',
    answer:
      'بله، روی همون اکانت شخصی خودت پرمیوم می‌کنیم. فقط رمز درست بده. اگه لیمیت باشه هم اطلاع میدیم برات درستش کنیم.',
  },
  {
    question: 'پلن فمیلی ممبر چرا پیشنهاد نمیشه؟',
    answer:
      'فمیلی ممبر هرچند ارزونه، ولی مدام قطع میشه، اکانت تعویض میشه، پلی‌لیست‌هات حذف میشه. پس بهتره بری سراغ پلن ایندویژوال که خیالت راحت باشه.',
  },
  {
    question: 'کدوم پلن برای من مناسبه؟',
    answer:
      'اگه تنهایی استفاده می‌کنی، ایندویژوال عالیه. اگه با یکی دیگه هستی پلن Duo مناسبه. خانواده‌ای هستید؟ فمیلی Owner رو بگیر و بقیه رو دعوت کن.',
  },
  {
    question: 'موقع استفاده با VPN مشکلی پیش میاد؟',
    answer:
      'نه اصلاً! ما ریجن ترکیه انتخاب می‌کنیم که با وی‌پی‌ان ایران مشکلی نداره و حساسیت زیادی هم نداره.',
  },
  {
    question: 'چقدر طول می‌کشه سفارش من انجام بشه؟',
    answer:
      'از ۱ تا حداکثر ۲۴ ساعت کاری زمان می‌بره. البته بیشتر سفارش‌ها زیر ۸ ساعت تحویل داده می‌شن.',
  },
  {
    question: 'اکانتی که می‌گیرم چی داره؟',
    answer:
      'بدون تبلیغه، آهنگ‌هارو می‌تونی دانلود کنی، آفلاین گوش بدی، کیفیت صدا عالیه، پلی‌لیست بسازی و شخصی‌سازی داشته باشی. خلاصه هرچی بخوای داره!',
  },
  {
    question: 'چجوری باید بخرم؟',
    answer:
      'راحت! فقط پلن موردنظرتو انتخاب کن، مشخصاتتو وارد کن، پرداخت رو انجام بده. ما بقیه‌ش با ماست 😉',
  },
  {
    question: 'چطور از کد تخفیف استفاده کنم؟',
    answer:
      'کد تخفیف رو توی مرحله پرداخت وارد کن و دکمهٔ "اعمال کد" رو بزن. اگه معتبر باشه، تخفیفش از مبلغ کل کم میشه. بعضی کدها مخصوص یه نفرن، بعضیا فقط یه بار میشه استفاده کرد. بعد از اعمال، مبلغ نهایی رو می‌بینی و ادامه می‌دی به پرداخت.',
  },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen  text-gray-light py-20 px-4 mt-12">
      <motion.h2
        className="text-3xl font-bold text-primary text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        سوالات متداول 🎧
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-dark1 rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }

            }
            exit={{ opacity: 0, y: 10 }}
            transitionExit={{ duration: 0.2 }}
            

          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none hover:bg-dark2 transition"
            >
              <span className="font-semibold">{faq.question}</span>
              <motion.span
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown />
              </motion.span>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 pb-4 text-sm text-gray-400"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
