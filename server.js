require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const telegramRouter = require('./routes/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Telegram webhook route
app.use('/telegram', telegramRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    service: 'Nsyaver - AI Orchestra Chief'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Nsyaver Telegram Bot',
    version: '1.0.0',
    description: 'Kişisel AI Orkestra Şefi',
    endpoints: {
      health: '/health',
      telegram: '/telegram/webhook'
    }
  });
});

// Telegram bot polling (Development mode)
if (process.env.BOT_POLLING === 'true') {
  const bot = require('./bot/index');
  console.log('📊 Telegram bot polling modunda çalışıyor');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🎭 Nsyaver - AI Orchestra Chief`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/telegram/webhook`);
});
