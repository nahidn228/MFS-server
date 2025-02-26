const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["send", "cash-in", "cash-out"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
