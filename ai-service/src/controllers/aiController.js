const { chatWithAI } = require('../services/aiService');

const chat = async (req, res) => {
  const { content } = req.body;
  try {
    const response = await chatWithAI(req.user._id, content);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { chat };
