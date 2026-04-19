"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, TrendingDown, Clock, PackageCheck, ShieldCheck, CheckSquare, Search, Hexagon } from 'lucide-react';
import { mockParts } from '@/lib/data';

function TrendsContent() {
  const searchParams = useSearchParams();
  const [timeRange, setTimeRange] = useState('30D');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePart, setActivePart] = useState<any>(null);
  
  // Used estimator state
  const [warranty, setWarranty] = useState('active');
  const [condition, setCondition] = useState('good');
  const [box, setBox] = useState('yes');

  useEffect(() => {
     let query = searchParams.get('q');
     if (query) {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setSearchQuery(query);
        const part = mockParts.find(p => p.name.includes(query) || p.id === query);
        if (part) {
           // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
           setActivePart(part);
        } else {
           // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
           setActivePart(mockParts.find(p => p.category === 'GPU'));
        }
     } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setActivePart(mockParts.find(p => p.category === 'GPU'));
     }
     window.scrollTo({ top: 0, behavior: 'smooth' });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handle Search Input Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const part = mockParts.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (part) setActivePart(part);
  };

  // Generate Fake Trend Data based on part and timeRange
  const trendData = useMemo(() => {
     if (!activePart) return [];
     const basePrice = activePart.price;
     let points = 6;
     let variance = 0.05;
     
     if (timeRange === '30D') { points = 10; variance = 0.02; }
     if (timeRange === '90D') { points = 12; variance = 0.05; }
     if (timeRange === '1Y') { points = 12; variance = 0.15; }

     // Use a pseudo-random function so it's pure during render
     const pseudoRandom = (seed: number) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
     };

     const data = [];
     for(let i=0; i<points; i++) {
        // use pseudo random based on part id and index
        const seed = activePart.id.charCodeAt(0) + i;
        const rand = 1 + (pseudoRandom(seed) * variance * 2 - variance);
        const price = Math.round((basePrice * rand) / 100) * 100;
        data.push({
           date: timeRange === '30D' ? `Day ${i*3+1}` : timeRange === '90D' ? `Week ${i+1}` : `M${i+1}`,
           price: i === points - 1 ? basePrice : price, // current price at the end
           avg: Math.round(basePrice * 1.05 / 100) * 100
        });
     }
     return data;
  }, [activePart, timeRange]);

  const maxPrice = trendData.length > 0 ? Math.max(...trendData.map(d => d.price)) : 0;
  const minPrice = trendData.length > 0 ? Math.min(...trendData.map(d => d.price)) : 0;
  const avgPrice = trendData.length > 0 ? Math.round(trendData.reduce((s, d) => s + d.price, 0) / trendData.length) : 0;

  // Used Valuation Logic
  const usedValuation = useMemo(() => {
     if (!activePart) return { min: 0, max: 0, ratio: 0 };
     let baseMultiplier = 0.8;
     
     if (warranty === 'none') baseMultiplier -= 0.15;
     if (box === 'no') baseMultiplier -= 0.05;
     if (condition === 'poor') baseMultiplier -= 0.15;
     if (condition === 'good') baseMultiplier -= 0.05;
     if (condition === 'like-new') baseMultiplier += 0.05;

     const min = Math.round((activePart.price * (baseMultiplier - 0.05)) / 100) * 100;
     const max = Math.round((activePart.price * (baseMultiplier + 0.05)) / 100) * 100;
     
     return { min, max, ratio: Math.round(((min + max)/2 / activePart.price) * 100) };
  }, [activePart, warranty, condition, box]);

  if (!activePart) return <div className="flex-1 container mx-auto px-4 py-8">載入中...</div>;

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-neon-purple" />
          價格趨勢與二手估價
        </h1>
        <p className="text-text-secondary mt-2">掌握硬體市場波動，智能評估即時殘值，精準抓住買賣絕佳時機。</p>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-secondary" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-24 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple shadow-inner transition-colors"
          placeholder="搜尋零件名稱 (例如: RTX 4070)..."
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button type="submit" className="px-4 py-1.5 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded-lg border border-neon-purple/30 hover:bg-neon-purple hover:text-white transition-colors">搜尋</button>
        </div>
      </form>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Market Analysis */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* Target Part Header */}
          <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-white/5 border-l-2 border-l-neon-purple">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
               <div className="w-16 h-16 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                 <Hexagon className="w-8 h-8 text-neon-purple/40" />
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">{activePart.category}</span>
                   <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                     {activePart.price <= avgPrice ? '適合入手 (目前價位偏低)' : '價位正常'}
                   </span>
                 </div>
                 <h2 className="text-2xl font-bold text-white">{activePart.name}</h2>
                 <p className="text-sm text-text-secondary mt-1">
                    {Object.entries(activePart.specs).map(([k,v]) => `${k}: ${v}`).join(' | ')}
                 </p>
               </div>
            </div>
            
            <div className="flex flex-col items-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
              <span className="text-[10px] text-text-secondary uppercase mb-1">目前新品市價</span>
              <span className="text-3xl font-mono font-extrabold text-neon-cyan">$ {activePart.price.toLocaleString()}</span>
              {activePart.price < avgPrice && (
                 <span className="text-xs text-text-secondary mt-1">較平均價 <span className="text-emerald-400">-{Math.round((1 - activePart.price/avgPrice)*100)}%</span></span>
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="glass-card rounded-2xl p-6 border-white/5">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h3 className="font-bold text-lg text-white">歷史價格走勢</h3>
                <div className="bg-black/50 p-1 rounded-lg border border-white/5 flex">
                  {['30D', '90D', '1Y'].map(range => (
                    <button 
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${timeRange === range ? 'bg-white/10 text-white shadow-sm' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
             </div>

             <div className="h-[320px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice紫" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-neon-purple)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-neon-purple)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace'}} axisLine={false} tickLine={false} width={65} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(188,19,254,0.3)', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                      labelStyle={{ color: '#8a8d9b', marginBottom: '4px' }}
                      formatter={(value: any) => [`$ ${Number(value).toLocaleString()}`, '市價']}
                    />
                    <Area type="monotone" dataKey="price" stroke="var(--color-neon-purple)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice紫)" activeDot={{ r: 6, fill: "var(--color-neon-purple)", stroke: "#fff", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-text-secondary uppercase mb-1">近期最高價</span>
                  <span className="font-mono text-lg font-bold text-white">$ {maxPrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l w-full border-white/5 pt-4 sm:pt-0">
                  <span className="text-xs text-text-secondary uppercase mb-1">近期最低價</span>
                  <span className="font-mono text-lg font-bold text-white">$ {minPrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l w-full border-white/5 pt-4 sm:pt-0">
                  <span className="text-xs text-text-secondary uppercase mb-1">{timeRange} 平均價</span>
                  <span className="font-mono text-lg font-bold text-text-secondary">$ {avgPrice.toLocaleString()}</span>
                </div>
             </div>
          </div>

          <div className="glass-card bg-emerald-500/10 border-emerald-500/30 rounded-xl p-4 flex items-start gap-4">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-400 mb-1">系統建議購買時機：{activePart.price <= avgPrice ? '適合入手' : '建議觀望'}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                目前價格處於過去 {timeRange} 的{activePart.price <= minPrice ? '最低點，現在是絕佳的購買時機' : activePart.price >= maxPrice ? '最高點，建議等待價格回落或尋找替代品。' : '合理區間。'}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Used Valuator */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           <div className="glass-card rounded-2xl p-6 border-white/5 sticky top-24 overflow-hidden relative">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
               二手殘值估算器 <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary uppercase">BETA</span>
             </h3>
             <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
                   <ShieldCheck className="w-48 h-48 text-neon-cyan" />
             </div>

             {/* Result Area */}
             <div className="bg-black/40 rounded-xl p-6 mb-8 text-center border border-white/5 relative z-10 box-border border-b-2 border-b-neon-cyan/50">
                <p className="text-xs text-text-secondary uppercase mb-2">建議自售行情區間</p>
                <div className="font-mono text-3xl font-extrabold text-neon-cyan mb-2 flex items-center justify-center gap-2">
                  <span className="truncate">${usedValuation.min.toLocaleString()}</span> 
                  <span className="text-lg text-text-secondary font-normal">~</span> 
                  <span className="truncate">${usedValuation.max.toLocaleString()}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                  <TrendingDown className="w-3 h-3" /> 目前估計殘值：新品售價之 {usedValuation.ratio}%
                </div>
             </div>

             {/* Forms */}
             <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-text-secondary flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" /> 保固狀態因素
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setWarranty('active')} className={`py-2 text-xs font-bold rounded-lg border transition-colors ${warranty === 'active' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>保固內</button>
                    <button onClick={() => setWarranty('none')} className={`py-2 text-xs font-bold rounded-lg border transition-colors ${warranty === 'none' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>已過保/無證明</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary flex items-center gap-2 mb-3">
                    <PackageCheck className="w-4 h-4" /> 原廠盒裝完整度
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setBox('yes')} className={`py-2 text-xs font-bold rounded-lg border transition-colors ${box === 'yes' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>盒單齊全</button>
                    <button onClick={() => setBox('no')} className={`py-2 text-xs font-bold rounded-lg border transition-colors ${box === 'no' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>遺失/僅裸零件</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary flex items-center gap-2 mb-3">
                    <CheckSquare className="w-4 h-4" /> 外觀與品項狀態
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setCondition('like-new')} className={`py-2 px-1 text-[10px] uppercase font-bold rounded-lg border transition-colors ${condition === 'like-new' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>極新 (無氧化)</button>
                    <button onClick={() => setCondition('good')} className={`py-2 px-1 text-[10px] uppercase font-bold rounded-lg border transition-colors ${condition === 'good' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>正常使用痕跡</button>
                    <button onClick={() => setCondition('poor')} className={`py-2 px-1 text-[10px] uppercase font-bold rounded-lg border transition-colors ${condition === 'poor' ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'bg-transparent border-white/10 text-text-secondary hover:border-white/30 hover:text-white'}`}>外觀不佳/需清潔</button>
                  </div>
                </div>
                
                <p className="text-[10px] text-text-secondary/50 pt-2 border-t border-white/5 leading-relaxed">
                  * 估價模型基於近三個月各大二手交易社團與賣場之平均成交資料，並套用衰退折扣率計算。實際交易價格仍會受當下買賣方議價、急售等市場狀況影響。
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function TrendsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex justify-center items-center h-[50vh]"><div className="animate-spin w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full"></div></div>}>
       <TrendsContent />
    </Suspense>
  )
}
