const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('[channel-service] Error: MONGODB_URI not found in env variables.');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log('[channel-service] MongoDB successfully connected.');
  } catch (err) {
    console.error('[channel-service] MongoDB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
