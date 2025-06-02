// backend/models/DiscountCode.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uses: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    generatedBySystem: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['personal', 'reward70', 'freeAccount'],
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('DiscountCode', DiscountCodeSchema)
