
import React from 'react';
import { AppView, Product, ShopProfile } from '../types';

interface DashboardProps {
  profile: ShopProfile;
  products: Product[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, products, onNavigate }) => {
  const totalStock = products.reduce((acc, p) => acc + p.variants.reduce((a, b) => a + b.stock, 0), 0);

  return (
    <div className="min-h-screen bg-black px-6 pt-16 pb-32 animate-apple overflow-y-auto custom-scrollbar">
      {/* Premium Header */}
      <header className="flex items-end justify-between mb-12">
        <div className="space-y-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">Design Studio</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{profile.shopName}</h1>
        </div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] border border-white/5 flex items-center justify-center shadow-2xl">
          <span className="text-lg font-bold text-white/40">{profile.shopName[0]}</span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main Action Widget */}
        <div 
          onClick={() => onNavigate('AI_ASSISTANT')}
          className="col-span-2 apple-card h-64 p-8 relative overflow-hidden group cursor-pointer shadow-2xl border border-white/[0.03]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0A84FF]/10 rounded-full blur-[80px] -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-16 h-16 bg-[#0A84FF] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(10,132,255,0.3)]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">New Production</h2>
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">AI Fashion Generation</p>
            </div>
          </div>
        </div>

        {/* Inventory Widget */}
        <div 
          onClick={() => onNavigate('INVENTORY')}
          className="col-span-1 apple-card h-48 p-6 flex flex-col justify-between cursor-pointer border border-white/[0.03]"
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
               <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{products.length}</p>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Items</p>
            </div>
          </div>
          <p className="text-sm font-bold text-white/80">Inventory</p>
        </div>

        {/* Stock Status Widget */}
        <div className="col-span-1 apple-card h-48 p-6 flex flex-col justify-between border border-white/[0.03]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
               <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{totalStock}</p>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Units</p>
            </div>
          </div>
          <p className="text-sm font-bold text-white/80">Total Stock</p>
        </div>

        {/* Gallery Card */}
        <div 
          onClick={() => onNavigate('GALLERY')}
          className="col-span-2 apple-card p-6 flex items-center gap-6 cursor-pointer border border-white/[0.03]"
        >
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-[#2C2C2E] border-2 border-black flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-white/5 to-white/10 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-white/30">Media Library</p>
            <p className="text-sm font-bold">Generated Assets</p>
          </div>
          <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>

        {/* Marketplace Shortcut */}
        <div 
          onClick={() => onNavigate('MARKETPLACE')}
          className="col-span-2 py-6 px-8 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] text-center mt-4 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          Enter Marketplace
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
