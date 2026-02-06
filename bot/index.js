const { Telegraf } = require('telegraf');
require('dotenv').config({ path: __dirname + '/.env' });

const { TELEGRAM_BOT_TOKEN, GLM_API_KEY, GLM_API_BASE } = process.env;

console.log('🔍 TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? '✓ Bulundu' : '✗ Eksik');
console.log('🔍 GLM_API_KEY:', GLM_API_KEY ? '✓ Bulundu' : '✗ Eksik');

if (!TELEGRAM_BOT_TOKEN || !GLM_API_KEY) {
  console.error('❌ Telegram bot token veya GLM API key eksik!');
  process.exit(1);
}

const openaiService = require('../services/openai');
const openai = openaiService.client;
const path = require('path');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

console.log('🤖 Bot başlatılıyor...');
console.log('🔑 Token:', TELEGRAM_BOT_TOKEN ? 'Aktif' : 'Eksik');
console.log('🧠 GLM API:', GLM_API_KEY ? 'Aktif' : 'Eksik');

const chatHistory = new Map();

bot.start((ctx) => {
  const userId = ctx.from.id;

  chatHistory.set(userId, {
    messages: [
      {
        role: 'system',
        content: 'Sen Nsyaver adlı yapay zeka asistanısın. Profesyonel, ilgili ve arkadaş canlısı bir şekilde sohbet et.'
      }
    ]
  });

  ctx.reply(
    '🤖 **Nsyaver\'a Hoş Geldiniz!**\\n\\n' +
    'Ben GLM yapay zekasını kullanan asistanım. Sizce nasıl yardımcı olabilirim?',
    { parse_mode: 'Markdown' }
  );
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  if (!chatHistory.has(userId)) {
    chatHistory.set(userId, {
      messages: [
        {
          role: 'system',
          content: 'Sen Nsyaver adlı yapay zeka asistanısın. Profesyonel, ilgili ve arkadaş canlısı bir şekilde sohbet et.'
        }
      ]
    });
  }

  const history = chatHistory.get(userId);

  history.messages.push({
    role: 'user',
    content: userMessage
  });

  ctx.reply('🧠 **Yazıyorum...**');

  try {
    const response = await openai.chat.completions.create({
      model: 'glm-4-flash',
      messages: history.messages,
      stream: true
    });

    let aiResponse = '';
    let hasContent = false;

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        aiResponse += content;
        hasContent = true;
      }
    }

    if (!hasContent) {
      aiResponse = 'Üzgünüm, şu an bir cevap üretilemedi. Lütfen tekrar deneyin.';
    }

    history.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    ctx.reply(
      `🤖 **Cevabım:**\n\n${aiResponse}`,
      { parse_mode: 'Markdown' }
    );

    if (history.messages.length > 20) {
      history.messages.shift();
      history.messages.shift();
      history.messages.shift();
    }
  } catch (error) {
    console.error('API Error:', error);
    ctx.reply('❌ Hata oluştu: ' + error.message);
  }
});

bot.help((ctx) => {
  ctx.reply(
    '📖 **Yardım Menüsü**\n\n' +
    '/start - Botu başlat\n' +
    '/help - Bu yardım\n' +
    '/clear - Sohbet geçmişini temizle\n' +
    '/about - Ben hakkında bilgi\n\n' +
    'Sadece yazın, sohbet edelim!',
    { parse_mode: 'Markdown' }
  );
});

bot.command('clear', (ctx) => {
  const userId = ctx.from.id;
  chatHistory.delete(userId);
  ctx.reply('🗑️ Sohbet geçmişi temizlendi. Yeni başlayalım! 🚀');
});

bot.command('about', async (ctx) => {
  const aboutText = `ℹ️ **Nsyaver Hakkında**

🤖 **Yapay Zeka:** GLM-4
👤 **Ad:** Nsyaver
🌐 **Platform:** Telegram

**Özellikler:**
- 🗣️ Canlı sohbet
- 💡 İçerik üretimi
- 🎯 Soru-cevap
- 🌐 Web bilgisi

Sorularınızı bekliyorum!`;

  ctx.reply(aboutText, { parse_mode: 'Markdown' });
});

bot.launch({
  polling: true
}).then(() => {
  console.log('✅ Telegram bot polling modunda çalışıyor!');
  console.log('🤖 Bot ID:', process.env.TELEGRAM_BOT_TOKEN.split(':')[0]);
}).catch((error) => {
  console.error('❌ Bot başlatılamadı:', error);
  process.exit(1);
});

process.on('SIGINT', () => bot.stop('SIGINT'));
process.on('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;