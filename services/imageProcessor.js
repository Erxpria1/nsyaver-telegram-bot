const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ImageProcessor {
  constructor() {
    this.processedDir = 'uploads/processed';
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
    }
  }

  async processImage(inputPath, options = {}) {
    try {
      const { width = 1080, height = 1080, format = 'jpeg', quality = 90 } = options;

      const outputPath = path.join(this.processedDir, `processed-${Date.now()}.${format}`);

      await sharp(inputPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toFormat(format, {
          quality: quality,
          progressive: false
        })
        .toFile(outputPath);

      return {
        success: true,
        path: outputPath,
        url: `/uploads/processed/${path.basename(outputPath)}`,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async processUrlToImage(url, options = {}) {
    try {
      const axios = require('axios');
      const { width = 1080, height = 1080, format = 'jpeg', quality = 90 } = options;

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });

      const outputPath = path.join(this.processedDir, `url-image-${Date.now()}.${format}`);

      const writer = fs.createWriteStream(outputPath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
          try {
            const result = await this.processImage(outputPath, { width, height, format, quality });
            fs.unlinkSync(outputPath);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });

        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`URL image processing failed: ${error.message}`);
    }
  }

  async processLogo(logoPath, options = {}) {
    try {
      const { width = 200, height = 200, format = 'png' } = options;

      const outputPath = path.join(this.processedDir, `logo-${Date.now()}.${format}`);

      await sharp(logoPath)
        .resize(width, height, {
          fit: 'contain',
          position: 'center'
        })
        .toFormat(format, { transparent: true })
        .toFile(outputPath);

      return {
        success: true,
        path: outputPath,
        url: `/uploads/processed/${path.basename(outputPath)}`,
        dimensions: { width, height }
      };
    } catch (error) {
      throw new Error(`Logo processing failed: ${error.message}`);
    }
  }

  async optimizeImage(inputPath, options = {}) {
    try {
      const { width = 1080, height = 1080, format = 'jpeg', quality = 85 } = options;

      const outputPath = path.join(this.processedDir, `optimized-${Date.now()}.${format}`);

      await sharp(inputPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toFormat(format, {
          quality: quality,
          progressive: true
        })
        .toFile(outputPath);

      return {
        success: true,
        path: outputPath,
        url: `/uploads/processed/${path.basename(outputPath)}`
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid image type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit.');
    }

    return true;
  }

  getThumbnail(path, options = {}) {
    try {
      const { width = 300, height = 300, format = 'jpeg', quality = 70 } = options;

      return sharp(path)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toFormat(format, { quality })
        .toBuffer();
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessor();
