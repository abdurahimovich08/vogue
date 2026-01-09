
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
        shopName: `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}'s Studio` 
      }));
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 animate-apple">
      <div className="w-full max-w-md space-y-16">
        <div className="text-center space-y-8">
          <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-[#1C1C1E] to-[#2C2C2E] rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex items-center justify-center border border-white/5 relative group">
            <div className="absolute inset-0 bg-[#0A84FF]/10 rounded-[32px] blur-2xl group-hover:bg-[#0A84FF]/20 transition-all"></div>
            <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight">VogueAI</h1>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.5em]">The Fashion OS</p>
          </div>
        </div>

        <div className="space-y-8">
          {step === 1 ? (
            <div className="space-y-6 animate-apple">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Studio Name</label>
                <input 
                  autoFocus
                  placeholder="Atelier Vogue"
                  value={formData.shopName}
                  onChange={e => setFormData({...formData, shopName: e.target.value})}
                  className="w-full bg-[#1C1C1E] border border-white/[0.03] rounded-[24px] px-8 py-6 text-xl font-bold outline-none focus:border-[#0A84FF] transition-all" 
                />
              </div>
              <button 
                disabled={!formData.shopName}
                onClick={() => setStep(2)}
                className="w-full py-6 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all disabled:opacity-10 shadow-2xl"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-apple">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Contact Info</label>
                  <input 
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-white/[0.03] rounded-[24px] px-8 py-5 text-sm font-bold outline-none" 
                  />
                </div>
                <div className="relative">
                  <input 
                    placeholder="Location"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#1C1C1E] border border-white/[0.03] rounded-[24px] px-8 py-5 text-sm font-bold outline-none pr-16" 
                  />
                  <button onClick={handleGetLocation} className={`absolute right-5 top-1/2 -translate-y-1/2 text-[#0A84FF] ${isLocating && 'animate-pulse'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 bg-white/5 text-white/40 rounded-[24px] font-black uppercase tracking-widest text-[9px] border border-white/5">Back</button>
                <button 
                  onClick={() => onRegister({ ...formData, registeredAt: Date.now() })}
                  className="flex-[2] py-6 bg-[#0A84FF] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_20px_40px_rgba(10,132,255,0.2)] active:scale-95 transition-all"
                >
                  Start Studio
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
