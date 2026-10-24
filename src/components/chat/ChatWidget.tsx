/**
 * src/components/chat/ChatWidget.tsx
 * Tombol floating chat + panel/drawer chat.
 * Mobile: hampir fullscreen. Desktop: drawer di pojok kanan bawah.
 */

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { useChat, SUGGESTIONS } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Fokus input saat panel dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Tutup dengan Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Tombol floating chat */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup chat' : 'Buka chat asisten David'}
        aria-expanded={isOpen}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 flex size-12 items-center justify-center rounded-full border-2 border-night bg-brand text-night shadow-[4px_4px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:left-6"
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Bot size={20} aria-hidden="true" />}
      </button>

      {/* Panel chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="chat-panel overflow-hidden rounded-2xl border-2 border-night bg-paper shadow-[6px_6px_0_0_#242323]"
            role="dialog"
            aria-label="Chat asisten David Andreas"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-night bg-brand px-4 py-3">
              <div>
                <p className="font-display text-[1.1rem] font-extrabold text-night">Asisten David</p>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-night/70">
                  Tanya seputar David &amp; latihan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat"
                className="flex size-11 items-center justify-center rounded-full border-2 border-night bg-paper text-night transition-colors hover:bg-cream"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[13px] leading-6 text-muted">
                    Halo! Saya asisten virtual David Andreas. Tanya apa saja seputar David, perjalanan karier, dan spesialisasinya.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSuggestion(s)}
                        className="min-h-11 rounded-full border-2 border-night bg-cream px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-night transition-colors hover:bg-brand"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}

              {error && (
                <div className="rounded-2xl border-2 border-night bg-brand/20 px-3.5 py-2.5 text-[13px] leading-5 text-night">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t-2 border-night bg-cream p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya seputar David..."
                  maxLength={500}
                  disabled={isLoading}
                  aria-label="Pesan chat"
                  className="min-h-12 flex-1 rounded-full border-2 border-night bg-paper px-4 py-2 text-[13px] text-night placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  aria-label="Kirim pesan"
                  className="flex size-12 items-center justify-center rounded-full border-2 border-night bg-brand text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-40"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}