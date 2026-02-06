const express = require('express');
const router = express.Router();

router.post('/upload', (req, res) => {
  const upload = require('../services/imageProcessor');
  const multer = require('multer');

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads';
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });

  const uploadMiddleware = multer({ storage });
  uploadMiddleware.single('image')((req, res) => {
    if (req.file) {
      res.json({
        success: true,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
});

router.post('/create', async (req, res) => {
  try {
    const postBuilder = require('../services/postBuilder');
    const { logo, motto, mission, message, template, format } = req.body;

    if (!motto || !mission || !message) {
      return res.status(400).json({
        error: 'Missing required fields: motto, mission, message'
      });
    }

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

module.exports = router;