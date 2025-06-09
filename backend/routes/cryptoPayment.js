import express from "express";
import axios from "axios";
import auth from "../middleware/auth.js";
import Order from "../models/Order.js";
import WalletTopupRequest from "../models/WalletTopupRequest.js";

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { orderId, currency = "usdttrc20", type = "order" } = req.body;

  let amount;
  let identifier;

  try {
    if (type === "topup") {
      const topup = await WalletTopupRequest.findById(orderId);
      if (!topup) return res.status(404).json({ error: "درخواست شارژ یافت نشد" });
      amount = topup.amount;
      identifier = `topup-${topup._id}`;
    } else {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "سفارش یافت نشد" });
      amount = order.totalAmount;
      identifier = order._id;
    }

    const usdRate = process.env.USD_RATE || 90000;
    const usdAmount = (amount / usdRate).toFixed(2);

    const response = await axios.post("https://api.nowpayments.io/v1/invoice", {
      price_amount: usdAmount,
      price_currency: "usd",
      pay_currency: currency,
      order_id: identifier,
      ipn_callback_url: process.env.NOWPAYMENTS_CALLBACK_URL,
    }, {
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json"
      },
    });

    res.json({ paymentUrl: response.data.invoice_url });
  } catch (error) {
    console.error("CryptoPayment Error:", error.response?.data || error.message);
    res.status(500).json({ error: "خطا در ایجاد فاکتور پرداخت" });
  }
});

// Webhook
router.post("/callback", async (req, res) => {
  console.log("✅ Webhook received:", req.body);
  const { payment_status, order_id } = req.body;

  if (payment_status === "finished") {
    try {
      if (order_id.startsWith("topup-")) {
        const topupId = order_id.replace("topup-", "");
        const request = await WalletTopupRequest.findById(topupId);
        if (request && request.status === "pending") {
          request.status = "approved";
          await request.save();

          const wallet = await Wallet.findOne({ user: request.user });
          if (wallet) {
            wallet.balance += request.amount;
            wallet.transactions.push({
              type: "increase",
              amount: request.amount,
              description: "شارژ اتوماتیک از طریق پرداخت ارز دیجیتال",
            });
            await wallet.save();
          }
        }
      } else {
        const order = await Order.findById(order_id);
        if (order && order.status !== "paid") {
          order.status = "paid";
          await order.save();
        }
      }
    } catch (err) {
      console.error("Webhook handling error:", err);
    }
  }

  res.sendStatus(200);
});

export default router;
