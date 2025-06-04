// backend/models/WalletTopupRequest.js

import mongoose from "mongoose";

const WalletTopupRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, enum: ["card-to-card", "shaparak"], required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const WalletTopupRequest = mongoose.model(
  "WalletTopupRequest",
  WalletTopupRequestSchema
);
export default WalletTopupRequest;
