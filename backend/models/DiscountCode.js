// ✅ مرحله ۱: ویرایش مدل DiscountCode
// backend/models/DiscountCode.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uses: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    generatedBySystem: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["personal", "reward70", "freeAccount", "custom"],
      required: true,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    allowedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema);
export default DiscountCode;
