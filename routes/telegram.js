const express = require('express');
const { Telegraf } = require('telegraf');
const router = express.Router();
const bot = require('../bot/index');
const { BotToken } = process.env;
const { Markup } = require('telegraf');

if (!BotToken) {
  console.warn('⚠️ Telegram bot token eksik!');
}

const TELEGRAM_WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL;

router.get('/telegram', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || token !== BotToken) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { hook } = req.query;

    if (hook === 'set') {
      await bot.telegram.setWebhook(TELEGRAM_WEBHOOK_URL);
      return res.json({ success: true, message: 'Webhook set successfully' });
    }

    if (hook === 'remove') {
      await bot.telegram.deleteWebhook();
      return res.json({ success: true, message: 'Webhook removed successfully' });
    }

    bot.handleUpdate(req.body);
    return res.json({ success: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/telegram/health', (req, res) => {
  res.json({
    status: 'ok',
    bot: BotToken ? 'connected' : 'disconnected',
    webhook: TELEGRAM_WEBHOOK_URL ? 'configured' : 'not configured'
  });
});

router.post('/telegram', async (req, res) => {
  try {
    if (!BotToken) {
      return res.status(500).json({ error: 'Bot token not configured' });
    }

    const { token } = req.headers;

    if (!token || token !== BotToken) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    bot.handleUpdate(req.body);
    return res.json({ success: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/telegram/webhook', async (req, res) => {
  try {
    if (!BotToken) {
      return res.status(500).json({ error: 'Bot token not configured' });
    }

    const { token } = req.headers;

    if (!token || token !== BotToken) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    bot.handleUpdate(req.body);
    return res.json({ success: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/telegram/hooks', async (req, res) => {
  try {
    const info = await bot.telegram.getWebhookInfo();

    res.json({
      url: info.url,
      has_custom_certificate: info.has_custom_certificate,
      pending_update_count: info.pending_update_count,
      last_error_date: info.last_error_date,
      last_error_message: info.last_error_message
    });
  } catch (error) {
    console.error('Get Webhook Info Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;