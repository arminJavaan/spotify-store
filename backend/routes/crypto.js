// backend/routes/crypto.js

const express = require('express');
const router = express.Router();
const { createCharge, handleWebhook } = require('../controllers/cryptoController');
const auth = require('../middleware/auth');

// ایجاد یک 〈Charge〉 جدید
router.post('/create-charge', auth, createCharge);

// وب‌هوک (نیازی به احراز هویت نیست)
router.post('/webhook', express.json(), handleWebhook);

module.exports = router;
