const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['calculator', 'reverse'],
    required: true
  },
  name: { type: String, default: '' },          // only present for 'calculator' type
  matricObtained: Number,
  matricTotal: Number,
  fscObtained: Number,
  fscTotal: Number,
  entryTest: Number,          // only present for 'calculator' type
  targetAggregate: Number,    // only present for 'reverse' type
  requiredEntryTest: Number,  // only present for 'reverse' type (calculated result)
  aggregate: Number,          // only present for 'calculator' type (calculated result)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
