import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  message: { type: String, required: true },
  from: { type: String, enum: ["user", "admin"], required: true },
  admin: { type: Schema.Types.ObjectId, ref: "User", default: null },
  attachmentUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const SupportTicketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
    attachment: {
      type: String,
      default: null,
    },
    repliedAt: {
      type: Date,
    },
    replies: [ReplySchema],
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", SupportTicketSchema);