const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const router = express.Router();

// Send Money
router.post("/send-money", authMiddleware, async (req, res) => {
  try {
    const { receiverId, amount } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "Receiver Not Found" });
    if (sender.balance < amount) return res.status(400).json({ message: "Insufficient Balance" });

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    const transaction = new Transaction({ senderId: sender._id, receiverId, amount, type: "send" });
    await transaction.save();

    res.json({ message: "Transaction Successful", transaction });
  } catch (error) {
    res.status(500).json({ message: "Transaction Failed", error });
  }
});

module.exports = router;
