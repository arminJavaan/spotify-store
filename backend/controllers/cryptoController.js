// backend/controllers/cryptoController.js

import CoinbaseCommerce from 'coinbase-commerce-node';
import dotenv from 'dotenv';

dotenv.config();

const { Charge, Webhook, Client } = CoinbaseCommerce;
Client.init(process.env.COINBASE_COMMERCE_API_KEY);

/**
 * ایجاد یک 〈Charge〉 جدید برای پرداخت کاربر
 * body: {
 *   orderId: "شناسه سفارش در دیتابیس شما",
 *   amount: 100, // مبلغ به تومان یا دلار (بسته به تنظیمات)
 *   currency: "USD", // یا "EUR" و غیره
 * }
 */
export const createCharge = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    const chargeData = {
      name: `Order #${orderId}`,
      description: `پرداخت سفارش شماره ${orderId}`,
      local_price: {
        amount: amount.toString(),
        currency: currency
      },
      pricing_type: "fixed_price",
      metadata: {
        orderId: orderId
      },
      redirect_url: `${process.env.FRONTEND_BASE_URL}/order-success`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/order-cancel`
    };

    const charge = await Charge.create(chargeData);

    return res.status(201).json({ hostedUrl: charge.hosted_url, chargeId: charge.id });
  } catch (error) {
    console.error("Error creating Coinbase charge:", error);
    return res.status(500).json({ msg: "خطا در ایجاد پرداخت با کریپتو" });
  }
};

/**
 * وب‌هوک برای دریافت وضعیت تراکنش
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['x-cc-webhook-signature'];
  const payload = req.body;

  let event;
  try {
    event = Webhook.verifyEventBody(
      JSON.stringify(payload),
      signature,
      process.env.COINBASE_COMMERCE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook Verification failed:", error);
    return res.status(400).send('Webhook Error');
  }

  if (event.type === 'charge:confirmed' || event.type === 'charge:completed') {
    const charge = event.data;
    const orderId = charge.metadata.orderId;
    // TODO: در دیتابیس خودتان سفارش با orderId را پیدا کنید و وضعیت آن را به «پرداخت‌شده» تبدیل کنید
    // مثلا:
    // await Order.findByIdAndUpdate(orderId, { status: "paid", paymentDetails: {...} })
  }

  res.status(200).send('Received');
};
