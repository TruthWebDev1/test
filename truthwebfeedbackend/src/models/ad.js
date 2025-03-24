const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  content: { type: String, required: true },
  media: { type: String }, // URL to ad media (stored in S3)
  ctaText: { type: String, required: true },
  ctaLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', adSchema);
