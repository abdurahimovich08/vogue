
import React from 'react';
import { Product } from '../types';

interface AnalyticsProps {
  products: Product[];
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ products, onBack }) => {
  const totalViews = products.reduce((acc, p) => acc + (p.stats?.views || 0), 0);
  const totalLikes = products.reduce((acc, p) => acc + (p.stats?.likes || 0), 0);

  return (
    <div className="flex flex-col h-full bg-black p-8 md:p-12 animate-in slide-in-from-right-12 duration-700">
      <div className="flex items-center gap-6 mb-16">
        <button onClick={onBack} className="w-14 h-14 apple-blur border border-white/5 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-4xl font-black tracking-tighter">Insights</h2>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="apple-blur p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transition-all group-hover:bg-blue-500/20"></div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Total Engagement</p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black">{totalViews}</span>
            <span className="text-green-400 text-xs font-bold">↑ 12%</span>
          </div>
          <p className="text-xs font-medium text-white/20 mt-2">Bu haftadagi ko'rishlar soni</p>
        </div>
        
        <div className="apple-blur p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Store Favorites</p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-indigo-500">{totalLikes}</span>
            <span className="text-green-400 text-xs font-bold">↑ 5%</span>
          </div>
          <p className="text-xs font-medium text-white/20 mt-2">Xaridorlar yoqtirgan mahsulotlar</p>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-4">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 ml-2">Live Inventory</h3>
        {products.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center apple-blur rounded-[3rem] border border-white/5 border-dashed">
            <p className="text-white/20 font-medium">Hali mahsulotlar yo'q</p>
          </div>
        ) : (
          products.map(p => (
            <div key={p.id} className="group apple-blur p-5 rounded-[2.5rem] border border-white/5 flex items-center gap-6 hover:bg-white/5 transition-all duration-500 action-card">
              <div className="w-24 h-24 bg-black rounded-[1.8rem] overflow-hidden shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-700">
                <img src={p.professionalImageUrl} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold truncate">{p.name}</h4>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-black rounded-full uppercase tracking-widest">{p.status}</span>
                </div>
                <div className="flex gap-6 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <span className="text-[10px] font-bold text-white/30 uppercase">👀 {p.stats?.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <span className="text-[10px] font-bold text-white/30 uppercase">❤️ {p.stats?.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <span className="text-[10px] font-bold text-white/30 uppercase">💰 ${p.price}</span>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 apple-blur border border-white/5 rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Analytics;
