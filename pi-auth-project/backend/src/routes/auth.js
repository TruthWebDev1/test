const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/pi', async (req, res) => {
  const { accessToken, user } = req.body;

  if (!accessToken || !user || !user.uid || !user.username) {
    return res.status(400).json({ error: 'Missing authentication data' });
  }

  try {
    // Simulate user storage (replace with database in production)
    const users = {}; // In-memory storage for demo
    users[user.uid] = {
      username: user.username,
      accessToken,
      authenticatedAt: new Date().toISOString(),
    };

    // In production, validate accessToken with Pi Network API
    /*
    const piApiResponse = await axios.post(
      'https://api.minepi.com/v2/auth/validate',
      { accessToken },
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}` } }
    );
    if (!piApiResponse.data.valid) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    */

    res.status(200).json({
      message: 'Authentication successful',
      user: { uid: user.uid, username: user.username },
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
