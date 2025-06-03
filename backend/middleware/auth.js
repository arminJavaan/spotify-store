// backend/middleware/auth.js

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'توکن ارسالی اشتباه است یا ارسال نشده' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    console.error('❌ JWT Verification Error:', err.message)
    console.log("🧪 Token received:", authHeader);
    res.status(401).json({ msg: 'توکن معتبر نیست' })
  }
}

export default auth
