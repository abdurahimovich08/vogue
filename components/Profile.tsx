
import React, { useState } from 'react';
import { ShopProfile } from '../types';
import { authService } from '../services/auth';

interface ProfileProps {
  profile: ShopProfile;
  onBack: () => void;
  onUpdate: (updated: ShopProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onBack, onUpdate }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-[#1C1B1F] px-6 pt-12 pb-32 animate-apple overflow-y-auto">
      <header className="flex items-center gap-6 mb-12">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm border border-[#CAC4D0] active:scale-90 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-black">Profil va Sozlamalar</h2>
      </header>

      <div className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 rounded-full bg-[#6750A4] flex items-center justify-center text-white text-5xl font-bold shadow-xl mb-6 relative group overflow-hidden">
          {formData.logoUrl ? (
            <img src={formData.logoUrl} className="w-full h-full object-cover" alt="Logo" />
          ) : (
            <span>{formData.shopName[0]}</span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
        <h3 className="text-xl font-bold">{formData.shopName}</h3>
        <p className="text-[#49454F] text-sm">A'zo bo'lgan sana: {new Date(formData.registeredAt).toLocaleDateString()}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[28px] border border-[#CAC4D0] space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[#49454F] uppercase text-xs tracking-widest">Do'kon ma'lumotlari</h4>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-[#6750A4] font-bold text-sm"
            >
              {isEditing ? 'Saqlash' : 'Tahrirlash'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-[#49454F]/50 uppercase tracking-widest ml-1">Do'kon nomi</label>
              <input 
                disabled={!isEditing}
                value={formData.shopName}
                onChange={e => setFormData({...formData, shopName: e.target.value})}
                className="w-full bg-[#F3EDF7]/50 border-none rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#6750A4] disabled:opacity-70"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#49454F]/50 uppercase tracking-widest ml-1">Telefon raqam</label>
              <input 
                disabled={!isEditing}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#F3EDF7]/50 border-none rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#6750A4] disabled:opacity-70"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#49454F]/50 uppercase tracking-widest ml-1">Manzil</label>
              <input 
                disabled={!isEditing}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-[#F3EDF7]/50 border-none rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#6750A4] disabled:opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#CAC4D0]">
          <h4 className="font-bold text-[#49454F] uppercase text-xs tracking-widest mb-4">Ilova sozlamalari</h4>
          <div className="space-y-2">
            <button className="w-full flex justify-between items-center p-3 hover:bg-[#F3EDF7] rounded-xl transition-colors">
              <span className="text-sm font-medium">Xabarnomalar (Push)</span>
              <div className="w-10 h-6 bg-[#6750A4] rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </button>
            <button className="w-full flex justify-between items-center p-3 hover:bg-[#F3EDF7] rounded-xl transition-colors">
              <span className="text-sm font-medium">Tungi rejim</span>
              <div className="w-10 h-6 bg-[#E7E0EC] rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-5 bg-[#F9DEDC] text-[#B3261E] rounded-[24px] font-bold uppercase tracking-[0.2em] text-xs shadow-sm active:scale-95 transition-all"
        >
          Tizimdan chiqish
        </button>
      </div>
    </div>
  );
};

export default Profile;
