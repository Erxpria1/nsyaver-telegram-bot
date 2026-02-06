const OpenAI = require('openai');

const { GLM_API_KEY, GLM_API_BASE } = process.env;

if (!GLM_API_KEY) {
  console.warn('⚠️ GLM API key bulunamadı!');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: GLM_API_KEY,
  baseURL: GLM_API_BASE || 'https://open.bigmodel.cn/api/paas/v4'
});

module.exports = {
  client: openai,
  chat: async (messages, model = 'glm-4-flash') => {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.';
    } catch (error) {
      console.error('GLM API Error:', error);
      return `Hata oluştu: ${error.message}`;
    }
  },

  streamChat: async (messages, model = 'glm-4-flash', callback) => {
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1000
      });

      let fullContent = '';

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullContent += content;
          callback(content);
        }
      }

      return fullContent;
    } catch (error) {
      console.error('GLM API Error:', error);
      callback(`Hata oluştu: ${error.message}`);
      return null;
    }
  }
};