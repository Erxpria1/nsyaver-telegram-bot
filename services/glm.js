const OpenAI = require('openai');

const { GLM_API_KEY, GLM_API_BASE, GLM_MODEL } = process.env;

if (!GLM_API_KEY) {
  console.warn('⚠️ GLM API key bulunamadı!');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: GLM_API_KEY,
  baseURL: GLM_API_BASE || 'https://open.bigmodel.cn/api/paas/v4'
});

const AVAILABLE_MODELS = {
  'glm-4-flash': { name: 'GLM-4 Flash', description: 'Hızlı yanıtlar' },
  'glm-4-plus': { name: 'GLM-4 Plus', description: 'Gelişmiş yetenekler' },
  'glm-4': { name: 'GLM-4', description: 'Standart model' },
  'glm-4-air': { name: 'GLM-4 Air', description: 'Hafif ve hızlı' },
  'glm-4v': { name: 'GLM-4 Vision', description: 'Görüntü analizi' }
};

module.exports = {
  client: openai,
  AVAILABLE_MODELS,
  
  /**
   * Standard chat completion
   */
  chat: async (messages, model = GLM_MODEL || 'glm-4-flash', options = {}) => {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: false,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        tools: options.tools || undefined
      });

      return response.choices[0]?.message || { content: 'Üzgünüm, bir hata oluştu.' };
    } catch (error) {
      console.error('GLM API Error:', error);
      throw error;
    }
  },

  /**
   * Stream chat completion
   */
  streamChat: async (messages, model = GLM_MODEL || 'glm-4-flash', callback, options = {}) => {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
        tools: options.tools || undefined
      });

      let fullContent = '';
      let toolCalls = [];

      for await (const chunk of response) {
        const delta = chunk.choices[0]?.delta;
        
        if (delta?.content) {
          fullContent += delta.content;
          if (callback) callback(delta.content);
        }
        
        if (delta?.tool_calls) {
          toolCalls = delta.tool_calls;
        }
      }

      return { content: fullContent, toolCalls };
    } catch (error) {
      console.error('GLM API Error:', error);
      if (callback) callback(`Hata oluştu: ${error.message}`);
      return null;
    }
  },

  /**
   * Vision model for image analysis
   */
  vision: async (imageUrl, prompt, model = 'glm-4v') => {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ]
      });

      return response.choices[0]?.message?.content || 'Görüntü analiz edilemedi.';
    } catch (error) {
      console.error('GLM Vision API Error:', error);
      throw error;
    }
  }
};