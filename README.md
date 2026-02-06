# 🤖 Telegram AI Bot - Nsyaver

GLM AI ile güçlü bir yapay zeka asistanı.

## ✨ Özellikler

- 🤖 **GLM AI Entegrasyonu** - GLM-4 ve GLM-4.7 destekli
- 💬 **Telegram Bot** - Modern ve hızlı sohbet arayüzü
- 🗣️ **Stream Yanıtlar** - Gerçek zamanlı metin üretimi
- 📝 **Akıllı Sohbet** - Context desteği
- 🎯 **Hızlı Yanıt** - 4.7 ve 4.6 modelleri
- 🔒 **Güvenli** - Token ve API key yönetimi

## 🚀 Kurulum

### 1. .env Dosyası Oluştur

```bash
# GLM AI
GLM_API_KEY=your_api_key_here
GLM_API_BASE=https://open.bigmodel.cn/api/paas/v4

# Model Seçimi
GLM_MODEL=glm-4-flash
```

### 2. Başlatma

```bash
# Paketleri yükle
npm install

# Başlat
npm run dev
```

## 🤖 Bot Komutları

- `/start` - Botu başlat
- `/help` - Yardım menüsü
- `/clear` - Sohbet geçmişini temizle
- `/about` - Bot hakkında bilgi

## 📊 Modeller

- **glm-4** - Temel performans
- **glm-4-flash** - Hızlı yanıt
- **glm-4.6** - Gelişmiş özellikler
- **glm-4.7** - En son versiyon

## 🗂️ Proje Yapısı

```
ih.com/
├── package.json
├── server.js
├── bot/
│   └── index.js
├── services/
│   └── openai.js
└── public/
    └── index.html
```

## 🚀 Kullanım

Botu Telegram'da aratın ve sohbetmeye başlayın. Artık GLM AI ile sohbet edebilirsiniz!

---

**Powered by GLM AI** 🤖
