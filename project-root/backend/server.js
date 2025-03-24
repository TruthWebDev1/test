const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());

// Configuration
const PI_API_URL = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY; // Set in .env
const PORT = process.env.PORT || 3000;

// Middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adjust in production
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect Wallet Endpoint
app.post('/api/pi/connect', async (req, res) => {
  const { address, passphrase } = req.body;

  if (!address || !passphrase) {
    return res.status(400).json({ success: false, message: 'Missing address or passphrase' });
  }

  try {
    // Simulated API call to Pi Network (replace with real call)
    const response = await fetch(`${PI_API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to validate wallet');

    const data = await response.json();
    // Simulated balance (replace with real data)
    res.json({ success: true, balance: 150 });
  } catch (error) {
    console.error('Error in /connect:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send Pi Endpoint
app.post('/api/pi/send', async (req, res) => {
  const { recipient, amount, walletAddress } = req.body;

  if (!recipient || !amount || !walletAddress) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Simulated API call to Pi Network (replace with real call)
    const response = await fetch(`${PI_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient,
        amount,
        from: walletAddress
      })
    });

    if (!response.ok) throw new Error('Failed to send Pi');

    const data = await response.json();
    // Simulated new balance (replace with real data)
    res.json({ success: true, newBalance: 150 - amount });
  } catch (error) {
    console.error('Error in /send:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch Wallet Activity Endpoint
app.get('/api/pi/activity', async (req, res) => {
  try {
    // Simulated API call to Pi Network (replace with real call)
    const response = await fetch(`${PI_API_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch transactions');

    const data = await response.json();
    // Simulated transactions (replace with real data)
    const transactions = [
      { type: 'Sent', to: 'recipient123', amount: '-10', timestamp: new Date().toISOString() },
      { type: 'Received', to: 'sender456', amount: '50', timestamp: new Date().toISOString() }
    ];
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error in /activity:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
