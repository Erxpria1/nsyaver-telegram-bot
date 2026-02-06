const { Composer, Markup } = require('telegraf');
const OpenAI = require('openai');
require('dotenv').config();

const composer = new Composer();
const { BotToken, GLM_API_KEY, GLM_API_BASE } = process.env;

if (!BotToken || !GLM_API_KEY) {
  console.warn('⚠️ Telegram bot token veya GLM API key eksik!');
}

const openai = new OpenAI({
  apiKey: GLM_API_KEY,
  baseURL: GLM_API_BASE || 'https://open.bigmodel.cn/api/paas/v4'
});

const userState = new Map();

composer.start((ctx) => {
  const userId = ctx.from.id;

  userState.set(userId, {
    step: 'start',
    data: {}
  });

  ctx.reply(
    '🤖 Konya MDR Bot\'a Hoş Geldiniz!',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('📊 Create Post', 'create_post'),
        Markup.button.callback('📋 Templates', 'templates_list')
      ],
      [
        Markup.button.callback('❓ Help', 'help_menu')
      ],
      [
        Markup.button.callback('ℹ️ About', 'about_bot')
      ]
    ])
  );
});

composer.command('start', (ctx) => {
  ctx.startNavigation();
});

composer.command('help', (ctx) => {
  const helpText = `📖 **Bot Yardım Menüsü**

🌟 **Temel Komutlar:**
/start - Botu başlat
/help - Yardım bilgisi
/templates - Şablonlar
/status - Post durumun

💬 **Özellikler:**
- GLM AI ile içerik oluşturma
- Instagram/WhatsApp post tasarımları
- Şablon tabanlı içerik üretimi
- Görsel işlemleme

📝 **AI Önerisi:** Oluşturmak için basit bir komut yazın, GLM ile hazırlasın!`;

  ctx.reply(helpText, { parse_mode: 'Markdown' });
});

composer.action('create_post', async (ctx) => {
  const userId = ctx.from.id;
  userState.set(userId, {
    step: 'greeting',
    data: {}
  });

  const greeting = await openai.chat.completions.create({
    model: 'glm-4',
    messages: [
      {
        role: 'system',
        content: 'Sen profesyonel bir sosyal medya içerik stratejistisin. Kullanıcıya hoş geldin mesajı ver.'
      },
      {
        role: 'user',
        content: 'Kullanıcı Telegram botunu kullanmak istiyor. Ona yardımcı ol.'
      }
    ],
    stream: true
  });

  let greetingText = '';
  for await (const chunk of greeting) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      greetingText += content;
    }
  }

  ctx.reply(
    `**${greetingText}**\n\n` +
    'Oluşturmak istediğiniz içeriği ve hedef platformu (Instagram/WhatsApp) girin.',
    { parse_mode: 'Markdown' }
  );
});

composer.action('templates_list', (ctx) => {
  const templates = [
    { id: 'professional', name: 'Professional', emoji: '👔' },
    { id: 'carousel', name: 'Carousel', emoji: '📱' },
    { id: 'minimal', name: 'Minimal', emoji: '🎨' },
    { id: 'business', name: 'Business', emoji: '💼' }
  ];

  const keyboard = templates.map(t => [
    Markup.button.callback(`${t.emoji} ${t.name}`, `select_template_${t.id}`)
  ]);

  ctx.reply(
    '📋 **Şablon Seçin:**',
    Markup.inlineKeyboard(keyboard, { wrap: true })
  );
});

composer.action(/^select_template_(.+)$/, async (ctx) => {
  const templateId = ctx.match[1];
  const userId = ctx.from.id;

  userState.set(userId, {
    step: 'select_template',
    data: { template: templateId }
  });

  const prompt = `Kullanıcı şablon seçti: ${templateId}. Şablon için talimatları ver.`;

  const response = await openai.chat.completions.create({
    model: 'glm-4',
    messages: [
      {
        role: 'system',
        content: 'Sosyal medya içerik üreticisi. Şablonlara göre talimat ver.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    stream: true
  });

  let responseText = '';
  for await (const chunk of response) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      responseText += content;
    }
  }

  ctx.reply(
    `✅ **${templateId.toUpperCase()}** şablonu seçildi\n\n` +
    `**Talimatlar:**\n${responseText}`,
    { parse_mode: 'Markdown' }
  );
});

composer.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const user = userState.get(userId);

  if (!user || user.step === 'start') {
    return;
  }

  const message = ctx.message.text;

  switch (user.step) {
    case 'greeting':
      userState.set(userId, {
        step: 'generating',
        data: { input: message }
      });

      const greetingResponse = await openai.chat.completions.create({
        model: 'glm-4',
        messages: [
          {
            role: 'system',
            content: 'Kullanıcı gönderdiğinizi alıp profesyonel bir şekilde düzenle. Instagram/WhatsApp için optimize et.'
          },
          {
            role: 'user',
            content: `Giriş: ${message}`
          }
        ],
        stream: true
      });

      let aiResponse = '';
      for await (const chunk of greetingResponse) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          aiResponse += content;
        }
      }

      ctx.reply(
        `✨ **AI İçerik:**\n\n${aiResponse}\n\n` +
        'Başka bir içerik istiyor musunuz? Şablon seçmek için /templates komutunu kullanın.',
        { parse_mode: 'Markdown' }
      );

      userState.set(userId, {
        step: 'start',
        data: {}
      });
      break;

    default:
      ctx.reply('❓ Anlamadım, lütfen /help komutuyla yardım alın.');
  }
});

composer.hears(/\/?status/i, (ctx) => {
  const userId = ctx.from.id;
  const user = userState.get(userId);

  if (!user) {
    ctx.reply('⚠️ Henüz bir bot durumu yok. /start ile başlatın.');
    return;
  }

  const statusText = `📊 **Bot Durumu**

🆔 **Kullanıcı ID:** ${userId}
👣 **Adım:** ${user.step.toUpperCase()}
📁 **Veriler:** ${JSON.stringify(user.data, null, 2)}`;

  ctx.reply(statusText, { parse_mode: 'Markdown' });
});

composer.hears(/\/?about/i, (ctx) => {
  const aboutText = `ℹ️ **Bot Hakkında**

🤖 **AI:** GLM (General Language Model)
📱 **Platformlar:** Telegram
🎨 **Amaç:** Performanslı içerik oluşturma
⚡ **Hız:** Gerçek zamanlı AI yanıtları

**Created by:** Konya MDR`;

  ctx.reply(aboutText, { parse_mode: 'Markdown' });
});

composer.action('help_menu', (ctx) => {
  ctx.editMessageText('❓ Yardım bilgisi için /help komutunu kullanın.', { parse_mode: 'Markdown' });
});

composer.action('about_bot', (ctx) => {
  ctx.editMessageText('ℹ️ Bot hakkında daha fazla bilgi için /about komutunu kullanın.', { parse_mode: 'Markdown' });
});

module.exports = composer;