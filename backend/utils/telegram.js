// backend/utils/telegram.js
import axios from 'axios'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

const sendTelegramMessage = async (text) => {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML'
    })
  } catch (err) {
    console.error('❌ خطا در ارسال پیام تلگرام:', err.response?.data || err.message)
  }
}

export default sendTelegramMessage
