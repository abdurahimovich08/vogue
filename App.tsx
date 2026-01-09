
import React, { useState, useEffect } from 'react';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import ShopAssistant from './components/ShopAssistant';
import Analytics from './components/Analytics';
import Marketplace from './components/Marketplace';
import Gallery from './components/Gallery';
import InventoryManager from './components/InventoryManager';
import Profile from './components/Profile';
import { ShopProfile, Product, AppView } from './types';
import { authService } from './services/auth';
import { dbService } from './services/database';
import { runTests } from './tests/unit_tests';

const WebApp = (window as any).Telegram?.WebApp;

const App: React.FC = () => {
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [view, setView] = useState<AppView>('REGISTRATION');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (WebApp) {
          WebApp.ready();
          WebApp.expand();
          WebApp.setHeaderColor('#FDFCFE');
        }

        // Run Logic Tests
        if (process.env.NODE_ENV === 'development') runTests();

        const savedProfile = await authService.getCurrentUser();
        const savedProducts = await dbService.getProducts();

        if (savedProfile) {
          setProfile(savedProfile);
          setView('DASHBOARD');
        }
        setProducts(savedProducts);
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    init();
  }, []);

  const handleRegister = async (data: ShopProfile) => {
    const newProfile = await authService.register(data);
    setProfile(newProfile);
    setView('DASHBOARD');
  };

  const handleUpdateProfile = async (updated: ShopProfile) => {
    // authService simulation update logic could be added here
    localStorage.setItem('vogue_user_session', JSON.stringify(updated)); // Simple persistence update
    setProfile(updated);
  };

  const handleAddProduct = async (p: Product) => {
    await dbService.saveProduct(p);
    setProducts(prev => [p, ...prev]);
  };

  const handleUpdateProduct = async (p: Product) => {
    await dbService.updateProduct(p);
    setProducts(prev => prev.map(old => old.id === p.id ? p : old));
  };

  const handleDeleteProduct = async (id: string) => {
    await dbService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (WebApp) WebApp.HapticFeedback.notificationOccurred('success');
  };

  const navigateTo = (v: AppView) => {
    if (WebApp) WebApp.HapticFeedback.impactOccurred('light');
    setView(v);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FDFCFE] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#E7E0EC] border-t-[#6750A4] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-[#6750A4] tracking-widest uppercase">Vogue Studio yuklanmoqda</p>
      </div>
    );
  }

  if (!profile && view === 'REGISTRATION') {
    return <Registration onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-[#1C1B1F] overflow-hidden font-sans">
      <div className="max-w-screen-xl mx-auto h-screen relative overflow-y-auto custom-scrollbar">
        {view === 'DASHBOARD' && <Dashboard profile={profile!} products={products} onNavigate={navigateTo} />}
        {view === 'AI_ASSISTANT' && <ShopAssistant onBack={() => navigateTo('DASHBOARD')} onProductListed={handleAddProduct} />}
        {view === 'ANALYTICS' && <Analytics products={products} onBack={() => navigateTo('DASHBOARD')} />}
        {view === 'INVENTORY' && <InventoryManager products={products} onBack={() => navigateTo('DASHBOARD')} onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} />}
        {view === 'MARKETPLACE' && <div className="p-0 bg-white min-h-full overflow-y-auto"><Marketplace products={products} onBack={() => navigateTo('DASHBOARD')} /></div>}
        {view === 'GALLERY' && <div className="p-8"><Gallery images={products.map(p => ({ id: p.id, originalUrl: p.originalImageUrl, generatedUrl: p.professionalImageUrl, timestamp: p.timestamp, prompt: p.name, category: p.brand, isFittingRoom: false }))} /></div>}
        {view === 'PROFILE' && <Profile profile={profile!} onBack={() => navigateTo('DASHBOARD')} onUpdate={handleUpdateProfile} />}
      </div>
    </div>
  );
};

export default App;
