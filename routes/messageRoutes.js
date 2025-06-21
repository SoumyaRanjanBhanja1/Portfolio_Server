const verifyToken = require('../middleware/verifyToken');
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


router.get('/admin/messages', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
