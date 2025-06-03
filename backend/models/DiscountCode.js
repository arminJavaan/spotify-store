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
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema);
export default DiscountCode;
