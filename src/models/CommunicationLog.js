const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  personalizedMessage: {
    type: String
  },
  channel: {
    type: String,
    required: true
  },
  vendorMessageId: {
    type: String
  },
  status: {
    type: String,
    default: 'queued'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    meta: {
      type: mongoose.Schema.Types.Mixed
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', CommunicationLogSchema);
