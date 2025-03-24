const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PI_API_KEY = 'YOUR_API_KEY'; // From Pi Developer Portal
const PI_API_URL = 'https://api.minepi.com/v2';

// Approve payment
app.post('/approve-payment/:paymentId', async (req, res) => {
  try {
    await axios.post(`${PI_API_URL}/payments/${req.params.paymentId}/approve`, {}, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    res.status(200).send('Approved');
  } catch (error) {
    console.error('Approval error:', error.response?.data || error.message);
    res.status(500).send('Approval failed');
  }
});

// Complete payment
app.post('/complete-payment/:paymentId', async (req, res) => {
  const { txid } = req.body;
  try {
    await axios.post(`${PI_API_URL}/payments/${req.params.paymentId}/complete`, { txid }, {
      headers: { 'Authorization': `Key ${PI_API_KEY}` }
    });
    res.status(200).send('Completed');
  } catch (error) {
    console.error('Completion error:', error.response?.data || error.message);
    res.status(500).send('Completion failed');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
