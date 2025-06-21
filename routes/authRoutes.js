const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

  let user = await User.findOne({ email });
  if (!user) user = new User({ email });

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
  res.json({ message: "OTP sent successfully" });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Clear OTP after verification
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ token });
});

module.exports = router;
