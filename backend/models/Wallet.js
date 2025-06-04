// backend/models/Wallet.js

import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["increase", "decrease", "purchase"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [WalletTransactionSchema],
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
