const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await Contact.create({ name, email, message });
    res.json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
