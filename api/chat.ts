/**
 * api/chat.ts
 * Serverless function (Vercel/Netlify) — proxy ke Google Gemini API.
 * API key dibaca dari env GEMINI_API_KEY (server-side only, tidak VITE_).
 *
 * Request: POST { messages: [{ role: "user"|"assistant", content: string }] }
 * Response: streaming text (text/plain, chunked)
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { CHATBOT_SYSTEM_PROMPT } from '../src/data/david-knowledge.ts';

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

type Req = IncomingMessage & {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};
type Res = ServerResponse & {
  status: (code: number) => Res;
  json: (data: unknown) => void;
};

function readBody(req: Req): Promise<string> {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
      return;
    }
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString();
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' });
    return;
  }

  let payload: { messages?: unknown } = {};
  try {
    payload = JSON.parse((await readBody(req)) || '{}');
  } catch {
    res.status(400).json({ error: 'Format permintaan tidak valid.' });
    return;
  }

  const rawMessages = payload.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    res.status(400).json({ error: 'Pesan tidak valid.' });
    return;
  }

  const contents = rawMessages
    .slice(-MAX_MESSAGES)
    .map((m) => {
      const msg = m as { role?: string; content?: unknown };
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(msg.content ?? '').slice(0, MAX_CHARS) }],
      };
    })
    .filter((m) => m.parts[0].text.trim().length > 0);

  if (contents.length === 0) {
    res.status(400).json({ error: 'Pesan tidak valid.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server belum dikonfigurasi. Hubungi administrator.' });
    return;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    const stream = await (async () => {
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
      for (let attempt = 0; ; attempt++) {
        try {
          return await ai.models.generateContentStream(request);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (attempt === 0 && /503|UNAVAILABLE|overloaded|high demand/i.test(message)) {
            await new Promise((r) => setTimeout(r, 900));
            continue;
          }
          throw error;
        }
      }
    })();

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) res.write(text);
    }
    res.end();
  } catch (error) {
    console.error('Gemini API error:', error);
    const message = error instanceof Error ? error.message : String(error);
    if (/quota|429|RESOURCE_EXHAUSTED/i.test(message)) {
      res.status(429).json({ error: 'Kuota API habis. Coba lagi nanti.' });
    } else if (/network|ECONNREFUSED|fetch failed|ENOTFOUND/i.test(message)) {
      res.status(503).json({ error: 'Gagal terhubung ke server. Periksa koneksi internet Anda.' });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan. Silakan coba lagi.' });
    }
  }
}
