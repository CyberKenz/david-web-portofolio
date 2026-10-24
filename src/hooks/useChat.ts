/**
 * src/hooks/useChat.ts
 * Hook untuk mengelola state chat: messages, loading, error, streaming.
 */

import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const SUGGESTIONS = [
  'Siapa David Andreas?',
  'Bagaimana perjalanan kariernya?',
  'Apa saja spesialisasinya?',
];

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Buat placeholder untuk respons bot
    const botMsgId = `bot-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
      }

      // Stream response
      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming tidak didukung.');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const msg = err.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setError(msg);
      // Hapus placeholder bot jika error
      setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}

export { SUGGESTIONS };