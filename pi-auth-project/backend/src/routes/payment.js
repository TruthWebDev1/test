const express = require('express');
const router = express.Router();

router.post('/complete', async (req, res) => {
  const { paymentId, txid, debug } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing payment data' });
  }

  try {
    console.log(`Completing payment: ${paymentId}, txid: ${txid}, debug: ${debug}`);
    const paymentStatus = debug === 'cancel' ? 'cancelled' : 'completed';

    // In production, verify with Pi Network API
    res.status(200).json({ status: paymentStatus });
  } catch (error) {
    console.error('Payment completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
