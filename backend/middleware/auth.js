// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (req, res, next) {
  // توکن باید در Header به شکل Authorization: Bearer <token> ارسال شود
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'توکن احراز هویت لازم است' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'احراز هویت انجام نشد' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // در زمان لاگین، payload حاوی { user: { id: ... } }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'توکن نامعتبر است' });
  }
};
