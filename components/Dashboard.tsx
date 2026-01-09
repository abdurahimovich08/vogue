
import React from 'react';
import { AppView, Product, ShopProfile } from '../types';

interface DashboardProps {
  profile: ShopProfile;
  products: Product[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, products, onNavigate }) => {
  const totalStock = products.reduce((acc, p) => acc + p.variants.reduce((a, b) => a + b.stock, 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.variants.reduce((a, b) => a + b.stock, 0)), 0);

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-[#1C1B1F] px-6 pt-12 pb-32 animate-apple">
      {/* M3 Top App Bar Simulation */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#6750A4] flex items-center justify-center text-white shadow-md">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} className="w-full h-full rounded-full object-cover" alt="Logo" />
            ) : (
              <span className="text-xl font-medium">{profile.shopName[0]}</span>
            )}
          </div>
          <div>
            <p className="text-xs text-[#49454F] font-medium">Xush kelibsiz,</p>
            <h1 className="text-xl font-bold tracking-tight">{profile.shopName}</h1>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('PROFILE')}
          className="p-3 rounded-full hover:bg-black/5 transition-colors"
        >
          <svg className="w-6 h-6 text-[#49454F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </header>

      {/* Stats Grid - Material 3 Elevated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#F3EDF7] p-6 rounded-[28px] shadow-sm flex flex-col justify-between h-40 border border-[#CAC4D0]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-[#49454F]">Umumiy Savdo</span>
            <div className="p-2 bg-[#EADDFF] rounded-xl text-[#21005D]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
            <p className="text-xs text-[#49454F] mt-1">+12% o'tgan oydan</p>
          </div>
        </div>

        <div className="bg-[#F3EDF7] p-6 rounded-[28px] shadow-sm flex flex-col justify-between h-40 border border-[#CAC4D0]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-[#49454F]">Bugungi Buyurtmalar</span>
            <div className="p-2 bg-[#EADDFF] rounded-xl text-[#21005D]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold">14</p>
            <p className="text-xs text-[#49454F] mt-1">Hozirda faol</p>
          </div>
        </div>
      </div>

      {/* Main Actions - M3 Tonal Buttons/Cards */}
      <div className="space-y-4">
        <div 
          onClick={() => onNavigate('AI_ASSISTANT')}
          className="bg-[#6750A4] p-8 rounded-[28px] text-white flex items-center justify-between cursor-pointer shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Mahsulot qo'shish</h2>
            <p className="text-white/70 text-sm">AI yordamida professional rasm va tavsif yarating</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate('INVENTORY')}
            className="bg-white p-6 rounded-[28px] border border-[#CAC4D0] cursor-pointer hover:bg-[#F3EDF7] transition-colors"
          >
            <div className="w-12 h-12 bg-[#E8DEF8] text-[#1D192B] rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="font-bold">Ombor</h3>
            <p className="text-xs text-[#49454F]">{products.length} ta mahsulot</p>
          </div>

          <div 
            onClick={() => onNavigate('ANALYTICS')}
            className="bg-white p-6 rounded-[28px] border border-[#CAC4D0] cursor-pointer hover:bg-[#F3EDF7] transition-colors"
          >
            <div className="w-12 h-12 bg-[#E8DEF8] text-[#1D192B] rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="font-bold">Hisobotlar</h3>
            <p className="text-xs text-[#49454F]">Savdo tahlili</p>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-[#49454F] uppercase tracking-wider mb-4 ml-2">Tezkor havolalar</h3>
        <div className="space-y-3">
          <div 
            onClick={() => onNavigate('MARKETPLACE')}
            className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#CAC4D0] cursor-pointer active:bg-[#F3EDF7]"
          >
            <div className="w-10 h-10 rounded-full bg-[#EADDFF] flex items-center justify-center text-[#21005D]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Marketplace-ni ko'rish</p>
              <p className="text-[10px] text-[#49454F]">Do'koningiz tashqaridan qanday ko'rinadi</p>
            </div>
            <svg className="w-5 h-5 text-[#49454F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
