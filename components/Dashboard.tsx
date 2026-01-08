
import React from 'react';
import { AppView, Product, ShopProfile } from '../types';

interface DashboardProps {
  profile: ShopProfile;
  products: Product[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, products, onNavigate }) => {
  const totalViews = products.reduce((acc, p) => acc + (p.stats?.views || 0), 0);

  return (
    <div className="flex flex-col h-full p-6 md:p-10 animate-in fade-in zoom-in-95 duration-700">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-16">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Xush kelibsiz</p>
          <h1 className="text-3xl font-black tracking-tight">{profile.shopName}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('MARKETPLACE')}
            className="px-6 py-3 apple-blur border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Do'konni Ko'rish
          </button>
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-lg"></div>
        </div>
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <button 
          onClick={() => onNavigate('AI_ASSISTANT')}
          className="group action-card relative h-56 bg-[#007AFF] rounded-[3rem] p-8 overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-16 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">Yangi mahsulot</h2>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest">AI orqali mahsulot qo'shish</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('INVENTORY')}
          className="group action-card relative h-56 apple-blur border border-white/5 rounded-[3rem] p-8 text-left"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{products.length}</span>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">MAHSULOTLAR</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">Ombor (Inventory)</h2>
              <p className="text-white/30 text-xs font-medium uppercase tracking-widest">Qoldiqlarni tahrirlash</p>
            </div>
          </div>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => onNavigate('ANALYTICS')}
          className="apple-blur border border-white/5 rounded-[2.5rem] p-6 text-center action-card group hover:bg-white/5 transition-all"
        >
          <div className="text-xl mb-1 group-hover:scale-125 transition-transform">📈</div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tahlillar</span>
        </button>
        <button 
          onClick={() => onNavigate('GALLERY')}
          className="apple-blur border border-white/5 rounded-[2.5rem] p-6 text-center action-card group hover:bg-white/5 transition-all"
        >
          <div className="text-xl mb-1 group-hover:scale-125 transition-transform">🖼️</div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Galereya</span>
        </button>
        <button className="apple-blur border border-white/5 rounded-[2.5rem] p-6 text-center action-card group hover:bg-white/5 transition-all">
          <div className="text-xl mb-1 group-hover:scale-125 transition-transform">⚙️</div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sozlamalar</span>
        </button>
        <button className="apple-blur border border-white/5 rounded-[2.5rem] p-6 text-center action-card group hover:bg-white/5 transition-all">
          <div className="text-xl mb-1 group-hover:scale-125 transition-transform">💬</div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Xabarlar</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
