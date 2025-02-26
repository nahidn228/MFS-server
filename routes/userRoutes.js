const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Send Money
router.post('/send-money', authMiddleware, async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ phone });

    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
    if (amount < 50) return res.status(400).json({ message: 'Minimum transfer is 50 Taka' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    let fee = 0;
    if (amount > 100) fee = 5;

    sender.balance -= amount + fee;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    res.json({ message: 'Transaction successful' });
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

module.exports = router;
