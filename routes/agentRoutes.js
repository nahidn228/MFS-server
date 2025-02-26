const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const roleMiddleware = require('../config/roles');
const User = require('../models/User');
const Agent = require('../models/Agent');

const router = express.Router();

// Agent Cash-In (Deposit to User)
router.post('/cash-in', authMiddleware, roleMiddleware('agent'), async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const agent = await Agent.findById(req.user.id);
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (agent.balance < amount) return res.status(400).json({ message: 'Agent has insufficient balance' });

    agent.balance -= amount;
    user.balance += amount;

    await agent.save();
    await user.save();

    res.json({ message: 'Cash-in successful' });
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Agent Balance Check
router.get('/balance', authMiddleware, roleMiddleware('agent'), async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id);
    res.json({ balance: agent.balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});

module.exports = router;
