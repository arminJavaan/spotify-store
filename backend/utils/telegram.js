import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID_RECEIVED = process.env.TELEGRAM_ORDER_RECEIVED_CHAT_ID;
const CHAT_ID_COMPLETED = process.env.TELEGRAM_ORDER_COMPLETED_CHAT_ID;

console.log("📦 ENV - RECEIVED:", CHAT_ID_RECEIVED);
console.log("📦 ENV - COMPLETED:", CHAT_ID_COMPLETED);

const sendTelegramMessage = async (text, target = "completed") => {
  if (!TELEGRAM_TOKEN) {
    console.error("❌ TELEGRAM_BOT_TOKEN تعریف نشده");
    return;
  }

  const chatId =
    target === "received" ? CHAT_ID_RECEIVED :
    target === "completed" ? CHAT_ID_COMPLETED :
    null;

  console.log("📤 Sending to:", chatId, " | Target:", target);

  if (!chatId) {
    console.error("❌ chatId نامعتبر است");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error("❌ خطا در ارسال پیام تلگرام:", err.response?.data || err.message);
  }
};

export default sendTelegramMessage;
