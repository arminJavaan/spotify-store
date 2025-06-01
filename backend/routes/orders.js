// backend/routes/orders.js

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')
const User = require('../models/User')
const Order = require('../models/Order')
const dotenv = require('dotenv')
dotenv.config()

router.post('/', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body
    const user = await User.findById(req.user.id).populate('cart.product')
    if (!user || user.cart.length === 0)
      return res.status(400).json({ msg: 'سبد خرید شما خالی است' })

    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    let orderData = {
      user: req.user.id,
      items: user.cart.map(i => ({
        product: i.product._id,
        quantity: i.quantity
      })),
      totalAmount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    }

    if (paymentMethod === 'whatsapp') {
      const whatsappNumber = process.env.WHATSAPP_NUMBER || '+989000000000'
      let text = `سلام! من می‌خوام این سفارش رو ثبت کنم:\n`
      user.cart.forEach(item => {
        text += `• ${item.product.name} × ${item.quantity}\n`
      })
      text += `مبلغ کل: ${totalAmount.toLocaleString('fa-IR')} تومان`
      const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
      orderData.whatsappOrderUrl = url
    }

    const newOrder = new Order(orderData)
    await newOrder.save()

    user.cart = []
    await user.save()

    return res.json({ msg: 'سفارش با موفقیت ثبت شد', order: newOrder })
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 })
    return res.json(orders)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product')
    if (!order) return res.status(404).json({ msg: 'سفارش یافت نشد' })

    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id)
      return res.status(403).json({ msg: 'دسترسی کافی نیست' })

    return res.json(order)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'سفارش یافت نشد' })
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

router.put('/:id/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'completed', 'cancelled'].includes(status))
      return res.status(400).json({ msg: 'وضعیت نامعتبر است' })

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ msg: 'سفارش یافت نشد' })

    order.status = status
    await order.save()
    return res.json({ msg: 'وضعیت سفارش به‌روزرسانی شد', order })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'سفارش یافت نشد' })
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

module.exports = router
