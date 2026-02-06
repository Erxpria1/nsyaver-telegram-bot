const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

class PostBuilder {
  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
  }

  async buildPost({ logo, motto, mission, message, template = 'professional', format = 'instagram' }) {
    try {
      let post;

      switch (format) {
        case 'instagram':
          post = await this.buildInstagramPost({ logo, motto, mission, message, template });
          break;
        case 'whatsapp':
          post = this.buildWhatsAppMessage({ motto, mission, message });
          break;
        default:
          post = this.buildProfessionalPost({ logo, motto, mission, message });
      }

      return {
        format,
        template,
        content: post,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Post building failed: ${error.message}`);
    }
  }

  async buildInstagramPost({ logo, motto, mission, message, template }) {
    const templates = {
      professional: await this.renderProfessionalTemplate({ logo, motto, mission, message }),
      carousel: await this.renderCarouselTemplate({ logo, motto, mission, message }),
      minimal: await this.renderMinimalTemplate({ logo, motto, mission, message })
    };

    return templates[template] || templates.professional;
  }

  buildWhatsAppMessage({ motto, mission, message }) {
    return {
      greeting: `🔔 **${motto}**`,
      mission: `📌 **Misyonumuz:**\n${mission}`,
      message: `💬 **Mesaj:**\n${message}`,
      footer: `🌟 Konya ıh.com 🌟`
    };
  }

  buildProfessionalPost({ logo, motto, mission, message }) {
    return {
      title: motto,
      mission: mission,
      message: message,
      footer: '🌟 Konya ıh.com 🌟'
    };
  }

  async renderProfessionalTemplate({ logo, motto, mission, message }) {
    const templatePath = path.join(this.templatesDir, 'professional.ejs');

    if (!fs.existsSync(templatePath)) {
      return this.buildProfessionalPost({ logo, motto, mission, message });
    }

    return await ejs.renderFile(templatePath, {
      logo,
      motto,
      mission,
      message,
      format: 'instagram'
    });
  }

  async renderCarouselTemplate({ logo, motto, mission, message }) {
    const templatePath = path.join(this.templatesDir, 'carousel.ejs');

    if (!fs.existsSync(templatePath)) {
      return {
        slayt1: this.buildProfessionalPost({ logo, motto, mission, message }),
        slayt2: {
          title: '🎯 Amacımız',
          mission: mission,
          message: message
        },
        slayt3: {
          footer: '🌟 Konya ıh.com 🌟',
          message: message
        }
      };
    }

    return await ejs.renderFile(templatePath, {
      logo,
      motto,
      mission,
      message,
      format: 'carousel'
    });
  }

  async renderMinimalTemplate({ logo, motto, mission, message }) {
    const templatePath = path.join(this.templatesDir, 'minimal.ejs');

    if (!fs.existsSync(templatePath)) {
      return {
        title: motto,
        message: message,
        footer: 'Konya ıh.com'
      };
    }

    return await ejs.renderFile(templatePath, {
      logo,
      motto,
      mission,
      message,
      format: 'minimal'
    });
  }

  getPreview() {
    return {
      title: 'Post Preview',
      description: 'This is a preview of your post',
      template: 'professional',
      example: {
        motto: 'Öğretmen Günü Hoş Geldiniz',
        mission: 'Mevcut görevinizi sizi çok daha iyi yapmanızı sağlar.',
        message: 'Bugün tüm öğretmenlerimiz için özel bir gün!'
      }
    };
  }

  getTemplatesList() {
    return {
      professional: {
        name: 'Professional',
        description: 'Temiz ve profesyonel tasarım',
        example: 'Öğretmen Günü Hoş Geldiniz'
      },
      carousel: {
        name: 'Carousel',
        description: '3 slaytlı sunum',
        example: 'Carousel Post Örneği'
      },
      minimal: {
        name: 'Minimal',
        description: 'Basit ve minimal',
        example: 'Minimal Tasarım'
      }
    };
  }
}

module.exports = new PostBuilder();
