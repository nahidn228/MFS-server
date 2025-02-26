const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, pin, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword, pin: hashedPin, role });
    await newUser.save();
    res.status(201).json({ message: "User Registered" });
  } catch (error) {
    res.status(500).json({ message: "Registration Failed", error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error });
  }
});

module.exports = router;
