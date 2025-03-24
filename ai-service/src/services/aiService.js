const axios = require('axios');

const chatWithAI = async (userId, content) => {
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/ai/chat`, {
      userId,
      content
    });
    return response.data.response;
  } catch (err) {
    throw new Error('Error communicating with AI service: ' + err.message);
  }
};

module.exports = { chatWithAI };
