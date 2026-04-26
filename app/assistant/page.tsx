"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, User, Send, Zap, ChevronRight, Calculator, Activity, CheckCircle2, 
  ArrowUpCircle, ArrowDownCircle, HardDrive, ShieldCheck, RefreshCw, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockParts } from '@/lib/data';

// === Types ===
type RecommendationType = {
  totalPrice: number;
  tdp: number;
  targetResolution: string;
  compatibility: string;
  parts: { cat: string; name: string; price: number; reason: string }[];
  upgradeTip: string;
  saveTip: string;
};

type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  hasRecommendation?: boolean;
  build?: Record<string, string>;
};

const QUICK_PROMPTS = [
  "預算四萬，想順跑 3A 遊戲 (如 GTA6)",
  "預算三萬內，影像剪輯與輕度 AI 運算",
  "五萬預算，想要純白海景房外觀與 RGB",
  "我想沿用舊的 RTX 3080，其他預算兩萬",
];

let msgIdCounter = 2;

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: '您好！我是 Machi PC 的專屬 AI 決策助手 Lyna AI。請告訴我您的 **預算**、**主要用途**（例如：遊戲、剪輯、文書）以及任何特別的偏好（例如：偏好華碩、需要白色系、是否考慮二手零件），我將為您量身打造最佳的硬體配置選項。',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRec, setActiveRec] = useState<RecommendationType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    // Add user message
    const userMsg: Message = { id: String(msgIdCounter++), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const { reply } = await res.json();
      const data = JSON.parse(reply || '{}');

      const aiMsg: Message = {
        id: String(msgIdCounter++),
        role: 'assistant',
        text: data.message || "抱歉，我目前無法完整理解您的需求。",
        hasRecommendation: !!data.build,
        build: data.build
      };

      setMessages(prev => [...prev, aiMsg]);
      if (data.build && data.summary) {
         const resolvedPartsList = Object.entries(data.build).map(([cat, id]) => {
            const part = mockParts.find(p => p.id === String(id));
            const reason = data.reasons?.[cat as keyof typeof data.reasons] || '';
            return {
               cat,
               name: part ? part.name : String(id),
               price: part ? part.price : 0,
               reason
            };
         }).filter(p => !!p.name);

         const rec: RecommendationType = {
            totalPrice: data.summary.totalPrice || resolvedPartsList.reduce((acc, p) => acc + p.price, 0),
            tdp: data.summary.tdp || 0,
            targetResolution: data.summary.targetResolution || '',
            compatibility: data.summary.compatibility || 'OK',
            parts: resolvedPartsList,
            upgradeTip: data.notes?.upgradeTip || '',
            saveTip: data.notes?.saveTip || ''
         };
         
         setActiveRec(rec);
         
         // Save to localStorage for builder
         if (typeof window !== 'undefined') {
            localStorage.setItem('machi_ai_build', JSON.stringify(data.build));
         }
      }
    } catch (e) {
      console.error('[assistant]', e);
      setMessages(prev => [...prev, {
        id: String(msgIdCounter++),
        role: 'assistant',
        text: "連線至 Lyna AI 核心時發生錯誤，請稍後再試。"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl h-[85vh] flex flex-col">
      <div className="mb-6 flex-shrink-0 pt-8 mt-4 md:mt-0 md:pt-0">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-white">
          <Bot className="w-8 h-8 text-neon-purple" />
          Lyna AI 配機助理
        </h1>
        <p className="text-text-secondary mt-2">使用自然語言描述您的需求，Lyna 將為您提供量身定制的最佳方案。</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left Column: Chat Interface */}
        <div className="flex-1 flex flex-col glass-card rounded-2xl border-white/5 overflow-hidden relative">
          {/* Quick Prompts */}
          <div className="p-4 border-b border-white/5 overflow-x-auto flex gap-2 custom-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-4 py-2 bg-white/5 text-text-secondary text-xs rounded-full border border-white/10 hover:bg-neon-purple/20 hover:text-neon-purple hover:border-neon-purple/30 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar shrink-1 relative">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-neon-purple/20' : 'bg-neon-cyan/20'}`}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-neon-purple" /> : <User className="w-5 h-5 text-neon-cyan" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-neon-cyan/10 text-white border border-neon-cyan/20 rounded-tr-none' 
                      : 'bg-black/50 text-text-primary border border-white/5 rounded-tl-none leading-relaxed'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('**') ? 'font-bold text-white mb-2' : 'mb-1'}>{line.replace(/\*\*/g, '')}</p>
                    ))}
                    
                    {msg.hasRecommendation && (
                      <div className="mt-4 pt-4 border-t border-white/10 text-sm flex gap-3">
                        <button 
                          onClick={() => {
                            if (msg.build) {
                               const buildData = msg.build;
                               const resolvedPartsList = Object.entries(buildData).map(([cat, id]) => {
                                  const part = mockParts.find(p => p.id === String(id));
                                  return {
                                     cat,
                                     name: part ? part.name : String(id),
                                     price: part ? part.price : 0,
                                     reason: 'AI 推薦'
                                  };
                               }).filter(p => !!p.name);

                               const rec: RecommendationType = {
                                  totalPrice: resolvedPartsList.reduce((acc, p) => acc + p.price, 0),
                                  tdp: 0,
                                  targetResolution: '已載入歷程配置',
                                  compatibility: 'OK',
                                  parts: resolvedPartsList,
                                  upgradeTip: '',
                                  saveTip: ''
                               };
                               setActiveRec(rec);
                               localStorage.setItem('machi_ai_build', JSON.stringify(buildData));
                            }
                          }}
                          className="inline-flex items-center gap-1 text-neon-purple font-bold hover:text-white transition-colors"
                        >
                          <Zap className="w-4 h-4" /> 查看此配置
                        </button>
                        <Link href="/builder?preset=ai-gen" className="inline-flex items-center gap-1 text-neon-cyan font-bold hover:text-white transition-colors">
                          <CheckCircle2 className="w-4 h-4" /> 直接採用
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div className="bg-black/50 border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 flex gap-3 items-center">
                    <span className="text-sm text-neon-purple/80 font-medium italic">Lyna 正在幫你抓適合的配置...</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 relative mt-auto">
            <div className="relative">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(inputText); }}}
                placeholder="輸入您的需求或問題..."
                className="w-full bg-transparent border border-white/10 rounded-xl pl-4 pr-14 py-4 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple resize-none min-h-[56px] custom-scrollbar"
                rows={1}
              />
              <button 
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="absolute right-2 bottom-2 w-10 h-10 bg-neon-purple text-white rounded-lg flex items-center justify-center hover:bg-fuchsia-500 disabled:opacity-50 transition-colors"
               >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendation Config */}
        <div className="flex-[0.8] lg:flex-[1.2] lg:max-w-md hidden md:flex flex-col overflow-hidden">
          {activeRec ? (
            <div className="glass-card rounded-2xl border-neon-purple/30 p-1 flex pl-[2px] pr-[2px] flex-col h-full overflow-hidden shadow-[0_0_20px_rgba(188,19,254,0.1)]">
              <div className="p-5 pb-4 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4 text-neon-purple" /> AI 分析結果
                  </h3>
                  <Link href="/builder?preset=ai-gen" className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs font-bold rounded-full border border-neon-cyan/30 hover:bg-neon-cyan hover:text-black transition-colors">
                    帶入配機頁
                  </Link>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] text-text-secondary uppercase">預估總額</span>
                    <div className="font-mono text-2xl font-extrabold text-white mt-1">${activeRec.totalPrice.toLocaleString()}</div>
                  </div>
                  <div className="w-px bg-white/10"></div>
                  <div className="flex-1">
                    <span className="text-[10px] text-text-secondary uppercase">目標定位</span>
                    <div className="font-bold text-sm text-neon-cyan mt-1 leading-tight">{activeRec.targetResolution}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                
                <div className="space-y-4">
                   <h4 className="text-xs font-bold text-text-secondary uppercase flex items-center gap-1">
                     <HardDrive className="w-3 h-3" /> 核心組件推薦
                   </h4>
                   {activeRec.parts.map((p, idx) => (
                     <div key={idx} className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between items-start mb-1">
                           <div>
                              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-text-secondary mr-2">{p.cat}</span>
                              <span className="text-sm font-bold text-white">{p.name}</span>
                           </div>
                           <span className="text-xs font-mono text-emerald-400 font-bold">${p.price.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pl-1 border-l border-neon-purple/30">{p.reason}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-3 pt-2">
                   {activeRec.upgradeTip && (
                   <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
                     <ArrowUpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                     <div>
                       <span className="text-xs font-bold text-amber-500 block mb-1">效能升級建議</span>
                       <span className="text-[11px] text-text-secondary leading-relaxed">{activeRec.upgradeTip}</span>
                     </div>
                   </div>
                   )}
                   {activeRec.saveTip && (
                   <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-3 items-start">
                     <ArrowDownCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                     <div>
                       <span className="text-xs font-bold text-emerald-500 block mb-1">預算精簡方案</span>
                       <span className="text-[11px] text-text-secondary leading-relaxed">{activeRec.saveTip}</span>
                     </div>
                   </div>
                   )}
                </div>

              </div>
            </div>
          ) : (
             <div className="glass-card rounded-2xl border-white/5 p-6 flex flex-col items-center justify-center text-center h-full opacity-60">
                <Activity className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">等待分析中</h3>
                <p className="text-sm text-text-secondary">告訴我您的需求，我將即時生成專業分析與配置建議。</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
