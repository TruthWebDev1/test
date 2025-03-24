const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { createAd, getAds } = require('../controllers/adController');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['vendor', 'admin']), createAd);
router.get('/', authMiddleware, getAds);

module.exports = router;
