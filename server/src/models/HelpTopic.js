const mongoose = require('mongoose');

const HelpTopicSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 'Getting Started' | 'Donors' | 'Collectors' | 'Account & Privacy' | 'Troubleshooting'
  question: { type: String, required: true },
  answer: { type: String, required: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HelpTopic', HelpTopicSchema);
