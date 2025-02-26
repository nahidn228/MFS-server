const Agent = require('../models/Agent');
const User = require('../models/User');

exports.cashIn = async (req, res) => {
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
};
