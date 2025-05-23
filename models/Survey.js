const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  area: { type: String, required: true },
  question: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  guidelines: { type: String, required: true },
  permittedDomains: [String],
  permittedResponses: [String],
  summaryInstructions: { type: String },
  isClosed: { type: Boolean, default: false },
  summary: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Survey', surveySchema);
