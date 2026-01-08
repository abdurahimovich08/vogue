
import React, { useState, useEffect } from 'react';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import ShopAssistant from './components/ShopAssistant';
import Analytics from './components/Analytics';
import Marketplace from './components/Marketplace';
import Gallery from './components/Gallery';
import InventoryManager from './components/InventoryManager';
import { ShopProfile, Product, AppView } from './types';
import { encryptData, decryptData } from './services/security';

const WebApp = (window as any).Telegram?.WebApp;

const App: React.FC = () => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [view, setView] = useState<AppView>('REGISTRATION');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      WebApp.setHeaderColor('#000000');
      WebApp.setBackgroundColor('#000000');
    }

    const secureProfile = localStorage.getItem('vogue_vault_p');
    const secureProducts = localStorage.getItem('vogue_vault_prod');
    
    if (secureProfile) {
      const decrypted = decryptData(secureProfile);
      if (decrypted) setProfile(JSON.parse(decrypted));
    }
    
    if (secureProducts) {
      const decrypted = decryptData(secureProducts);
      if (decrypted) setProducts(JSON.parse(decrypted));
    }
    
    setTimeout(() => {
      setIsLoading(false);
      if (secureProfile) setView('DASHBOARD');
    }, 1500);
  }, []);

  // Handle Telegram Back Button
  useEffect(() => {
    if (!WebApp) return;

    if (view === 'DASHBOARD' || view === 'REGISTRATION') {
      WebApp.BackButton.hide();
    } else {
      WebApp.BackButton.show();
      const handleBack = () => {
        WebApp.HapticFeedback.impactOccurred('light');
        setView('DASHBOARD');
      };
      WebApp.BackButton.onClick(handleBack);
      return () => WebApp.BackButton.offClick(handleBack);
    }
  }, [view]);

  const handleRegister = (data: ShopProfile) => {
    if (WebApp) WebApp.HapticFeedback.notificationOccurred('success');
    setProfile(data);
    localStorage.setItem('vogue_vault_p', encryptData(JSON.stringify(data)));
    setView('DASHBOARD');
  };

  const handleAddProduct = (p: Product) => {
    if (WebApp) WebApp.HapticFeedback.notificationOccurred('success');
    const updated = [p, ...products];
    setProducts(updated);
    localStorage.setItem('vogue_vault_prod', encryptData(JSON.stringify(updated)));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    if (WebApp) WebApp.HapticFeedback.impactOccurred('medium');
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem('vogue_vault_prod', encryptData(JSON.stringify(updated)));
  };

  const navigateTo = (v: AppView) => {
    if (WebApp) WebApp.HapticFeedback.impactOccurred('light');
    setView(v);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">Vogue Shield Initializing</p>
        </div>
      </div>
    );
  }

  if (!profile && view === 'REGISTRATION') {
    return <Registration onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-black text-white select-none overflow-hidden font-sans">
      <div className="max-w-screen-xl mx-auto h-screen relative">
        <div className="h-full w-full transition-all duration-700 ease-in-out">
          {view === 'DASHBOARD' && (
            <Dashboard 
              profile={profile!} 
              products={products}
              onNavigate={navigateTo} 
            />
          )}
          
          {view === 'AI_ASSISTANT' && (
            <ShopAssistant 
              onBack={() => navigateTo('DASHBOARD')}
              onProductListed={handleAddProduct} 
            />
          )}

          {view === 'ANALYTICS' && (
            <Analytics 
              products={products} 
              onBack={() => navigateTo('DASHBOARD')} 
            />
          )}

          {view === 'INVENTORY' && (
            <InventoryManager 
              products={products} 
              onBack={() => navigateTo('DASHBOARD')}
              onUpdate={handleUpdateProduct}
            />
          )}

          {view === 'MARKETPLACE' && (
            <div className="h-full overflow-y-auto p-8 pb-32 custom-scrollbar bg-white text-black">
               <Marketplace products={products} />
            </div>
          )}

          {view === 'GALLERY' && (
            <div className="h-full overflow-y-auto p-8 pb-32 custom-scrollbar">
               <Gallery images={products.map(p => ({
                 id: p.id,
                 originalUrl: p.originalImageUrl,
                 generatedUrl: p.professionalImageUrl,
                 timestamp: p.timestamp,
                 prompt: p.name,
                 category: p.brand,
                 isFittingRoom: false
               }))} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
