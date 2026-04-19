import Link from 'next/link';
import { Cpu, Terminal, TrendingUp, CpuIcon } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[rgba(10,10,15,0.8)] backdrop-blur-[10px]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,242,255,0.4)]" style={{ background: 'linear-gradient(135deg, var(--color-neon-cyan), var(--color-neon-purple))' }}>
            MC
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-text-primary leading-tight">
              Machi <span className="text-neon-cyan">PC</span>
            </span>
            <span className="text-[9px] text-text-secondary uppercase tracking-[0.2em] leading-tight">by Altate</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
            首頁
          </Link>
          <Link href="/builder" className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
            自助配機
          </Link>
          <Link href="/trends" className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
            價格趨勢
          </Link>
          <Link href="/trends" className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
            二手估價
          </Link>
          <Link href="/assistant" className="text-neon-purple/80 hover:text-neon-purple transition-colors flex items-center gap-2 font-bold">
            Lyna AI
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors">
            登入
          </button>
          <Link href="/builder" className="hidden md:block text-xs font-bold uppercase tracking-wider px-5 py-2 bg-white text-black rounded-full hover:bg-slate-200 transition-colors">
            開始配機
          </Link>
        </div>
      </div>
    </header>
  );
}
