const Agent = require('../models/Agent');
const User = require('../models/User');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve agents' });
  }
};

exports.blockUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.isBlocked = true;
      await user.save();
  
      res.json({ message: 'User blocked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to block user' });
    }
  };
  