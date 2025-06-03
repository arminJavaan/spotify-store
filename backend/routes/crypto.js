// backend/routes/crypto.js

import express from 'express';
const router = express.Router();

import { createCharge, handleWebhook } from '../controllers/cryptoController.js';
import auth from '../middleware/auth.js';

// ایجاد یک 〈Charge〉 جدید
router.post('/create-charge', auth, createCharge);

// وب‌هوک (نیازی به احراز هویت نیست)
router.post('/webhook', express.json(), handleWebhook);

export default router;
