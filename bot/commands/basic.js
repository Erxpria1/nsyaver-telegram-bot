const { Composer } = require('telegraf');
const { BotToken } = process.env;

const composer = new Composer();

composer.start((ctx) => {
  ctx.reply('🤖 Bot başlatıldı! Konuşmaya başlayabilirsiniz.');
});

composer.help((ctx) => {
  const helpText = `📖 **Yardım Menüsü**

/start - Botu başlat
/help - Bu yardım mesajı
/templates - Şablonlar
/status - Bot durumu
/about - Bot bilgisi`;

  ctx.reply(helpText, { parse_mode: 'Markdown' });
});

composer.command('templates', async (ctx) => {
  const templates = [
    'professional - Profesyonel şablon',
    'carousel - Slayt şablonu',
    'minimal - Minimal şablon',
    'business - İş şablonu'
  ];

  ctx.reply(
    `📋 **Şablonlar:**\n\n${templates.join('\n')}`,
    { parse_mode: 'Markdown' }
  );
});

composer.command('status', (ctx) => {
  const userId = ctx.from.id;
  ctx.reply(`📊 **Bot Durumu**\n\nKullanıcı ID: ${userId}\nBot çalışıyor...`);
});

composer.command('about', (ctx) => {
  const aboutText = `ℹ️ **Bot Hakkında**

🤖 GLM AI ile entegre Telegram botu
📱 Performanslı içerik oluşturma
⚡ Gerçek zamanlı yanıtlar`;

  ctx.reply(aboutText, { parse_mode: 'Markdown' });
});

module.exports = composer;