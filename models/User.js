const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    pin: String,
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
