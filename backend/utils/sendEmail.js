// backend/utils/sendEmail.js

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ارسال سفارش به ادمین
export async function sendOrderEmail(order) {
  try {
    const to = process.env.ADMIN_EMAIL;

    const html = `
      <div style="font-family: Tahoma, sans-serif; max-width: 700px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 12px; border: 1px solid #ddd;">
        <h2 style="color: #1db954; text-align: center;">📦 سفارش جدید ثبت شد</h2>

        <p style="font-size: 16px;"><strong>👤 کاربر:</strong> ${order.user?.email || order.user}</p>
        <p style="font-size: 16px;"><strong>💳 روش پرداخت:</strong> ${order.paymentMethod}</p>
        <p style="font-size: 16px;"><strong>🏷️ کد تخفیف:</strong> ${order.discountCode || 'ندارد'}</p>

        <h3 style="margin-top: 24px; color: #333;">🛒 لیست محصولات:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
          <thead>
            <tr style="background-color: #eee;">
              <th style="padding: 8px; border: 1px solid #ccc; text-align: right;">نام محصول</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: center;">تعداد</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: center;">قیمت واحد</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: center;">جمع کل</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">${item.product.name}</td>
                <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.product.price.toLocaleString('fa-IR')}</td>
                <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${(item.product.price * item.quantity).toLocaleString('fa-IR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 style="margin-top: 24px; color: #333;">💰 جزئیات پرداخت:</h3>
        <p style="font-size: 16px;"><strong>تخفیف:</strong> ${order.discountAmount?.toLocaleString('fa-IR') || 0} تومان</p>
        <p style="font-size: 16px;"><strong>مبلغ نهایی پرداخت:</strong> ${order.totalAmount.toLocaleString('fa-IR')} تومان</p>

        <p style="font-size: 16px;"><strong>📌 وضعیت سفارش:</strong> ${order.status}</p>
        <p style="font-size: 16px;"><strong>🕒 زمان ثبت:</strong> ${new Date(order.createdAt).toLocaleString("fa-IR")}</p>

        <hr style="margin: 32px 0;" />
        <p style="text-align: center; color: #888;">سیستم اطلاع‌رسانی فروشگاه اسپاتیفای</p>
      </div>
    `;

    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: '📥 سفارش جدید ثبت شد',
      html
    });

    console.log('📧 ایمیل با موفقیت به ادمین ارسال شد:', res.id || res);
  } catch (err) {
    console.error('❌ خطا در ارسال ایمیل به ادمین:', err);
  }
}

// ارسال رسید سفارش به ایمیل کاربر
export async function sendOrderReceiptEmail(order) {
  try {
    const userEmail = order.user?.email || "";
    if (!userEmail) return;

    const html = `
      <div style="font-family: Tahoma; max-width: 700px; margin: auto; padding: 24px; background: #f9f9f9; border-radius: 12px; border: 1px solid #ddd;">
        <h2 style="text-align: center; color: #1db954;">✅ رسید سفارش شما</h2>
        <p>سلام ${order.user?.name || ""} عزیز 🌟</p>
        <p>سفارش شما با موفقیت ثبت شد. جزئیات سفارش به شرح زیر است:</p>

        <h3 style="margin-top: 20px;">🛒 محصولات:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 8px; border: 1px solid #ccc;">نام محصول</th>
              <th style="padding: 8px; border: 1px solid #ccc;">تعداد</th>
              <th style="padding: 8px; border: 1px solid #ccc;">قیمت واحد</th>
              <th style="padding: 8px; border: 1px solid #ccc;">جمع</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;">${item.product.name}</td>
                <td style="padding: 8px; border: 1px solid #ccc;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ccc;">${item.product.price.toLocaleString('fa-IR')}</td>
                <td style="padding: 8px; border: 1px solid #ccc;">${(item.product.price * item.quantity).toLocaleString('fa-IR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 style="margin-top: 20px;">💳 جزئیات پرداخت:</h3>
        <p><strong>مبلغ کل:</strong> ${order.totalAmount.toLocaleString('fa-IR')} تومان</p>
        <p><strong>تخفیف:</strong> ${order.discountAmount?.toLocaleString('fa-IR') || 0} تومان</p>
        <p><strong>روش پرداخت:</strong> ${order.paymentMethod}</p>
        <p><strong>کد تخفیف:</strong> ${order.discountCode || 'ندارد'}</p>
        <p><strong>وضعیت سفارش:</strong> ${order.status}</p>
        <p><strong>تاریخ ثبت:</strong> ${new Date(order.createdAt).toLocaleString('fa-IR')}</p>

        <hr style="margin: 32px 0;" />
        <p style="text-align: center; color: #999;">با تشکر از خرید شما از فروشگاه اسپاتیفای 🎧</p>
      </div>
    `;

    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: userEmail,
      subject: "📥 رسید سفارش شما - فروشگاه اسپاتیفای",
      html
    });

    console.log("📧 رسید سفارش به کاربر ارسال شد:", res.id || res);
  } catch (err) {
    console.error("❌ خطا در ارسال رسید خرید:", err);
  }
}
