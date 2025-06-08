// backend/server.js
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import walletRoutes from './routes/wallet.js'
import supportRoutes from './routes/support.js';
dotenv.config()

// لازم برای مسیر نسبی در ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()

connectDB()

app.use(express.json())
app.use(cors())
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));
// Mount کردن روت‌های اصلی قبل از فراخوانی 404
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import discountRoutes from './routes/discounts.js'
// import cryptoRoutes from './routes/crypto.js'

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/discounts', discountRoutes)
// app.use('/api/crypto', cryptoRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/support', supportRoutes);

app.get('/', (req, res) => {
  res.send('Spotify Store API is running')
})

// هندل 404
app.use((req, res) => {
  res.status(404).json({ msg: 'مسیر پیدا نشد' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`))
