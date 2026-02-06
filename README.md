# 🎭 Nsyaver - Kişisel AI Orkestra Şefi

Nsyaver, GLM z.ai tabanlı, MCP (Model Context Protocol) hazır bir kişisel AI asistanıdır. Karmaşık görevleri orkestra şefi gibi yöneterek, kullanıcılarına profesyonel ve akıllı asistanlık sağlar.

## ✨ Özellikler

- 🎭 **Orkestra Şefi Yaklaşımı** - Görevleri ustalıkla yönetir
- 🤖 **GLM z.ai Entegrasyonu** - bigmodel.cn API desteği
- 🛠️ **MCP Araç Desteği** - Tool calling ile genişletilebilir yetenekler
- 💬 **Telegram Bot** - Modern ve kullanıcı dostu arayüz
- 🔄 **Çoklu Model Desteği** - glm-4-flash, glm-4-plus, glm-4v ve daha fazlası
- 🖼️ **Görüntü Analizi** - GLM Vision ile fotoğraf analizi
- 📄 **Dosya İşleme** - TXT dosya analizi (PDF desteği yakında)
- 🧮 **Akıllı Araçlar** - Hesaplama, web arama, sistem durumu
- 🗨️ **Bağlam Yönetimi** - Akıllı sohbet hafızası

## 🚀 Kurulum

### 1. Gereksinimleri Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
BOT_POLLING=true

# GLM AI
GLM_API_KEY=your_glm_api_key
GLM_API_BASE=https://open.bigmodel.cn/api/paas/v4
GLM_MODEL=glm-4-flash

# Server
PORT=3000
NODE_ENV=development
```

### 3. Botu Başlatın

```bash
# Geliştirme modu (nodemon ile)
npm run dev

# Üretim modu
npm start
```

## 🤖 Bot Komutları

- `/start` - Zengin hoş geldin mesajı ve bot tanıtımı
- `/help` - Yardım menüsü ve kullanım kılavuzu
- `/model` - AI modelini değiştir (inline keyboard)
- `/clear` - Sohbet geçmişini temizle
- `/about` - Nsyaver vizyonu ve teknoloji bilgisi

## 🎯 Kullanım

### Metin Sohbet
Doğrudan mesaj göndererek Nsyaver ile sohbet edin:
```
Merhaba Nsyaver! Bugün hava nasıl?
```

### Fotoğraf Analizi
Fotoğraf göndererek GLM Vision ile analiz ettirin:
```
[Fotoğraf gönder]
Başlık: Bu görüntüde ne var?
```

### Dosya Analizi
PDF veya TXT dosyası göndererek içeriğini inceleyin:
```
[Dosya gönder: rapor.txt]
```
*Not: Şu anda sadece TXT dosyaları desteklenmektedir. PDF desteği yakında eklenecek.*

### Araçları Kullanma
Nsyaver otomatik olarak gerektiğinde araçları kullanır:
```
2+2 kaç eder? → Hesaplama aracı kullanılır
Şu an saat kaç? → Sistem durumu aracı kullanılır
```

## 📊 Desteklenen Modeller

| Model | Açıklama | Kullanım |
|-------|----------|----------|
| **glm-4-flash** | Hızlı yanıtlar, günlük kullanım | Varsayılan |
| **glm-4-plus** | Gelişmiş yetenekler, karmaşık görevler | Detaylı analiz |
| **glm-4** | Standart model, dengeli performans | Genel amaçlı |
| **glm-4-air** | Hafif ve hızlı, basit sorular | Hızlı yanıt |
| **glm-4v** | Görüntü analizi, vision | Fotoğraf analizi |

## 🛠️ MCP Araçlar

Nsyaver şu araçları kullanabilir:

1. **Web Arama** - İnternet'te bilgi arama (simülasyon)
2. **Hesap Makinesi** - Matematiksel hesaplamalar
3. **Sistem Durumu** - Zaman, bellek ve uptime kontrolü

Yeni araçlar `services/tools.js` dosyasına eklenebilir.

## 🗂️ Proje Yapısı

```
nsyaver-telegram-bot/
├── bot/
│   └── index.js          # Ana bot mantığı
├── services/
│   ├── glm.js           # GLM API servisi
│   └── tools.js         # MCP araç tanımları
├── routes/
│   └── telegram.js      # Telegram webhook
├── server.js            # Express sunucusu
├── package.json         # Proje bağımlılıkları
└── .env.example         # Örnek ortam değişkenleri
```

## 🔧 Geliştirme

### Test Etme
```bash
# Botu geliştirme modunda çalıştır
npm run dev
```

### Webhook Modu
Production ortamında webhook kullanın:
```env
BOT_POLLING=false
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/telegram/webhook
```

## 📝 API Endpoints

- `GET /` - Ana sayfa ve API bilgisi
- `GET /health` - Sağlık kontrolü
- `POST /telegram/webhook` - Telegram webhook endpoint

## 🌟 Özellikler ve Yetenekler

### Akıllı Hafıza
- Her kullanıcı için ayrı oturum
- Son 20 mesajı hatırlar
- Bağlam korunarak yanıt verir

### Tool Calling
- GLM API'nin tool calling özelliğini kullanır
- Dinamik araç seçimi
- Sonuç entegrasyonu

### Multi-Modal
- Metin işleme
- Görüntü analizi (GLM-4V)
- Dosya içerik analizi (TXT, PDF desteği yakında)

## 🔐 Güvenlik

- API anahtarları ortam değişkenlerinde
- Hata mesajları kullanıcıya gösterilmez
- Dosya tipi kontrolü
- İçerik boyut sınırlaması

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

---

**Powered by GLM z.ai** 🤖  
*"Düşüncelerinizi senfoniyle harmanlıyoruz!"* 🎶
