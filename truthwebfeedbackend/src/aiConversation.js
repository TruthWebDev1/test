const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('AIConversation', aiConversationSchema);
