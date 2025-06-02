// frontend/src/pages/Contact.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser } from "react-icons/fi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // در اینجا می‌توانید ارسال فرم را به سرور انجام دهید
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="mt-12 text-gray-light min-h-screen py-16 px-6 ">
      {/* Hero Section */}
      <motion.section
        className="max-w-4xl mx-auto text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary">تماس با ما</h1>
        <p className="text-lg">
          همیشه خوشحال می‌شویم از شما بشنویم!  
          اگر سوال یا پیشنهادی دارید، فرم زیر را پر کنید یا از اطلاعات تماس ما استفاده کنید.
        </p>
      </motion.section>

      {/* Contact Info */}
      <motion.section
        className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiMapPin className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">آدرس دفتر</h3>
          <p className="text-gray-light text-center">
            خیابان انقلاب، پلاک ۱۲۳، تهران، ایران
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiPhone className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">تلفن تماس</h3>
          <p className="text-gray-light text-center">+۹۸ ۲۱ ۱۲۳۴۵۶۷۸</p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiMail className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">ایمیل</h3>
          <p className="text-gray-light text-center">support@spotifystore.ir</p>
        </motion.div>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        className="mt-16 max-w-3xl mx-auto bg-dark1 p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          فرم ارتباطی
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-gray-light">
              نام و نام خانوادگی
            </label>
            <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
              <FiUser className="ml-2 text-gray-light" />
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="مثلاً: علی رضایی"
                className="w-full px-3 py-2 bg-transparent focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-light">
              ایمیل
            </label>
            <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
              <FiMail className="ml-2 text-gray-light" />
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="مثلاً: example@domain.com"
                className="w-full px-3 py-2 bg-transparent focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-gray-light">
              پیام شما
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="دیدگاه یا سوال خود را اینجا وارد کنید..."
              className="w-full px-4 py-3 bg-dark2 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-3 px-6 rounded-lg transition"
          >
            <FiSend className="ml-2" />
            ارسال پیام
          </button>

          {submitted && (
            <p className="text-green-400 text-center mt-4">
              پیام شما با موفقیت ارسال شد!
            </p>
          )}
        </form>
      </motion.section>

      {/* Footer CTA */}
      <motion.section
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-primary mb-4">
          منتظر تماس شما هستیم!
        </h2>
        <p className="text-gray-light mb-6">
          هر زمان که سوال یا پیشنهادی داشتید، با ما در ارتباط باشید.  
          تیم ما همیشه آماده پاسخگویی است.
        </p>
        <motion.a
          href="/"
          className="inline-block bg-primary text-dark2 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          whileHover={{ scale: 1.05 }}
        >
          بازگشت به خانه
        </motion.a>
      </motion.section>
    </main>
  );
}
