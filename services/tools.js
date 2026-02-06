/**
 * MCP-compatible tools for Nsyaver bot
 */

const tools = [
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'İnternette arama yapar ve güncel bilgi getirir (simülasyon)',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Aranacak sorgu metni'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Matematiksel hesaplamalar yapar',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Hesaplanacak matematiksel ifade (örn: "2 + 2", "sqrt(16)")'
          }
        },
        required: ['expression']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'system_status',
      description: 'Sistemin mevcut durumunu raporlar',
      parameters: {
        type: 'object',
        properties: {
          check_type: {
            type: 'string',
            enum: ['memory', 'time', 'all'],
            description: 'Kontrol edilecek sistem durumu tipi'
          }
        }
      }
    }
  }
];

/**
 * Execute a tool call
 */
async function executeTool(toolName, args) {
  switch (toolName) {
    case 'web_search':
      return {
        success: true,
        result: `Web arama sonuçları: "${args.query}" için simüle edilmiş sonuçlar. (Gerçek web arama entegrasyonu yakında eklenecek)`
      };

    case 'calculator':
      try {
        // Simple calculator - in production use a safer math library
        const result = eval(args.expression.replace(/sqrt/g, 'Math.sqrt'));
        return {
          success: true,
          result: `${args.expression} = ${result}`
        };
      } catch (error) {
        return {
          success: false,
          error: 'Geçersiz matematiksel ifade'
        };
      }

    case 'system_status':
      const status = {
        time: new Date().toLocaleString('tr-TR'),
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      if (args.check_type === 'time') {
        return { success: true, result: `Sistem zamanı: ${status.time}` };
      } else if (args.check_type === 'memory') {
        return { 
          success: true, 
          result: `Bellek kullanımı: ${Math.round(status.memory.heapUsed / 1024 / 1024)} MB` 
        };
      } else {
        return {
          success: true,
          result: `Sistem Durumu:\n- Zaman: ${status.time}\n- Bellek: ${Math.round(status.memory.heapUsed / 1024 / 1024)} MB\n- Çalışma süresi: ${Math.round(status.uptime)} saniye`
        };
      }

    default:
      return {
        success: false,
        error: 'Bilinmeyen araç'
      };
  }
}

module.exports = {
  tools,
  executeTool
};
