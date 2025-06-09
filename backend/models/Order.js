import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountCode: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    cashbackAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["whatsapp", "shaparak", "crypto", "card-to-card", "wallet", "other"],
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
    },
    whatsappOrderUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    accountInfo: {
      email: { type: String },
      password: { type: String },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
