const Ad = require('../models/ad');
const { roleMiddleware } = require('../middleware/auth');

const createAd = async (req, res) => {
  const { content, media, ctaText, ctaLink } = req.body;
  try {
    const ad = new Ad({ content, media, ctaText, ctaLink });
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createAd, getAds };
