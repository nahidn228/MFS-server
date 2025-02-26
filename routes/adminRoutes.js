const express = require('express');
const authMiddleware = require('../config/authMiddleware');
const roleMiddleware = require('../config/roles');
const User = require('../models/User');
const Agent = require('../models/Agent');

const router = express.Router();

// Get All Users
router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get All Agents
router.get('/agents', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve agents' });
  }
});

// Delete User
router.delete('/user/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
