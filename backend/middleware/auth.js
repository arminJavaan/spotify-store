const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function (req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'توکن ارسالی اشتباه است یا ارسال نشده' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id: userId, role: userRole }
    // Optionally, you can fetch and attach user details:
    req.userData = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'توکن معتبر نیست' });
  }
};
