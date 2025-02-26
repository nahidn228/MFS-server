const Transaction = require("../models/Transaction");

exports.sendMoney = async (req, res) => {
  try {
    const { phone, amount, pin } = req.body;
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ phone });

    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });
    if (amount < 50)
      return res.status(400).json({ message: "Minimum transfer is 50 Taka" });
    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, sender.pin);
    if (!isPinValid) return res.status(401).json({ message: "Invalid PIN" });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.json({ message: "Transaction successful" });
  } catch (error) {
    res.status(500).json({ error: "Transaction failed" });
  }
};
