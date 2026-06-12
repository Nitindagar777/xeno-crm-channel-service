const router = require('express').Router();
const sendController = require('../controllers/send.controller');
const { getMessages } = require('../simulator/messagesStore');

// Accept a message delivery request from the CRM backend
router.post('/send', sendController.handleSend);

const CommunicationLog = require('../models/CommunicationLog');
const mongoose = require('mongoose');

// Retrieve list of all simulated messages
router.get('/messages', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let dbQuery = {};
    if (userId && userId !== 'null' && userId !== 'undefined') {
      try {
        dbQuery.userId = new mongoose.Types.ObjectId(userId);
      } catch (err) {
        // If not a valid ObjectId, filter by string or ignore
      }
    }

    const logs = await CommunicationLog.find(dbQuery)
      .populate('campaignId', 'name')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(500);

    const data = logs.map(log => {
      let recipient = 'N/A';
      if (log.customerId) {
        recipient = log.channel === 'email' ? log.customerId.email : log.customerId.phone;
      }
      return {
        vendorMessageId: log.vendorMessageId || 'N/A',
        campaignId: log.campaignId ? log.campaignId._id.toString() : 'N/A',
        campaignName: log.campaignId ? log.campaignId.name : 'Unknown Campaign',
        customerId: log.customerId ? log.customerId._id.toString() : 'N/A',
        userId: log.userId ? log.userId.toString() : 'N/A',
        message: log.personalizedMessage || '',
        channel: log.channel || 'sms',
        recipient: recipient || 'N/A',
        status: log.status || 'queued',
        timestamp: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
        lastUpdated: log.updatedAt ? log.updatedAt.toISOString() : new Date().toISOString()
      };
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[channel-service] Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch simulated messages'
    });
  }
});

// Simple liveness check — useful for docker health checks and uptime monitors
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'xenocrm-channel-service',
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
