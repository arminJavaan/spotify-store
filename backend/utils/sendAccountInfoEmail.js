import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAccountInfoEmail = async (
  to,
  name,
  orderId,
  date,
  amount,
  accountEmail,
  accountPassword
) => {
  const html = `
  <div style="font-family: 'Tahoma', sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #1db954; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Spotify Store</h2>
        <p style="margin: 5px 0 0;">اطلاعات سفارش پرمیوم شما</p>
      </div>
      
      <div style="padding: 25px;">
        <p style="font-size: 16px;">سلام <strong>${name}</strong> عزیز 👋</p>
        <p>از خرید شما متشکریم.:</p>
        <br>
        <p>اطلاعات سفارش و اکانت در ادامه آمده است:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">شماره سفارش:</td>
            <td style="padding: 8px; direction: ltr;">${orderId}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">تاریخ خرید:</td>
            <td style="padding: 8px;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">مبلغ پرداختی:</td>
            <td style="padding: 8px;">${amount.toLocaleString("fa-IR")} تومان</td>
          </tr>
        </table>

        <h3 style="margin-top: 30px;">🧑‍💻 اطلاعات اکانت اسپاتیفای:</h3>
        <div style="background-color: #f6f6f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>ایمیل:</strong> ${accountEmail}</p>
          <p><strong>رمز عبور:</strong> ${accountPassword}</p>
        </div>

        <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          ⚠️ <strong>هشدار امنیتی:</strong> لطفاً از اشتراک‌گذاری این اکانت با دیگران خودداری کنید. در صورت نقض این مورد، دسترسی شما بدون اطلاع قبلی قطع خواهد شد.
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://sepotify.ir/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #1db954; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ورود به پنل کاربری
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
          اگر سوالی داشتید، از طریق پشتیبانی سایت با ما در ارتباط باشید 💬
        </p>
      </div>
    </div>
  </div>
  `;

  return await transporter.sendMail({
    from: `"Spotify Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎧 اطلاعات اکانت پرمیوم شما - سفارش ${orderId}`,
    html,
  });
};
