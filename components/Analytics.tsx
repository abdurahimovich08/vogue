
import React, { useEffect, useState, useMemo } from 'react';
import { Product, ShopProfile } from '../types';
import { authService } from '../services/auth';

interface AnalyticsProps {
  products: Product[];
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ products, onBack }) => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setProfile);
  }, []);

  // Filter products for the current seller
  // Note: For existing mock data, sellerId might default to 'auth-v1'. 
  // We use the profile email or googleId if available, otherwise fallback for demo compatibility.
  const currentSellerId = profile?.email || 'auth-v1';
  
  const myProducts = useMemo(() => 
    products.filter(p => p.sellerId === currentSellerId || p.sellerId === 'auth-v1'), 
  [products, currentSellerId]);

  const competitorProducts = useMemo(() => 
    products.filter(p => p.sellerId !== currentSellerId && p.sellerId !== 'auth-v1'), 
  [products, currentSellerId]);

  // Metric Calculations
  const totalViews = myProducts.reduce((acc, p) => acc + (p.stats?.views || 0), 0);
  const totalLikes = myProducts.reduce((acc, p) => acc + (p.stats?.likes || 0), 0);
  const totalSales = myProducts.reduce((acc, p) => acc + (p.stats?.sales || 0), 0);

  // 1. Top Selling Products Logic
  const topSellingProducts = useMemo(() => {
    return [...myProducts]
      .sort((a, b) => ((b.stats?.sales || 0) - (a.stats?.sales || 0)))
      .slice(0, 5); // Top 5
  }, [myProducts]);

  // 2. Competitor Price Comparison Logic
  const priceInsights = useMemo(() => {
    return myProducts.map(myProd => {
      // Find competitors selling similar items (fuzzy match by category or name)
      const similarItems = competitorProducts.filter(cp => 
        cp.category === myProd.category && 
        (cp.name.toLowerCase().includes(myProd.name.toLowerCase()) || myProd.name.toLowerCase().includes(cp.name.toLowerCase()))
      );

      if (similarItems.length === 0) return null;

      const avgMarketPrice = similarItems.reduce((acc, item) => acc + item.price, 0) / similarItems.length;
      const diff = myProd.price - avgMarketPrice;
      const percentDiff = (diff / avgMarketPrice) * 100;

      return {
        product: myProd,
        marketPrice: avgMarketPrice,
        difference: diff,
        status: Math.abs(percentDiff) < 5 ? 'Competitive' : (diff > 0 ? 'Premium' : 'Value')
      };
    }).filter(Boolean);
  }, [myProducts, competitorProducts]);

  // 3. Buyer Region Analysis Logic
  const regionStats = useMemo(() => {
    const stats: Record<string, number> = {};
    myProducts.forEach(p => {
      if (p.stats?.regionalData) {
        Object.entries(p.stats.regionalData).forEach(([region, count]) => {
          stats[region] = (stats[region] || 0) + (count as number);
        });
      }
    });
    // Convert to sorted array
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Top 4 regions
  }, [myProducts]);

  return (
    <div className="flex flex-col h-full bg-black p-8 md:p-12 animate-in slide-in-from-right-12 duration-700">
      <div className="flex items-center gap-6 mb-12">
        <button onClick={onBack} className="w-14 h-14 apple-blur border border-white/5 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Sales Analytics</h2>
          <p className="text-white/40 text-sm mt-1">{profile?.shopName || 'Seller'} Dashboard</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="apple-blur p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transition-all group-hover:bg-blue-500/20"></div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Total Sales</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white">{totalSales}</span>
            <span className="text-green-400 text-xs font-bold">Orders</span>
          </div>
        </div>
        
        <div className="apple-blur p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Total Views</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-indigo-400">{totalViews}</span>
          </div>
        </div>

        <div className="apple-blur p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
           <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
           <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Top Region</p>
           <div className="flex flex-col">
             <span className="text-3xl font-black text-green-400 truncate">{regionStats[0]?.[0] || 'Global'}</span>
             <span className="text-white/40 text-xs font-bold mt-1">{regionStats[0]?.[1] || 0} Sales</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-12 pr-4 pb-20">
        
        {/* Section 1: Top Selling Products */}
        <div>
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Top Performers</h3>
          <div className="space-y-4">
            {topSellingProducts.length === 0 ? (
              <div className="p-8 apple-blur rounded-3xl border border-white/5 text-center text-white/30 text-sm">No sales data available yet</div>
            ) : (
              topSellingProducts.map(p => (
                <div key={p.id} className="flex items-center gap-5 p-4 apple-blur rounded-3xl border border-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl overflow-hidden shrink-0">
                    <img src={p.professionalImageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{p.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg">{p.stats?.sales || 0}</p>
                    <p className="text-[9px] text-white/30 uppercase font-bold">Sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Market Intelligence */}
        <div>
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Market Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceInsights.length === 0 ? (
               <div className="col-span-full p-8 apple-blur rounded-3xl border border-white/5 text-center text-white/30 text-sm">
                 Insufficient competitor data for comparison
               </div>
            ) : (
              priceInsights.map((insight, idx) => (
                <div key={idx} className="p-5 apple-blur rounded-3xl border border-white/5 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                     <h4 className="font-bold text-xs truncate max-w-[70%]">{insight?.product.name}</h4>
                     <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                       insight?.status === 'Competitive' ? 'bg-green-500/20 text-green-400' :
                       insight?.status === 'Premium' ? 'bg-amber-500/20 text-amber-400' :
                       'bg-blue-500/20 text-blue-400'
                     }`}>{insight?.status}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Your Price</span>
                      <span className="font-bold">${insight?.product.price}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Market Avg</span>
                      <span className="font-bold">${insight?.marketPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Regional Reach */}
        <div>
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-2">Regional Reach</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
             {regionStats.length === 0 ? (
               <div className="w-full p-8 apple-blur rounded-3xl border border-white/5 text-center text-white/30 text-sm">No regional data</div>
             ) : (
               regionStats.map(([region, count]) => (
                 <div key={region} className="min-w-[140px] p-5 apple-blur rounded-3xl border border-white/5 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-lg">
                      {region === 'New York' ? '🇺🇸' : region === 'London' ? '🇬🇧' : region === 'Paris' ? '🇫🇷' : '🌍'}
                    </div>
                    <span className="font-bold text-sm mb-1">{region}</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase">{count} Sales</span>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
