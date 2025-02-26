const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, phone, email, nid, pin, role } = req.body;
    const hashedPin = await bcrypt.hash(pin, 10); // Hash the PIN
    let user;

    if (role === "agent") {
      user = new Agent({ name, phone, email, nid, pin: hashedPin, role });
    } else {
      user = new User({ name, phone, email, nid, pin: hashedPin, role });
    }

    await user.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    let user =
      (await User.findOne({ phone })) || (await Agent.findOne({ phone }));

    if (!user || !(await bcrypt.compare(pin, user.pin))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
