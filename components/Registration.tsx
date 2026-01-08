
import React, { useState, useEffect } from 'react';
import { ShopProfile } from '../types';
import { reverseGeocode } from '../services/gemini';

interface RegistrationProps {
  onRegister: (data: ShopProfile) => void;
}

const WebApp = (window as any).Telegram?.WebApp;

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ shopName: '', phone: '', address: '' });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (WebApp?.initDataUnsafe?.user) {
      const user = WebApp.initDataUnsafe.user;
      setFormData(prev => ({ 
        ...prev, 
        shopName: `${user.first_name}${user.last_name ? ' ' + user.last_name : ''} Store` 
      }));
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    WebApp?.HapticFeedback.selectionChanged();
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const addr = await reverseGeocode(p.coords.latitude, p.coords.longitude);
          setFormData(prev => ({ ...prev, address: addr }));
        } finally { setIsLocating(false); }
      },
      () => setIsLocating(false)
    );
  };

  const nextStep = () => {
    WebApp?.HapticFeedback.impactOccurred('light');
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-12 animate-in zoom-in-95 duration-1000">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] shadow-2xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">VogueAI Seller</h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Telegram Business Edition</p>
          </div>
        </div>

        <div className="apple-blur border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Do'kon Nomi</label>
                <input 
                  autoFocus
                  placeholder="The Luxury Store"
                  value={formData.shopName}
                  onChange={e => setFormData({...formData, shopName: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-lg font-bold outline-none focus:ring-1 ring-blue-500 transition-all" 
                />
              </div>
              <button 
                disabled={!formData.shopName}
                onClick={nextStep}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-20"
              >
                Davom Etish
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Kontaktlar</label>
                <input 
                  placeholder="+998 90 ..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none mb-3" 
                />
                <div className="relative">
                  <input 
                    placeholder="Manzilni kiriting..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none pr-14" 
                  />
                  <button onClick={handleGetLocation} className={`absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 ${isLocating && 'animate-pulse'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Orqaga</button>
                <button 
                  onClick={() => onRegister({ ...formData, registeredAt: Date.now() })}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                >
                  Ishni Boshlash
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
