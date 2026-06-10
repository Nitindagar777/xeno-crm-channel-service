const router = require('express').Router();
const sendController = require('../controllers/send.controller');
const { getMessages } = require('../simulator/messagesStore');

// Accept a message delivery request from the CRM backend
router.post('/send', sendController.handleSend);

// Retrieve list of all simulated messages
router.get('/messages', (_req, res) => {
  res.json({
    success: true,
    data: getMessages()
  });
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
