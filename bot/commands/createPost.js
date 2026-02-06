const { Composer, Markup } = require('telegraf');
const openai = require('../services/openai');

const composer = new Composer();

composer.start(async (ctx) => {
  ctx.reply(
    '📝 **Post Oluşturma**\n\n' +
    'Oluşturmak istediğiniz içeriği yazın, GLM ile optimize edeyim!\n\n' +
    'Örnek: "Merhaba, öğretmen günü hoş geldiniz"',
    { parse_mode: 'Markdown' }
  );
});

composer.on('text', async (ctx) => {
  const message = ctx.message.text;

  ctx.reply('🤖 **Yazıyoruz...**');

  const response = await openai.chat.completions.create({
    model: 'glm-4',
    messages: [
      {
        role: 'system',
        content: 'Sosyal medya içerik stratejisti. Kullanıcı gönderisini profesyonelce düzenle. Instagram/WhatsApp için optimize et.'
      },
      {
        role: 'user',
        content: `Orijinal içerik: ${message}\n\nLütfen bunu profesyonel sosyal medya içeriğine dönüştür.`
      }
    ],
    stream: true
  });

  let aiResponse = '';
  for await (const chunk of response) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      aiResponse += content;
    }
  }

  ctx.reply(
    `✨ **AI İçerik Oluşturuldu:**\n\n${aiResponse}\n\n` +
    'Başka bir içerik istiyor musunuz? Başka bir komut yazın.',
    { parse_mode: 'Markdown' }
  );
});

module.exports = composer;