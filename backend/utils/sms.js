// backend/utils/sms.js
import axios from 'axios';

const API_KEY = process.env.LIMOSMS_API_KEY;


export async function sendSMSCode(Mobile) {
  try {
    const res = await axios.post('https://api.limosms.com/api/sendcode', {
      Mobile: Mobile,
      Footer: 'سپاتیفای',
    }, {
      headers: {
        ApiKey: API_KEY,
      },
    });

    return res.data;
  } catch (err) {
    console.error('خطا در ارسال پیامک:', err?.response?.data || err);
    return { Success: false, Message: 'خطا در ارتباط با سرویس پیامک' };
  }
}

export async function verifySMSCode(Mobile, code) {
  try {
    const res = await axios.post('https://api.limosms.com/api/checkcode', {
      Mobile: Mobile,
      Code: code
    }, {
      headers: {
        ApiKey: API_KEY
      }
    });

    return res.data;
  } catch (err) {
    console.error('خطا در بررسی کد پیامک:', err?.response?.data || err);
    return { Success: false, Message: 'خطا در ارتباط با سرویس پیامک' };
  }
}
