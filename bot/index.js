const { Telegraf, Markup } = require('telegraf');
require('dotenv').config({ path: __dirname + '/../.env' });

const { TELEGRAM_BOT_TOKEN, GLM_API_KEY, GLM_MODEL } = process.env;

console.log('🔍 TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? '✓ Bulundu' : '✗ Eksik');
console.log('🔍 GLM_API_KEY:', GLM_API_KEY ? '✓ Bulundu' : '✗ Eksik');

if (!TELEGRAM_BOT_TOKEN || !GLM_API_KEY) {
  console.error('❌ Telegram bot token veya GLM API key eksik!');
  process.exit(1);
}

const glmService = require('../services/glm');
const { tools, executeTool } = require('../services/tools');
const axios = require('axios');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

console.log('🤖 Bot başlatılıyor...');
console.log('🔑 Token:', TELEGRAM_BOT_TOKEN ? 'Aktif' : 'Eksik');
console.log('🧠 GLM API:', GLM_API_KEY ? 'Aktif' : 'Eksik');

// User session storage
const userSessions = new Map();

// System message for Nsyaver
const SYSTEM_MESSAGE = {
  role: 'system',
  content: 'Sen Nsyaver, kullanıcının kişisel AI orkestra şefisin. MCP araçlarını yönetir, karmaşık görevleri çözer ve profesyonel asistanlık yaparsın. Türkçe konuşursun ve arkadaş canlısı bir tavırla yardımcı olursun.'
};

/**
 * Get or create user session
 */
function getUserSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      messages: [SYSTEM_MESSAGE],
      model: GLM_MODEL || 'glm-4-flash'
    });
  }
  return userSessions.get(userId);
}

/**
 * /start command - Rich welcome message
 */
bot.start((ctx) => {
  const userId = ctx.from.id;
  const session = getUserSession(userId);
  
  const welcomeMessage = `🎭 *Merhaba, ben orkestra şefiniz Nsyaver!*

Kişisel AI asistanınız olarak size yardımcı olmak için buradayım.

*🎯 Yeteneklerim:*
• 💬 Akıllı sohbet ve bilgi sağlama
• 🔍 Web araması (simülasyon)
• 🧮 Hesaplama ve analiz
• 🖼️ Görüntü analizi (fotoğraf gönderin)
• 📄 Dosya içerik analizi
• ⚙️ Sistem durumu kontrolü

*📋 Komutlar:*
/start - Bu hoş geldin mesajı
/help - Yardım menüsü
/model - Model seçimi
/clear - Hafızayı temizle
/about - Nsyaver vizyonu

Hadi başlayalım! 🚀`;

  ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
});

/**
 * /help command
 */
bot.help((ctx) => {
  const helpMessage = `📖 *Nsyaver Yardım Menüsü*

*Komutlar:*
/start - Botu başlat ve hoş geldin mesajını gör
/help - Bu yardım menüsünü göster
/model - AI modelini değiştir
/clear - Sohbet geçmişini temizle
/about - Nsyaver hakkında bilgi

*Kullanım:*
• Sorularınızı doğrudan yazın
• Fotoğraf göndererek analiz edin
• PDF/TXT dosyası göndererek içeriğini inceleyin
• Hesaplama için "hesapla: 2+2" yazın

*Desteklenen Modeller:*
• glm-4-flash - Hızlı yanıtlar
• glm-4-plus - Gelişmiş yetenekler
• glm-4 - Standart model
• glm-4-air - Hafif ve hızlı
• glm-4v - Görüntü analizi

İyi sohbetler! 💫`;

  ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

/**
 * /model command - Model selection with inline keyboard
 */
bot.command('model', (ctx) => {
  const models = [
    [
      Markup.button.callback('⚡ GLM-4 Flash (Hızlı)', 'model_glm-4-flash'),
      Markup.button.callback('✨ GLM-4 Plus (Güçlü)', 'model_glm-4-plus')
    ],
    [
      Markup.button.callback('📊 GLM-4 (Standart)', 'model_glm-4'),
      Markup.button.callback('🪶 GLM-4 Air (Hafif)', 'model_glm-4-air')
    ],
    [
      Markup.button.callback('👁️ GLM-4 Vision (Görüntü)', 'model_glm-4v')
    ]
  ];

  ctx.reply(
    '🎛️ *Model Seçimi*\n\nKullanmak istediğiniz AI modelini seçin:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(models)
    }
  );
});

/**
 * Handle model selection callbacks
 */
bot.action(/^model_(.+)$/, (ctx) => {
  const model = ctx.match[1];
  const userId = ctx.from.id;
  const session = getUserSession(userId);
  
  session.model = model;
  
  const modelInfo = glmService.AVAILABLE_MODELS[model];
  ctx.answerCbQuery(`✅ Model değiştirildi: ${modelInfo.name}`);
  ctx.reply(
    `✅ *Model güncellendi!*\n\n` +
    `📌 Seçilen: ${modelInfo.name}\n` +
    `📝 ${modelInfo.description}`,
    { parse_mode: 'Markdown' }
  );
});

/**
 * /clear command - Clear chat history
 */
bot.command('clear', (ctx) => {
  const userId = ctx.from.id;
  userSessions.delete(userId);
  ctx.reply('🗑️ *Sohbet geçmişi temizlendi!*\n\nYeni bir başlangıç yapıyoruz. 🚀', { parse_mode: 'Markdown' });
});

/**
 * /about command - Nsyaver vision
 */
bot.command('about', (ctx) => {
  const aboutMessage = `ℹ️ *Nsyaver - Kişisel AI Orkestra Şefi*

🎭 *Vizyon:*
Nsyaver, karmaşık görevleri orkestra şefi gibi yöneten, MCP (Model Context Protocol) araçlarını ustalıkla kullanan kişisel AI asistanınızdır.

🎯 *Misyon:*
Kullanıcılarına profesyonel, akıllı ve verimli asistanlık sağlamak. Her görevi bir senfoniye dönüştürmek.

⚙️ *Teknoloji:*
• GLM z.ai (bigmodel.cn) yapay zekası
• MCP araç entegrasyonu
• Telegram Bot API
• OpenAI SDK uyumluluğu

🌟 *Yetenekler:*
• Çoklu model desteği
• Tool calling (araç çağırma)
• Görüntü analizi
• Dosya işleme
• Akıllı hafıza yönetimi
• Stream yanıtlar

📅 *Versiyon:* 1.0.0
🔧 *Platform:* Telegram
💻 *Geliştirici:* Nsyaver Team

"Düşüncelerinizi senfoniyle harmanlıyoruz!" 🎶`;

  ctx.reply(aboutMessage, { parse_mode: 'Markdown' });
});

/**
 * Handle photo messages - GLM Vision analysis
 */
bot.on('photo', async (ctx) => {
  try {
    ctx.reply('🔍 Fotoğrafınız analiz ediliyor...');
    
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    
    const caption = ctx.message.caption || 'Bu görüntüyü detaylı şekilde analiz et ve açıkla.';
    
    const analysis = await glmService.vision(
      fileLink.href,
      caption,
      'glm-4v'
    );
    
    ctx.reply(
      `🖼️ *Görüntü Analizi:*\n\n${analysis}`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Photo analysis error:', error);
    ctx.reply('❌ Fotoğraf analiz edilemedi: ' + error.message);
  }
});

/**
 * Handle document messages - File content analysis
 */
bot.on('document', async (ctx) => {
  try {
    const doc = ctx.message.document;
    const fileName = doc.file_name;
    
    // Only handle PDF and TXT files
    if (!fileName.match(/\.(pdf|txt)$/i)) {
      return ctx.reply('⚠️ Sadece PDF ve TXT dosyaları desteklenmektedir.');
    }
    
    ctx.reply('📄 Dosyanız işleniyor...');
    
    const fileLink = await ctx.telegram.getFileLink(doc.file_id);
    
    // Download file content
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const content = Buffer.from(response.data).toString('utf-8');
    
    const userId = ctx.from.id;
    const session = getUserSession(userId);
    
    // Analyze the file content
    const analysisPrompt = `Kullanıcı "${fileName}" adlı bir dosya gönderdi. İşte içeriği:\n\n${content.substring(0, 2000)}...\n\nBu dosyayı özetle ve içeriği hakkında bilgi ver.`;
    
    session.messages.push({
      role: 'user',
      content: analysisPrompt
    });
    
    const result = await glmService.chat(session.messages, session.model);
    
    session.messages.push(result);
    
    ctx.reply(
      `📄 *Dosya Analizi: ${fileName}*\n\n${result.content}`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    console.error('Document analysis error:', error);
    ctx.reply('❌ Dosya işlenemedi: ' + error.message);
  }
});

/**
 * Handle text messages - Main chat logic with tool calling
 */
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;
  
  // Skip if it's a command
  if (userMessage.startsWith('/')) return;
  
  const session = getUserSession(userId);
  
  session.messages.push({
    role: 'user',
    content: userMessage
  });
  
  try {
    // Try with tools first
    const response = await glmService.chat(
      session.messages, 
      session.model,
      { tools }
    );
    
    // Check if model wants to call a tool
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      
      // Execute the tool
      const toolResult = await executeTool(toolName, toolArgs);
      
      // Add tool response to messages
      session.messages.push(response);
      session.messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult)
      });
      
      // Get final response
      const finalResponse = await glmService.chat(session.messages, session.model);
      session.messages.push(finalResponse);
      
      ctx.reply(finalResponse.content, { parse_mode: 'Markdown' });
    } else {
      // No tool call, just regular response
      session.messages.push(response);
      ctx.reply(response.content, { parse_mode: 'Markdown' });
    }
    
    // Keep message history manageable
    if (session.messages.length > 22) {
      // Keep system message and last 20 messages
      session.messages = [
        session.messages[0],
        ...session.messages.slice(-20)
      ];
    }
  } catch (error) {
    console.error('Chat error:', error);
    ctx.reply('❌ Bir hata oluştu: ' + error.message);
  }
});

/**
 * Launch bot
 */
bot.launch({
  polling: true
}).then(() => {
  console.log('✅ Telegram bot polling modunda çalışıyor!');
  console.log('🤖 Bot ID:', TELEGRAM_BOT_TOKEN.split(':')[0]);
  console.log('🎭 Nsyaver - Orkestra Şefi hazır!');
}).catch((error) => {
  console.error('❌ Bot başlatılamadı:', error);
  process.exit(1);
});

process.on('SIGINT', () => bot.stop('SIGINT'));
process.on('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;