# 🚀 Konya MDR Telegram Bot - GLM AI Entegre

Konya odaklı Telegram botu - GLM yapay zeka ile performanslı içerik oluşturma.

## ✨ Özellikler

- 🤖 **GLM AI Entegrasyonu** - Yapay zeka destekli içerik üretimi
- 💬 **Telegram Bot** - Modern Telegram arayüzü
- 📝 **AI İçerik Oluşturma** - Otomatik ve profesyonel metinler
- 🎨 **Şablon Sistemi** - Profesyonel, Carousel, Minimal
- ⚡ **Gerçek Zamanlı** - Stream yanıtlar ve performans
- 🔒 **Güvenli** - Token ve API key yönetimi

## 🎯 Kullanım Örneği: Öğretmen Günü

```bash
Logo: https://example.com/logo.png
Motto: Öğretmen Günü Hoş Geldiniz
Mission: Mevcut görevinizi sizi çok daha iyi yapmanızı sağlar.
Message: Bugün tüm öğretmenlerimiz için özel bir gün!
```

## 🤖 Telegram Bot Kurulumu

### 1. Telegram Bot Token Alma
1. Telegram'da @BotFather ile yeni bot oluştur
2. `/newbot` komutunu yazın
3. Bot adı belirleyin (örn: "Konya MDR Bot")
4. Token'ı alıp kopyalayın

### 2. GLM API Key Alma
1. GLM API'ye kayıt olun
2. API key'i alın (process.env'e ekleyin)

### 3. .env Dosyası
```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-domain.com/telegram/webhook
BOT_POLLING=true

# GLM AI
GLM_API_KEY=your_glm_api_key_here
GLM_API_BASE=https://open.bigmodel.cn/api/paas/v4
```

### 4. Başlatma
```bash
# Paketleri yükle
npm install

# Sunucuyu başlat
npm run dev
```

Bot polling modunda çalışacak.

### 5. Webhook Kurulumu (Opsiyonel)
```bash
# Production için webhook kurun
curl http://localhost:3000/telegram?token=your_bot_token&hook=set
```

## 📋 API Endpoints

### POST /api/create-post
Yeni post oluştur

```bash
curl -X POST http://localhost:3000/api/create-post \
  -H "Content-Type: application/json" \
  -d '{
    "logo": "https://example.com/logo.png",
    "motto": "Öğretmen Günü Hoş Geldiniz",
    "mission": "Mevcut görevinizi sizi çok daha iyi yapmanızı sağlar.",
    "message": "Bugün tüm öğretmenlerimiz için özel bir gün!",
    "template": "professional"
  }'
```

### POST /api/upload-image
Resim yükle

```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "image=@/path/to/image.jpg"
```

### GET /api/templates
Kullanılabilir şablonları listele

### GET /api/preview
Post önizlemesi al

## 🎨 Şablonlar

### 1. Professional
Temiz ve profesyonel tasarım
```
┌─────────────────────────┐
│        [LOGO]           │
│                         │
│    Öğretmen Günü         │
│   Hoş Geldiniz           │
│                         │
│    📌 Misyonunuz:        │
│    Mevcut görevinizi      │
│    sizi çok daha iyi     │
│    yapmanızı sağlar.     │
│                         │
│    💬 Mesaj:             │
│    Bugün tüm öğretmenler  │
│   imiz için özel bir gün!│
│                         │
│   🌟 Konya ıh.com 🌟     │
└─────────────────────────┘
```

### 2. Carousel (Slayt)
3 slaytlı sunum
- Slayt 1: Logo + Greeting
- Slayt 2: Amacımız
- Slayt 3: Message + Footer

### 3. Minimal
Basit ve minimal tasarım

## 📱 WhatsApp Entegrasyonu

```bash
# WhatsApp ile mesaj gönder
curl -X POST http://localhost:3000/api/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Öğretmen Günü!",
    "recipient": "+90XXXXXXXXXX"
  }'
```

## 🗂️ Proje Yapısı

```
ih.com/
├── package.json
├── server.js
├── routes/
│   └── posts.js
├── services/
│   ├── imageProcessor.js
│   └── postBuilder.js
├── public/
│   ├── index.html
│   ├── templates/
│   │   ├── professional.ejs
│   │   ├── carousel.ejs
│   │   └── index.ejs
│   └── uploads/
└── uploads/
```

## 🔧 Güvenlik

- ✅ Dosya type validation
- ✅ Boyut limiti (10MB)
- ✅ Sadece JPEG, PNG, Webp
- ✅ SQL injection koruması
- ✅ Rate limiting

## 📦 Node.js Paketleri

- **express** - Web framework
- **sharp** - Resim işleme
- **multer** - Dosya upload
- **ejs** - Template engine
- **axios** - HTTP client
- **@whiskeysockets/baileys** - WhatsApp automation

## 🚀 Deployment

### Docker
```bash
docker build -t mdr-bot .
docker run -p 3000:3000 mdr-bot
```

### Vercel/Netlify
```bash
vercel deploy
```

### Localhost
```bash
npm start
```

## 📊 Loglama

Sunucu logları konsola yazdırılır:
- ✅ Başarılı istekler
- ❌ Hatalar
- 📅 Post oluşturma zamanları

## 🔄 İleri Adımlar

1. Instagram API entegrasyonu
2. WhatsApp Cloud API kurulumu
3. Database ekleme (PostgreSQL/MongoDB)
4. Kullanıcı yetkilendirme sistemi
5. Analytics dashboard
6. Otomatik içerik takvimi

## 📝 Kullanım Talimatları

1. **Giriş:** http://localhost:3000 adresine gidin
2. **Formu Doldurun:**
   - Logo URL girin (isteğe bağlı)
   - Motto yazın
   - Misyon mesajını girin
   - Özel mesajını yazın
3. **Şablon Seçin:** Professional, Carousel veya Minimal
4. **Post Oluştur:** Butona basın
5. **Önizleme:** Oluşan postu görüntüleyin

## 🎯 Örnek Senaryolar

### Öğretmen Günü
```
Motto: Öğretmen Günü Hoş Geldiniz
Mission: Mevcut görevinizi sizi çok daha iyi yapmanızı sağlar.
Message: Bugün tüm öğretmenlerimiz için özel bir gün!
```

### Misyon Bildirimi
```
Motto: Amacımız Devam
Mission: Size en iyi hizmeti sunmak için çalışıyoruz.
Message: Bu gücü kullanarak bir fark yaratın!
```

### Özel Mesaj
```
Motto: Özel Gün
Mission: Sizi özel hissettiriyoruz.
Message: Bu gün için özel bir anı kodlayın!
```

## 📞 Destek

- GitHub Issues: [GitHub repository]
- Email: [support email]

## 📄 Lisans

MIT License - Kendi kullanımınız için serbest

---

**🚀 Başlamak için:**
```bash
npm install
npm run dev
```

**🌐 Hemen Başla:** http://localhost:3000

---

*15 dolarlık budgetınız ile tam fonksiyonel bot hazır!* 💰✨
