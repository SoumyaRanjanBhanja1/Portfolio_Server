const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model('User', userSchema);
