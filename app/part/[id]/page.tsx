import Link from 'next/link';
import { ArrowLeft, CheckCircle, Package, TrendingDown, Cpu, ShieldCheck } from 'lucide-react';
import { mockParts } from '@/lib/data';

export default async function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object itself before accessing properties
  const { id } = await params;
  
  const part = mockParts.find(p => p.id === id);
  
  if (!part) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">找不到該零件</h1>
        <Link href="/builder" className="text-neon-cyan hover:underline">返回配機</Link>
      </div>
    );
  }

  // Find alternative parts
  const alternatives = mockParts
     .filter(p => p.category === part.category && p.id !== part.id)
     .sort((a,b) => Math.abs(a.price - part.price) - Math.abs(b.price - part.price))
     .slice(0, 3);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/builder" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> 返回配機列表
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Placeholder image representation */}
        <div className="w-full md:w-1/3 aspect-square glass-card rounded-2xl flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/5 to-neon-cyan/5"></div>
           <Cpu className="w-32 h-32 text-white/10 group-hover:text-neon-cyan/20 transition-colors" />
        </div>
        
        {/* Details core */}
        <div className="flex-1 flex flex-col pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-white/10 text-text-secondary">{part.category}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">現貨庫存中</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">{part.name}</h1>
          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-mono font-bold text-neon-cyan">$ {part.price.toLocaleString()}</span>
            <span className="text-sm text-text-secondary line-through mb-1 border-b border-dashed border-text-secondary/50 pb-0.5 cursor-help" title="三個月前定價">$ {(part.price * 1.1).toLocaleString()}</span>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-auto">
             {Object.entries(part.specs).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-text-secondary uppercase mb-1">{k}</span>
                  <span className="text-sm font-bold text-white">{v as string}</span>
                </div>
             ))}
             {part.tdp && (
                 <div className="flex flex-col">
                   <span className="text-xs text-text-secondary uppercase mb-1">功耗 (TDP)</span>
                   <span className="text-sm font-bold text-white">{part.tdp} W</span>
                 </div>
             )}
          </div>
          
          <div className="flex gap-4">
            <Link href="/builder" className="h-12 px-8 rounded-xl bg-neon-cyan text-black font-bold flex items-center justify-center hover:bg-[#00d0eb] transition-colors gap-2">
              <CheckCircle className="w-5 h-5" />
              加入配置清單
            </Link>
            <Link href={`/trends?q=${encodeURIComponent(part.name)}`} className="h-12 px-6 rounded-xl border border-neon-purple text-neon-purple font-bold flex items-center justify-center hover:bg-neon-purple hover:text-white transition-colors gap-2">
              <TrendingDown className="w-5 h-5" />
              價格趨勢與估價
            </Link>
          </div>
        </div>
      </div>
      
      {/* Information sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-6 rounded-2xl border-white/5">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-neon-cyan" /> 產品簡介</h3>
               <p className="text-text-secondary leading-relaxed mb-4">
                 這是來自頂級大廠的最新款 {part.category}。該零件運用了先進的製程與架構，帶來極致的效能表現。無論是應付高強度 3A 遊戲，或者是複雜的影音剪輯、AI 深度學習運算，皆能提供優秀的性價比。
               </p>
               <p className="text-text-secondary leading-relaxed">
                 搭載多項相容性防護設計，支援各大主流主機板與機箱，安裝簡單快速。原廠提供完整的保固售後服務，讓您用得安心。
               </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border-white/5 border-l-2 border-l-emerald-400">
               <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> 相容性指南</h3>
               <p className="text-sm text-text-secondary mb-4">以下是系統針對此零件自動抓取的相容性特徵：</p>
               <div className="flex flex-wrap gap-2">
                 {part.compatibilityTags.map(tag => (
                   <span key={tag} className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold border border-emerald-400/20">{tag}</span>
                 ))}
                 {part.tdp && <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20">需求散熱或供電 &gt; {part.tdp}W</span>}
               </div>
            </div>
         </div>
         
         <div className="space-y-6">
            <h3 className="text-lg font-bold">市場替代品推薦</h3>
            {alternatives.map(alt => (
              <Link href={`/part/${alt.id}`} key={alt.id} className="glass-card p-4 rounded-xl flex flex-col group hover:border-neon-cyan transition-colors h-full justify-between">
                <div>
                   <h4 className="font-bold text-sm text-white group-hover:text-neon-cyan transition-colors mb-2 line-clamp-2">{alt.name}</h4>
                   <div className="flex gap-2 text-xs text-text-secondary">
                      {Object.values(alt.specs).slice(0, 2).map((val, i) => (
                         <span key={i} className="truncate">{val as string}</span>
                      ))}
                   </div>
                </div>
                <div className="mt-3 flex justify-between items-center text-sm font-mono text-neon-cyan">
                   <span>$ {alt.price.toLocaleString()}</span>
                   <span className="text-[10px] bg-white/10 text-text-secondary px-1.5 py-0.5 rounded uppercase group-hover:bg-neon-cyan group-hover:text-black transition-colors">Compare</span>
                </div>
              </Link>
            ))}
         </div>
      </div>
    </div>
  );
}
