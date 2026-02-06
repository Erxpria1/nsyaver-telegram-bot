require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageProcessor = require('./services/imageProcessor');
const postBuilder = require('./services/postBuilder');
const postsRouter = require('./routes/posts');
const telegramRouter = require('./routes/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', postsRouter);
app.use('/telegram', telegramRouter);

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API Routes
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-post', async (req, res) => {
  try {
    const { logo, motto, mission, message, template, format } = req.body;
    
    // Validate required fields
    if (!motto || !mission || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: motto, mission, message' 
      });
    }

    // Process content
    const post = await postBuilder.buildPost({
      logo,
      motto,
      mission,
      message,
      template: template || 'professional',
      format: format || 'instagram'
    });

    res.json({
      success: true,
      post,
      platform: format
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Temiz ve profesyonel tasarım',
      example: 'Öğretmen Günü Hoş Geldiniz'
    },
    {
      id: 'carousel',
      name: 'Carousel',
      description: '3 slaytlı sunum',
      example: 'Carousel Post Örneği'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Basit ve minimal',
      example: 'Minimal Tasarım'
    }
  ];
  res.json(templates);
});

app.get('/api/preview', (req, res) => {
  res.send(postBuilder.getPreview());
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/preview', (req, res) => {
  const { title, mission, message, footer, logo } = req.query;
  res.render('templates/index.ejs', {
    title, mission, message, footer, logo
  });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Telegram bot polling (Geliştirme için)
if (process.env.BOT_POLLING === 'true') {
  const bot = require('./bot/index');
  console.log('📊 Telegram bot polling modunda çalışıyor');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
