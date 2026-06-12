const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
