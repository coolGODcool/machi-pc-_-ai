"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Monitor, Video, Box, Gamepad2, BrainCircuit, FileText, Snowflake, TrendingDown, Calculator, Bot, Zap, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-32 px-4 flex flex-col items-center text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-neon-cyan/5 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-neon-purple/5 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="max-w-4xl mx-auto z-10"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            搭載全新 AI 配機決策引擎
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">終極電腦</span>
            <br className="hidden md:block" />
            從這裡開始
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            告別繁瑣的規格相容性困擾！我們提供最智能的自助組裝工具、歷史價格分析與二手殘值估算，讓每一分預算發揮最大價值。
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/builder" 
              className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#00d0eb] transition-all focus:ring-4 focus:ring-neon-cyan/30 flex items-center justify-center gap-2 group"
            >
              <Cpu className="w-5 h-5" />
              立即開始配機
            </Link>
            <Link 
              href="/assistant" 
              className="w-full sm:w-auto px-8 py-4 glass-card font-bold uppercase tracking-wider rounded-xl text-text-primary hover:border-neon-purple hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5 text-neon-purple" />
              使用 Lyna AI
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 用途與預算區塊 */}
      <section className="w-full py-16 px-4 bg-black/30 border-y border-white/5 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* 用途選擇 */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-neon-cyan" />
                </div>
                <h2 className="text-2xl font-bold text-white">你想用電腦做什麼？</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Gamepad2, label: '3A 遊戲', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', preset: '100k' },
                  { icon: Video, label: '影音剪輯', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', preset: 'creator' },
                  { icon: Box, label: '3D 建模', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', preset: 'creator' },
                  { icon: BrainCircuit, label: 'AI 運算', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20', preset: '100k' },
                  { icon: FileText, label: '輕度文書', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', preset: '20k' },
                  { icon: Snowflake, label: '純白主機', color: 'text-slate-200', bg: 'bg-white/10', border: 'border-white/20', preset: '100k' },
                ].map((item, idx) => (
                  <Link href={`/builder?preset=${item.preset}`} key={idx} className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-transform border ${item.border}`}>
                    <div className={`p-3 rounded-full ${item.bg}`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="font-bold text-sm text-text-primary">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 預算選擇 */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">大約預算區間？</h2>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {[
                  { label: '2萬以內', preset: '20k' },
                  { label: '2-3萬', preset: '30k' },
                  { label: '3-5萬', preset: '30k' },
                  { label: '5-8萬', preset: 'creator' },
                  { label: '8-10萬', preset: '100k' },
                  { label: '10萬以上 (旗艦)', preset: '100k' }
                ].map((budget, idx) => (
                  <Link 
                    href={`/builder?preset=${budget.preset}`} 
                    key={idx}
                    className="px-6 py-4 glass-card rounded-xl font-mono text-sm font-bold text-text-primary hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                  >
                    NT$ {budget.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 價格皆參考當前主流市場報價，將隨市場即時浮動。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 熱門推薦配置卡片 */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">🔥 熱門推薦配置</h2>
              <p className="text-text-secondary">本週最多人選擇的菜單，直接套用免煩惱。</p>
            </div>
            <div className="flex items-center gap-4">
               <Link href="/builder" className="hidden sm:flex text-neon-cyan text-sm font-bold items-center gap-1 hover:underline mr-4">
                 看更多 <ArrowUpRight className="w-4 h-4" />
               </Link>
               <div className="flex gap-2">
                 <button 
                    onClick={() => document.getElementById('recommendations-slider')?.scrollBy({ left: -320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                 >
                   &larr;
                 </button>
                 <button 
                    onClick={() => document.getElementById('recommendations-slider')?.scrollBy({ left: 320, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                 >
                   &rarr;
                 </button>
               </div>
            </div>
          </div>

          <div id="recommendations-slider" className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar">
            {[
              { title: '極致 4K 遊戲主機', price: '92,500', cpu: 'i9-14900K', gpu: 'RTX 4090 24GB', tags: ['頂級效能', '光追全開'], preset: '100k' },
              { title: '創作者全能工作站', price: '68,200', cpu: 'Ryzen 9 7950X', gpu: 'RTX 4080 SUPER', tags: ['剪輯渲染', '多工處理'], preset: 'creator' },
              { title: 'CP值 1080p 電競首選', price: '28,500', cpu: 'Ryzen 5 7500F', gpu: 'RX 7600 8GB', tags: ['高性價比', '主流遊戲'], preset: '30k' },
              { title: '輕量級文書主機', price: '18,500', cpu: 'i5-12400', gpu: '內顯', tags: ['辦公', '入門'], preset: '20k' },
            ].map((build, i) => (
              <Link href={`/builder?preset=${build.preset}`} key={i} className="glass-card min-w-[320px] md:min-w-[360px] flex-none snap-start rounded-2xl p-6 flex flex-col group hover:border-neon-cyan transition-colors relative overflow-hidden block">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Zap className="w-24 h-24 group-hover:text-neon-cyan transition-colors" />
                </div>
                <div className="flex gap-2 mb-4">
                  {build.tags.map(t => (
                        <span key={t} className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-white/5 text-text-secondary border border-white/10 group-hover:bg-neon-cyan/10 group-hover:text-neon-cyan group-hover:border-neon-cyan/20 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-6 group-hover:text-neon-cyan transition-colors">{build.title}</h3>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">處理器</span>
                    <span className="font-bold">{build.cpu}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">顯示卡</span>
                    <span className="font-bold">{build.gpu}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">記憶體</span>
                    <span className="font-bold">32GB DDR5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">固態硬碟</span>
                    <span className="font-bold">2TB Gen4</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="font-mono text-xl font-bold text-neon-cyan">$ {build.price}</span>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-neon-cyan group-hover:text-black transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 近期降價與二手估價 */}
      <section className="w-full py-20 px-4 bg-black/40 border-y border-white/5">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 近期熱門降價 */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-green-400" /> 近期跌價追蹤
              </h2>
              <Link href="/trends" className="text-xs font-bold text-neon-cyan uppercase hover:underline">歷史圖表分析 &rarr;</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { name: 'AMD Ryzen 7 7800X3D', cat: 'CPU', old: '14,500', new: '13,500', drop: '-6.8%', query: '7800X3D' },
                { name: 'WD Black SN850X 2TB', cat: 'SSD', old: '5,200', new: '4,500', drop: '-13.4%', query: 'SN850X' },
                { name: 'MSI RTX 4070 Ti SUPER 16G', cat: 'GPU', old: '29,990', new: '28,500', drop: '-4.9%', query: '4070' },
                { name: 'G.Skill Trident Z5 64GB DDR5', cat: 'RAM', old: '7,500', new: '6,800', drop: '-9.3%', query: 'Trident' },
              ].map((item, idx) => (
                <Link href={`/trends?q=${item.query}`} key={idx} className="glass-card p-4 rounded-xl flex items-center justify-between border-l-2 border-l-green-400 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded mr-2">{item.cat}</span>
                    <span className="text-sm font-medium text-white group-hover:text-neon-cyan transition-colors">{item.name}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-text-secondary line-through">${item.old}</span>
                       <span className="font-mono text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">${item.new}</span>
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded mt-1">{item.drop}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 二手估價入口卡片 */}
          <div className="relative">
            {/* Background glowing effect */}
            <div className="absolute inset-0 bg-neon-purple/20 blur-[60px] rounded-full -z-10"></div>
            
            <div className="glass-card border-neon-purple/30 h-full rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-10 -top-10 opacity-10">
                 <RefreshCw className="w-64 h-64 text-neon-purple" />
              </div>
              
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-purple/20 mb-6">
                  <RefreshCw className="w-6 h-6 text-neon-purple" />
                </div>
                <h2 className="text-3xl font-extrabold mb-4">舊機想升級？<br/>先查殘值多少</h2>
                <p className="text-text-secondary leading-relaxed max-w-sm mb-8">
                  輸入你的現有規格或零件，系統會依照市場流通行情、折舊公式計算二手回收與自售的建議價格區間。
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass-card bg-black/40 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-medium">RTX 3080 10GB (使用兩年)</span>
                  <span className="font-mono font-bold text-neon-purple">$ 12,500</span>
                </div>
                <Link href="/trends" className="w-full block text-center py-4 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-bold uppercase tracking-wider rounded-xl hover:bg-neon-purple hover:text-white transition-colors">
                  立刻開始估算
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 配機助理介紹 */}
      <section className="w-full py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Bot className="w-[800px] h-[800px] text-neon-cyan" />
        </div>
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 mb-8 mx-auto -mt-10">
            <Bot className="w-8 h-8 text-neon-cyan" />
          </div>
          <h2 className="text-4xl font-extrabold mb-6">不懂電腦？讓 Lyna AI 來幫你</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12">
            只需像打字聊天一樣描述你的需求（例如：「我想玩 GTA6，預算四萬」），Machi 的智能管家 Lyna AI 就能即時產出最不浪費效能的零組件清單，並自動排查相容性。
          </p>
          <Link href="/assistant" className="inline-flex items-center gap-3 px-8 py-4 glass-card bg-black/50 border-neon-cyan/50 hover:bg-neon-cyan/10 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.15)]">
            <Zap className="w-5 h-5 text-neon-cyan" fill="currentColor" />
            啟動 Lyna AI 助理
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-4 border-t border-white/5 text-center bg-black/50 mt-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-white shadow-[0_0_10px_rgba(0,242,255,0.4)]" style={{ background: 'linear-gradient(135deg, var(--color-neon-cyan), var(--color-neon-purple))' }}>
            MC
          </div>
          <span className="font-bold tracking-wider text-text-primary text-sm flex items-baseline gap-2">
            Machi <span className="text-neon-cyan">PC</span>
            <span className="text-[10px] text-text-secondary uppercase">by Altate</span>
          </span>
        </div>
        <div className="flex justify-center gap-6 text-sm text-text-secondary mb-6">
          <Link href="#" className="hover:text-white transition-colors">關於我們</Link>
          <Link href="#" className="hover:text-white transition-colors">隱私權政策</Link>
          <Link href="#" className="hover:text-white transition-colors">服務條款</Link>
          <Link href="#" className="hover:text-white transition-colors">聯絡客服</Link>
        </div>
        <p className="text-xs text-text-secondary/50">&copy; {new Date().getFullYear()} Altate Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
