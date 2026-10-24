import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const MODEL = 'gemini-3.5-flash';
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;
const MAX_MESSAGES = 10;
const MAX_CHARS = 500;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/**
 * Dev middleware untuk /api/chat.
 * Logika sama dengan api/chat.ts (handler serverless untuk production).
 */
function chatApiPlugin() {
  return {
    name: 'chat-api-dev',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const ip =
              (typeof req.headers['x-forwarded-for'] === 'string'
                ? req.headers['x-forwarded-for'].split(',')[0].trim()
                : '') ||
              req.socket?.remoteAddress ||
              'unknown';

            if (!checkRateLimit(ip)) {
              res.statusCode = 429;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' }));
              return;
            }

            const { messages } = JSON.parse(body || '{}');
            if (!Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Pesan tidak valid.' }));
              return;
            }

            const contents = messages
              .slice(-MAX_MESSAGES)
              .map((m: any) => ({
                role: m?.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: String(m?.content ?? '').slice(0, MAX_CHARS) }],
              }))
              .filter((m: any) => m.parts[0].text.trim().length > 0);

            if (contents.length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Pesan tidak valid.' }));
              return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: 'Server belum dikonfigurasi. Hubungi administrator.' }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const { CHATBOT_SYSTEM_PROMPT } = await import('./src/data/david-knowledge.ts');
            const ai = new GoogleGenAI({ apiKey });

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('X-Accel-Buffering', 'no');

            const request = {
              model: MODEL,
              contents,
              config: {
                systemInstruction: CHATBOT_SYSTEM_PROMPT,
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            };

            // Model flash sesekali 503 (high demand). Coba sekali lagi.
            let stream: any;
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                stream = await ai.models.generateContentStream(request);
                break;
              } catch (error: any) {
                const message = String(error?.message || '');
                const retryable = /503|UNAVAILABLE|overloaded|high demand/i.test(message);
                if (attempt === 0 && retryable) {
                  await new Promise((r) => setTimeout(r, 900));
                  continue;
                }
                throw error;
              }
            }

            for await (const chunk of stream) {
              if (chunk.text) res.write(chunk.text);
            }
            res.end();
          } catch (error: any) {
            console.error('[chat-api-dev] Gemini error:', error?.message || error);
            const message = String(error?.message || '');
            res.statusCode = /quota|429|RESOURCE_EXHAUSTED/i.test(message) ? 429 : 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            if (/quota|429|RESOURCE_EXHAUSTED/i.test(message)) {
              res.end(JSON.stringify({ error: 'Kuota API habis. Coba lagi nanti.' }));
            } else if (/network|ECONNREFUSED|fetch failed|ENOTFOUND/i.test(message)) {
              res.end(JSON.stringify({ error: 'Gagal terhubung ke server. Periksa koneksi internet Anda.' }));
            } else {
              res.end(JSON.stringify({ error: 'Terjadi kesalahan. Silakan coba lagi.' }));
            }
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Muat semua env (termasuk yang tanpa prefix VITE_) untuk kebutuhan server.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [react(), tailwindcss(), chatApiPlugin()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
