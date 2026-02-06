const { Markup } = require('telegraf');

module.exports = {
  createPostMenu: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('📊 Yeni Post', 'new_post'),
        Markup.button.callback('📋 Şablonlar', 'select_template')
      ],
      [
        Markup.button.callback('🎨 Tasarımlar', 'designs'),
        Markup.button.callback('🖼️ Görseller', 'images')
      ],
      [
        Markup.button.callback('📝 Metin', 'text_editor'),
        Markup.button.callback('🎨 Renkler', 'colors')
      ],
      [
        Markup.button.callback('💾 Kaydet', 'save_post'),
        Markup.button.callback('📤 Paylaş', 'share_post')
      ]
    ]);
  },

  platformSelector: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('📱 Instagram', 'platform_instagram'),
        Markup.button.callback('💬 WhatsApp', 'platform_whatsapp')
      ],
      [
        Markup.button.callback('✅ İşlemez', 'back_to_menu')
      ]
    ]);
  },

  templateSelector: () => {
    const templates = [
      { id: 'professional', name: 'Professional', emoji: '👔' },
      { id: 'carousel', name: 'Carousel', emoji: '📱' },
      { id: 'minimal', name: 'Minimal', emoji: '🎨' },
      { id: 'business', name: 'Business', emoji: '💼' }
    ];

    const keyboard = templates.map(t => [
      Markup.button.callback(`${t.emoji} ${t.name}`, `template_${t.id}`)
    ]);

    return Markup.inlineKeyboard(keyboard);
  },

  saveOptions: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('💾 Kaydet', 'save'),
        Markup.button.callback('📤 Paylaş', 'share')
      ],
      [
        Markup.button.callback('❌ İptal', 'cancel')
      ]
    ]);
  },

  shareOptions: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('📱 Instagram', 'share_instagram'),
        Markup.button.callback('💬 WhatsApp', 'share_whatsapp')
      ],
      [
        Markup.button.callback('📤 Telegram', 'share_telegram')
      ],
      [
        Markup.button.callback('⬅️ Geri', 'back_to_menu')
      ]
    ]);
  }
};