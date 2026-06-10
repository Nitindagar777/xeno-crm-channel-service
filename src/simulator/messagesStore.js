const messages = [];

function addMessage(msg) {
  messages.unshift(msg); // Add new messages at the beginning
  if (messages.length > 500) {
    messages.pop(); // Keep last 500 messages
  }
}

function updateMessageStatus(vendorMessageId, status) {
  const msg = messages.find(m => m.vendorMessageId === vendorMessageId);
  if (msg) {
    msg.status = status;
    msg.lastUpdated = new Date().toISOString();
  }
}

function getMessages() {
  return messages;
}

module.exports = { addMessage, updateMessageStatus, getMessages };
