// backend/middleware/auth.js

const jwt = require('jsonwebtoken')
const User = require('../models/User')
const dotenv = require('dotenv')
dotenv.config()

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'توکن ارسالی اشتباه است یا ارسال نشده' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ msg: 'توکن معتبر نیست' })
  }
}
