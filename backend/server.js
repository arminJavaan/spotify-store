// backend/server.js

const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')

dotenv.config()
const app = express()

connectDB()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/admin', require('./routes/admin'))

app.get('/', (req, res) => {
  res.send('Spotify Store API is running')
})

app.use((req, res) => {
  res.status(404).json({ msg: 'مسیر پیدا نشد' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`))
