require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const sendRoutes = require('./routes/send.routes');
const { getActiveCount } = require('./simulator/callbackScheduler');
const connectDB = require('./utils/db');

// Register Mongoose models
require('./models/Campaign');
require('./models/Customer');
require('./models/CommunicationLog');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Import html renderer
const { getDashboardHtml } = require('./utils/dashboardHtml');

// --- Middleware stack ---
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

// Serve the dashboard HTML UI
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(getDashboardHtml());
});

// --- Routes ---
app.use('/api/channel', sendRoutes);

// Catch-all for unknown routes — better than a silent 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found on channel-service' });
});

// Global error handler (keeps the process alive on unhandled route errors)
app.use((err, _req, res, _next) => {
  console.error('[channel-service] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start listening ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Channel service running on http://localhost:${PORT}`);
  console.log(`   Health check → GET /api/channel/health`);
  console.log(`   Send message → POST /api/channel/send\n`);
});

// Periodic log of active simulations — handy when debugging delivery pipelines.
// Every 30 seconds is enough to notice stuck simulations without flooding the console.
const MONITOR_INTERVAL_MS = 30_000;
setInterval(() => {
  const count = getActiveCount();
  if (count > 0) {
    console.log(`[monitor] Active simulations: ${count}`);
  }
}, MONITOR_INTERVAL_MS);
