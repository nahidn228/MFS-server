const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  nid: { type: String, unique: true },
  pin: String,
  balance: { type: Number, default: 100000 }, // Agents start with 100k balance
  role: { type: String, default: 'agent' },
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);
