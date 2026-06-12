const { v4: uuidv4 } = require('uuid');
const { simulateOutcome } = require('../simulator/outcomeSimulator');

/**
 * Accepts a send request from the CRM backend, acknowledges immediately,
 * and kicks off the async delivery simulation in the background.
 */
exports.handleSend = (req, res) => {
  const {
    campaignId,
    campaignName,
    customerId,
    message,
    channel,
    recipientPhone,
    recipientEmail,
    callbackUrl,
  } = req.body;

  // --- Basic validation ---
  // We need at least these fields to do anything useful.
  const missing = [];
  if (!campaignId) missing.push('campaignId');
  if (!customerId) missing.push('customerId');
  if (!message) missing.push('message');
  if (!channel) missing.push('channel');
  if (!callbackUrl) missing.push('callbackUrl');

  // Channel-specific: you need *some* way to reach the person
  if (channel === 'sms' && !recipientPhone) missing.push('recipientPhone');
  if (channel === 'email' && !recipientEmail) missing.push('recipientEmail');

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missing.join(', ')}`,
    });
  }

  // Mint a vendor-side message ID so the CRM can correlate callbacks later
  const vendorMessageId = `ch_${uuidv4()}`;

  console.log(
    `[send] Queued ${channel} message ${vendorMessageId} for campaign=${campaignId}, customer=${customerId}`
  );

  // Store in in-memory list
  const { addMessage } = require('../simulator/messagesStore');
  addMessage({
    vendorMessageId,
    campaignId,
    campaignName: campaignName || campaignId,
    customerId,
    userId: req.body.userId || 'N/A',
    message,
    channel,
    recipient: channel === 'email' ? recipientEmail : (recipientPhone || 'N/A'),
    status: 'queued',
    timestamp: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  // Acknowledge right away — the CRM shouldn't have to wait for delivery
  res.status(202).json({
    success: true,
    vendorMessageId,
    status: 'queued',
  });

  // Fire-and-forget: the simulator handles the rest asynchronously
  simulateOutcome({
    vendorMessageId,
    campaignId,
    customerId,
    message,
    channel,
    callbackUrl,
  });
};
