"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface StoreConfig {
  name: string;
  info: string;
}

interface ChatWidgetProps {
  store: StoreConfig;
}

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

let idCounter = 2;

export default function ChatWidget({ store }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: `您好！我是 ${store.name} 的客服助理，有什麼可以幫您？` },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages(prev => [...prev, { id: idCounter++, role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, storeConfig: store }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: idCounter++,
        role: 'assistant',
        text: data.reply || '抱歉，我目前無法回應。',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: idCounter++,
        role: 'assistant',
        text: '連線發生錯誤，請稍後再試。',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 h-[480px] glass-card rounded-2xl border border-neon-cyan/20 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(0,242,255,0.1)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-neon-cyan" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{store.name}</p>
                <p className="text-[10px] text-neon-cyan">AI 客服助理</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'assistant' ? 'bg-neon-cyan/20' : 'bg-neon-purple/20'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-3.5 h-3.5 text-neon-cyan" />
                    : <User className="w-3.5 h-3.5 text-neon-purple" />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neon-cyan/10 border border-neon-cyan/20 text-white rounded-tr-none'
                    : 'bg-black/50 border border-white/5 text-text-primary rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-md bg-neon-cyan/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-neon-cyan" />
                </div>
                <div className="bg-black/50 border border-white/5 rounded-xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 bg-black/40 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder="輸入訊息..."
                disabled={isLoading}
                className="flex-1 bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-neon-cyan transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-neon-cyan rounded-xl flex items-center justify-center text-black hover:bg-[#00d0eb] disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? '關閉客服視窗' : '開啟客服視窗'}
        className="w-14 h-14 rounded-2xl bg-neon-cyan text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:bg-[#00d0eb] transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
