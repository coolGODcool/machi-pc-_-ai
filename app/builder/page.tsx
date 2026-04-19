"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, AlertTriangle, XCircle, Trash2, Zap, Settings2, Share2, Save, ArrowLeft,
  Search, Hexagon, PieChart, ChevronRight, X, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Part, mockParts, PartCategory, CATEGORIES } from '@/lib/data';
import Link from 'next/link';

function BuilderContent() {
  const searchParams = useSearchParams();
  const [selectedParts, setSelectedParts] = useState<Record<string, Part | null>>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: null }), {})
  );
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);
  const [targetBudget, setTargetBudget] = useState(50000);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [upgradeAnalysis, setUpgradeAnalysis] = useState<{
    oldPart: Part;
    newPart: Part;
    gamingDelta: number;
    aiDelta: number;
    powerDelta: number;
    priceDelta: number;
    isCase: boolean;
    recommendation: string;
  } | null>(null);
  
  const topRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Preset Mapping
  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset) {
      let b = 50000;
      let newSelection: Record<string, Part | null> = { ...selectedParts };
      let msg = '';
      if (preset === '20k') {
        b = 20000;
        newSelection = {
          ...newSelection,
          CPU: mockParts.find(p => p.id === 'cpu-4') || null,
          GPU: mockParts.find(p => p.id === 'gpu-4') || null,
          Motherboard: mockParts.find(p => p.id === 'mb-4') || null,
          RAM: mockParts.find(p => p.id === 'ram-3') || null,
          SSD: mockParts.find(p => p.id === 'ssd-2') || null,
          PSU: mockParts.find(p => p.id === 'psu-3') || null,
          Case: mockParts.find(p => p.id === 'case-2') || null,
          Cooler: mockParts.find(p => p.id === 'cooler-2') || null,
        };
        msg = '已為你載入 2 萬元的高性價比配置';
      } else if (preset === '30k') {
        b = 30000;
        newSelection = {
          ...newSelection,
          CPU: mockParts.find(p => p.id === 'cpu-3') || null,
          GPU: mockParts.find(p => p.id === 'gpu-3') || null,
          Motherboard: mockParts.find(p => p.id === 'mb-3') || null,
          RAM: mockParts.find(p => p.id === 'ram-2') || null,
          SSD: mockParts.find(p => p.id === 'ssd-1') || null,
          PSU: mockParts.find(p => p.id === 'psu-2') || null,
          Case: mockParts.find(p => p.id === 'case-2') || null,
          Cooler: mockParts.find(p => p.id === 'cooler-2') || null,
        };
        msg = '已為你載入 3 萬元主流遊戲配置';
      } else if (preset === '100k') {
        b = 100000;
        newSelection = {
          ...newSelection,
          CPU: mockParts.find(p => p.id === 'cpu-1') || null,
          GPU: mockParts.find(p => p.id === 'gpu-1') || null,
          Motherboard: mockParts.find(p => p.id === 'mb-1') || null,
          RAM: mockParts.find(p => p.id === 'ram-1') || null,
          SSD: mockParts.find(p => p.id === 'ssd-1') || null,
          PSU: mockParts.find(p => p.id === 'psu-1') || null,
          Case: mockParts.find(p => p.id === 'case-1') || null,
          Cooler: mockParts.find(p => p.id === 'cooler-1') || null,
        };
        msg = '已為你載入巔峰效能極致配置';
      } else if (preset === 'creator') {
        b = 68200;
        newSelection = {
          ...newSelection,
          CPU: mockParts.find(p => p.id === 'cpu-2') || null, // fallback
          GPU: mockParts.find(p => p.id === 'gpu-3') || null,
          Motherboard: mockParts.find(p => p.id === 'mb-1') || null,
          RAM: mockParts.find(p => p.id === 'ram-1') || null,
          SSD: mockParts.find(p => p.id === 'ssd-1') || null,
          PSU: mockParts.find(p => p.id === 'psu-2') || null,
        };
        msg = '已為你載入創作者全能渲染配置';
      } else if (preset === 'ai-gen') {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('machi_ai_build') : null;
        // Reset all categories for fresh start
        CATEGORIES.forEach(cat => { newSelection[cat] = null; });
        
        if (stored) {
           try {
              const buildObj = JSON.parse(stored);
              CATEGORIES.forEach(cat => {
                 if (buildObj[cat]) {
                    newSelection[cat] = mockParts.find(p => p.id === buildObj[cat]) || null;
                 }
              });
              msg = '已為你載入 Lyna AI 最新生成的推薦配置！';
           } catch {
              msg = '讀取推薦配置失敗。';
           }
        } else {
           msg = '找不到推薦配置。';
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setSelectedParts(newSelection);
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setTargetBudget(b);
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      setToastMessage(msg);
      setTimeout(() => setToastMessage(''), 3000);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Computations
  const totalPrice = Object.values(selectedParts).reduce((sum, part) => sum + (part?.price || 0), 0);
  const totalTdp = Object.values(selectedParts).reduce((sum, part) => sum + (part?.category !== 'PSU' ? part?.tdp || 0 : 0), 0) + 50; 
  const psuWattage = selectedParts['PSU']?.tdp || 0; 
  const budgetDiff = targetBudget - totalPrice;
  const missingParts = CATEGORIES.filter(cat => !selectedParts[cat]);

  // Advanced Compatibility logic
  const compatibility = useMemo(() => {
    const cpu = selectedParts['CPU'];
    const mobo = selectedParts['Motherboard'];
    const ram = selectedParts['RAM'];
    const psu = selectedParts['PSU'];
    const cooler = selectedParts['Cooler'];
    const issues = [];
    let status: 'success' | 'warning' | 'error' = 'success';

    // Socket matching
    if (cpu && mobo) {
      const isLGA1700 = cpu.compatibilityTags.includes('lga1700') && mobo.compatibilityTags.includes('lga1700');
      const isAM5 = cpu.compatibilityTags.includes('am5') && mobo.compatibilityTags.includes('am5');
      if (!isLGA1700 && !isAM5) {
        issues.push(`嚴重：CPU (${cpu.compatibilityTags.includes('lga1700') ? 'LGA1700' : 'AM5'}) 與 主機板 (${mobo.compatibilityTags.includes('lga1700') ? 'LGA1700' : mobo.compatibilityTags.includes('am5') ? 'AM5' : '未知'}) 腳位互相衝突。`);
        status = 'error';
      }
    }

    // RAM matching
    if (mobo && ram) {
      const isDDR4 = mobo.compatibilityTags.includes('ddr4') && ram.compatibilityTags.includes('ddr4');
      const isDDR5 = mobo.compatibilityTags.includes('ddr5') && ram.compatibilityTags.includes('ddr5');
      if (!isDDR4 && !isDDR5) {
        issues.push(`嚴重：記憶體類型不相容。主機板支援 ${mobo.compatibilityTags.includes('ddr5') ? 'DDR5' : 'DDR4'}，但選擇了 ${ram.compatibilityTags.includes('ddr5') ? 'DDR5' : 'DDR4'} 記憶體。`);
        status = 'error';
      }
    }

    // Cooler Socket
    if (cpu && cooler) {
      const isLGA1700 = cpu.compatibilityTags.includes('lga1700') && cooler.compatibilityTags.includes('lga1700');
      const isAM5 = cpu.compatibilityTags.includes('am5') && cooler.compatibilityTags.includes('am5');
      if (!isLGA1700 && !isAM5) {
        issues.push(`注意：散熱器扣具可能不支援目前 CPU 的腳位 (${cpu.compatibilityTags.includes('lga1700') ? 'LGA1700' : 'AM5'})。`);
        if (status !== 'error') status = 'warning';
      }
    }

    // Case check
    const pcCase = selectedParts['Case'];
    if (pcCase && mobo) {
       const isEATX = mobo.compatibilityTags.includes('e-atx');
       if (isEATX && !pcCase.compatibilityTags.includes('e-atx')) {
          issues.push('嚴重：主機板尺寸為 E-ATX，但機殼無法容納。');
          status = 'error';
       }
    }

    // PSU Wattage limit
    if (psu && totalTdp > psuWattage) {
        issues.push(`嚴重：系統估計瓦數 ${totalTdp}W，大於所選電源 ${psuWattage}W，可能導致斷電。`);
        status = 'error';
    } else if (psu && totalTdp > psuWattage * 0.8) {
        issues.push(`注意：電源安全餘裕較低，建議更換更大瓦數的電源供應器。`);
        if (status !== 'error') status = 'warning';
    }
    
    if (Object.values(selectedParts).every(p => p === null)) {
      status = 'warning';
      issues.push('請先選擇零件以檢查相容性。');
    } else if (status === 'success' && missingParts.length > 0) {
      status = 'warning';
    } else if (status === 'success') {
       issues.push('目前所有組件相容性檢查通過，可順利運作。');
    }

    return { status, issues };
  }, [selectedParts, missingParts.length, totalTdp, psuWattage]);

  // Usage Match Logic
  const usageMatch = useMemo(() => {
     if (!selectedParts['CPU'] || !selectedParts['GPU']) return { label: '缺核心件，無法評估', score: 0, color: 'text-slate-500', bg: 'w-0' };
     const cost = (selectedParts['CPU'].price + selectedParts['GPU'].price);
     if (cost > 50000) return { label: '極致 4K 遊戲 / 專業渲染', score: 98, color: 'text-neon-cyan', bg: 'w-[98%] bg-neon-cyan' };
     if (cost > 30000) return { label: '2K 光追遊戲 / 高階剪輯', score: 85, color: 'text-green-400', bg: 'w-[85%] bg-green-400' };
     if (cost > 15000) return { label: '1080p 主流遊戲 / 日常文書', score: 65, color: 'text-amber-400', bg: 'w-[65%] bg-amber-400' };
     return { label: '輕度使用 / 網頁瀏覽', score: 45, color: 'text-rose-400', bg: 'w-[45%] bg-rose-400' };
  }, [selectedParts]);


  const handleSelect = (part: Part) => {
    const oldPart = selectedParts[part.category];
    if (oldPart && oldPart.id !== part.id) {
       // Upgrade/Downgrade analysis
       const powerDelta = part.tdp - oldPart.tdp;
       const priceDelta = part.price - oldPart.price;
       let gamingDelta = Math.round((priceDelta / oldPart.price) * 100) || 0;
       let aiDelta = Math.round((priceDelta / oldPart.price) * 120) || 0;
       if (gamingDelta > 100) gamingDelta = 85; 
       if (aiDelta > 100) aiDelta = 90;
       
       const isCase = part.category === 'Case';
       let recommendation = '';
       if (isCase) {
         recommendation = '機殼更換將改變主機板與散熱器相容空間，請注意散熱與安裝餘裕。';
       } else if (part.category === 'PSU') {
         recommendation = priceDelta > 0 ? '更高瓦數或轉換效率的電源，能提供更穩定的高負載運作空間。' : '較低瓦數電源，請確認總功耗是否安全。';
       } else {
         recommendation = gamingDelta > 0 
           ? `效能預估提升，更適合 ${part.category === 'GPU' ? '高畫質光追遊戲與 AI 推論' : '多工處理與高效能運算'}。` 
           : `效能可能略微下降，但${powerDelta < 0 ? '更省電，且' : ''}能節省 ${Math.abs(priceDelta)} 元，適合輕度使用。`;
       }
       
       setUpgradeAnalysis({
         oldPart,
         newPart: part,
         gamingDelta: isCase ? 0 : gamingDelta,
         aiDelta: isCase ? 0 : aiDelta,
         powerDelta,
         priceDelta,
         isCase,
         recommendation
       });
    }

    setSelectedParts(prev => ({ ...prev, [part.category]: part }));
    setActiveCategory(null);
    setSearchQuery('');
    
    // Auto-scroll to next missing item
    const nextMissing = CATEGORIES.find(cat => cat !== part.category && !selectedParts[cat] && part.category !== cat);
    if (nextMissing) {
       setTimeout(() => {
          itemRefs.current[nextMissing]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }, 300);
    } else {
       setTimeout(() => {
          topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 300);
    }
  };

  const handleRemove = (category: PartCategory) => {
    setSelectedParts(prev => ({ ...prev, [category]: null }));
  };

  const availableParts = activeCategory 
    ? mockParts.filter(p => p.category === activeCategory && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 py-8 max-w-7xl relative" ref={topRef}>
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neon-cyan/20 border border-neon-cyan/50 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <CheckCircle2 className="w-5 h-5 text-neon-cyan" />
            <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
        
        {upgradeAnalysis && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-card border border-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl w-[340px]"
          >
            <button onClick={() => setUpgradeAnalysis(null)} className="absolute top-4 right-4 text-text-secondary hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-neon-cyan font-bold flex items-center gap-2 mb-4">
               <TrendingUp className="w-5 h-5" />
               升級分析
            </h3>
            
            <div className="flex flex-col gap-3 mb-4">
               <div className="text-sm">
                  <div className="text-text-secondary text-xs mb-1">從</div>
                  <div className="truncate text-white font-medium">{upgradeAnalysis.oldPart.name}</div>
               </div>
               <div className="text-sm">
                  <div className="text-text-secondary text-xs mb-1">替換為</div>
                  <div className="truncate text-white font-bold">{upgradeAnalysis.newPart.name}</div>
               </div>
            </div>
            
            <div className="bg-bg-dark rounded-lg p-3 grid grid-cols-2 gap-2 mb-4">
               {!upgradeAnalysis.isCase && (
                  <>
                    <div className="flex flex-col">
                       <span className="text-xs text-text-secondary">遊戲效能</span>
                       <span className={`font-bold ${upgradeAnalysis.gamingDelta > 0 ? 'text-green-400' : upgradeAnalysis.gamingDelta < 0 ? 'text-rose-400' : 'text-text-secondary'}`}>
                         {upgradeAnalysis.gamingDelta > 0 ? '+' : ''}{upgradeAnalysis.gamingDelta}%
                       </span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-xs text-text-secondary">AI / 運算</span>
                       <span className={`font-bold ${upgradeAnalysis.aiDelta > 0 ? 'text-neon-purple' : upgradeAnalysis.aiDelta < 0 ? 'text-rose-400' : 'text-text-secondary'}`}>
                         {upgradeAnalysis.aiDelta > 0 ? '+' : ''}{upgradeAnalysis.aiDelta}%
                       </span>
                    </div>
                  </>
               )}
               <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">預估功耗</span>
                  <span className={`font-bold ${upgradeAnalysis.powerDelta > 0 ? 'text-rose-400' : upgradeAnalysis.powerDelta < 0 ? 'text-green-400' : 'text-text-secondary'}`}>
                    {upgradeAnalysis.powerDelta > 0 ? '+' : ''}{upgradeAnalysis.powerDelta}W
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">價格差異</span>
                  <span className={`font-bold ${upgradeAnalysis.priceDelta > 0 ? 'text-rose-400' : upgradeAnalysis.priceDelta < 0 ? 'text-green-400' : 'text-text-secondary'}`}>
                    {upgradeAnalysis.priceDelta > 0 ? '+' : ''}{upgradeAnalysis.priceDelta}
                  </span>
               </div>
            </div>
            
            <div className="text-sm text-text-secondary leading-relaxed border-t border-white/10 pt-3">
               {upgradeAnalysis.recommendation}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
         <Link href="/" className="hover:text-white cursor-pointer">首頁</Link> <ChevronRight className="w-3 h-3" />
         <span className="text-neon-cyan">自助配機 {activeCategory ? ` / 選擇 ${activeCategory}` : ''}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-neon-cyan" />
          進階自助配機系統
        </h1>
        <p className="text-text-secondary mt-2">選擇您的零件，系統將即時計算總預算、功耗與相容性匹配度。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Categories Nav */}
        <div className="hidden lg:flex flex-col gap-2 relative col-span-2">
          <div className="glass-card rounded-2xl p-4 sticky top-24 border-white/5">
            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-4 pl-2 font-mono">Build Index</h3>
            
            <button 
              onClick={() => { setActiveCategory(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${!activeCategory ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_10px_rgba(0,242,255,0.1)]' : 'text-text-primary hover:bg-white/5 border border-transparent'}`}
            >
               <span>全部配置</span>
            </button>
            <div className="my-2 border-t border-white/5"></div>
            
            <div className="flex flex-col gap-1">
              {CATEGORIES.map(cat => {
                 const isSelected = selectedParts[cat] !== null;
                 return (
                   <button 
                    key={cat}
                    onClick={() => { setActiveCategory(cat); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
                   >
                     <span className="flex items-center gap-3">
                        {isSelected ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                        {cat}
                     </span>
                   </button>
                 )
              })}
            </div>
          </div>
        </div>

        {/* Middle Column: Selected Parts List OR Part Selection */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!activeCategory ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-3"
              >
                {CATEGORIES.map(category => {
                  const part = selectedParts[category];
                  const brand = part ? part.name.split(' ')[0] : '';
                  const specs = part ? Object.entries(part.specs).map(([k,v]) => `${k}: ${v}`).join(' | ') : '';
                  
                  // highlight missing parts
                  const isMissing = !part;
                  
                  return (
                    <div 
                       key={category} 
                       ref={el => { itemRefs.current[category] = el; }}
                       className={`glass-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all border ${part ? 'border-white/10 hover:border-white/30' : 'border-neon-purple/50 bg-neon-purple/5 shadow-[0_0_15px_rgba(188,19,254,0.1)]'}`}
                    >
                      <div className={`w-14 h-14 shrink-0 rounded flex items-center justify-center font-bold text-[10px] ${part ? 'bg-white/5 text-text-secondary' : 'bg-transparent text-text-secondary w-14'}`}>
                         {category}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {part ? (
                           <>
                             <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white truncate">{brand}</span>
                               <span className="font-bold text-white text-sm lg:text-base truncate">{part.name}</span>
                             </div>
                             <p className="text-[11px] text-text-secondary truncate mt-1">{specs}</p>
                           </>
                        ) : (
                           <div className="text-neon-purple text-sm font-bold flex items-center gap-2">
                             尚未選擇 {category}
                             <span className="animate-ping w-1.5 h-1.5 rounded-full bg-neon-purple inline-block"></span>
                           </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0 lg:pl-0">
                         {part ? (
                           <span className="font-mono font-bold text-neon-cyan tracking-wider">$ {part.price.toLocaleString()}</span>
                         ) : <div className="w-16"></div>}
                         <div className="flex items-center gap-2 shrink-0">
                           <button 
                             onClick={() => { setActiveCategory(category); window.scrollTo({ top: 0, behavior: 'smooth'}); }}
                             className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${part ? 'border border-white/20 hover:border-white hover:text-white text-text-secondary' : 'bg-neon-purple/20 border border-neon-purple/50 text-neon-purple hover:bg-neon-purple hover:text-white'}`}
                           >
                              {part ? '更換' : `選擇`}
                           </button>
                           {part && (
                             <button 
                               onClick={() => handleRemove(category)}
                               className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                         </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="library"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-card rounded-2xl p-6 flex flex-col h-full border-white/5 relative"
              >
                <div className="flex items-center flex-wrap gap-4 mb-6 sticky top-0 bg-[rgba(10,10,15,0.9)] backdrop-blur-md z-10 py-2 border-b border-white/10 -mx-6 px-6 -mt-6 pt-6">
                  <button onClick={() => { setActiveCategory(null); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className="px-3 py-1.5 hover:bg-white/5 border border-white/20 flex items-center gap-2 rounded-lg text-white hover:border-neon-cyan transition-all text-xs font-bold">
                    <ArrowLeft className="w-4 h-4" /> 返回清單
                  </button>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    選擇 <span className="text-neon-cyan">{activeCategory}</span>
                  </h2>
                  <div className="relative ml-auto w-full sm:w-48 mt-2 sm:mt-0">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="尋找零件..." 
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-3 pt-2">
                  {availableParts.length === 0 ? (
                    <div className="text-center text-slate-500 py-12 text-sm">
                      查無匹配的零件
                    </div>
                  ) : (
                    availableParts.map(part => (
                      <div key={part.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-neon-cyan/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">{part.name}</h4>
                          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                             {Object.entries(part.specs).map(([k,v]) => (
                               <span key={k} className="bg-black/30 px-1.5 py-0.5 rounded">{k}: {v}</span>
                             ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 mt-2 sm:mt-0 min-w-28">
                           <span className="font-mono font-bold text-emerald-400">$ {part.price.toLocaleString()}</span>
                           <div className="flex gap-2">
                             <Link href={`/part/${part.id}`} className="px-3 py-1.5 bg-black/40 text-text-secondary text-xs font-bold rounded border border-white/10 hover:bg-white/10 hover:text-white transition-colors" target="_blank">
                               詳情
                             </Link>
                             <button 
                               onClick={() => handleSelect(part)}
                               className="px-4 py-1.5 bg-neon-cyan/10 text-neon-cyan text-xs font-bold rounded border border-neon-cyan/30 hover:bg-neon-cyan hover:text-black transition-colors"
                             >
                               選取
                             </button>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Dashboard Summary */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          
          <div className="glass-card rounded-2xl p-5 border-white/5 sticky top-24">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-neon-purple" /> 預算摘要
            </h3>
            
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider">配單總價</span>
              <span className="text-4xl font-mono font-extrabold text-white text-shadow-sm">$ {totalPrice.toLocaleString()}</span>
              {targetBudget > 0 && (
                <span className={`text-xs mt-1 font-medium ${budgetDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {budgetDiff >= 0 ? `餘額 $${budgetDiff.toLocaleString()}` : `超支 $${Math.abs(budgetDiff).toLocaleString()}`}
                </span>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-text-secondary">AI 用途匹配度</span>
                   <span className={`font-bold ${usageMatch.color}`}>{usageMatch.score} / 100</span>
                 </div>
                 <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${usageMatch.bg}`}></div>
                 </div>
                 <p className="text-[10px] text-text-secondary mt-1">{usageMatch.label}</p>
               </div>
               
               <div>
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-text-secondary">系統預估極限功耗</span>
                   <span className="font-bold text-amber-400">{totalTdp} W</span>
                 </div>
               </div>
            </div>

            <div className="mt-6 space-y-2">
              <button className="w-full py-2.5 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neon-cyan hover:text-black transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> 儲存為我的配置
              </button>
              <button className="w-full py-2.5 bg-transparent border border-white/10 text-text-secondary text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> 輸出圖片 / 分享
              </button>
            </div>
          </div>

          {/* Compatibility Checker */}
          <div className={`glass-card rounded-2xl p-5 border ${
             compatibility.status === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 
             compatibility.status === 'error' ? 'border-rose-500/50 bg-rose-500/10' : 
             'border-amber-500/30 bg-amber-500/5'
          }`}>
             <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                {compatibility.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {compatibility.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {compatibility.status === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
                相容性與除錯分析
             </h3>
             <ul className="space-y-2">
                {compatibility.issues.map((iss, i) => (
                  <li key={i} className={`text-xs leading-relaxed ${
                    iss.includes('嚴重') ? 'text-rose-400 font-bold' : 
                    iss.includes('缺失') || iss.includes('注意') || iss.includes('請先選擇') ? 'text-amber-400/90' : 
                    'text-emerald-400/90'
                  }`}>
                    • {iss}
                  </li>
                ))}
                {missingParts.length > 0 && compatibility.status !== 'error' && (
                  <li className="text-xs leading-relaxed text-amber-400/90">
                    • 缺失組件：{missingParts.join(', ')}
                  </li>
                )}
             </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex justify-center items-center h-[50vh]"><div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"></div></div>}>
       <BuilderContent />
    </Suspense>
  )
}
