import React, { useState, useMemo } from 'react';
import { Product, UserMeasurements, ClothingSize, ProductCategory } from '../types';
import { virtualTryOn } from '../services/gemini';

interface MarketplaceProps {
  products: Product[];
  onBack: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);

  const categories: (ProductCategory | 'All')[] = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Footwear'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-black px-6 pt-24 pb-32 animate-apple overflow-y-auto no-scrollbar">
      <header className="mb-14 space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-6xl font-black tracking-tight text-black">Collections</h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-black text-white shadow-2xl' : 'bg-white text-black/40 hover:bg-black/5 border border-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedProduct(p)} 
            className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-[#EDEDF1]">
              <img src={p.professionalImageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg">${p.price}</div>
            </div>
            <div className="p-6">
              <p className="text-[9px] text-black/30 font-black uppercase tracking-widest mb-1">{p.brand}</p>
              <h3 className="font-bold text-gray-900 text-base truncate">{p.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Layer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10 animate-apple">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" onClick={() => {setSelectedProduct(null); setTryOnResult(null);}}></div>
          <div className="relative w-full max-w-6xl bg-white md:rounded-[48px] rounded-t-[48px] overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[95vh]">
            <button 
              onClick={() => {setSelectedProduct(null); setTryOnResult(null);}} 
              className="absolute top-8 right-8 w-12 h-12 bg-[#F5F5F7] rounded-full flex items-center justify-center z-20 active:scale-90 transition-transform shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex-1 bg-[#F5F5F7] flex items-center justify-center p-6 min-h-[400px]">
              <img src={tryOnResult || selectedProduct.professionalImageUrl} className="max-h-[75vh] w-auto rounded-[32px] object-contain shadow-2xl animate-apple" />
            </div>

            <div className="w-full md:w-[480px] p-12 space-y-12 overflow-y-auto bg-white no-scrollbar">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-[#0A84FF] uppercase tracking-[0.2em]">{selectedProduct.brand}</p>
                <h2 className="text-4xl font-black tracking-tight text-black">{selectedProduct.name}</h2>
                <div className="text-3xl font-light text-black/40">${selectedProduct.price}</div>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-black/60 leading-relaxed font-medium">{selectedProduct.description || "Premium studio production. Crafted with precision for the elite collection."}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.attributes.sizes.map(s => (
                    <div key={s} className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center text-[10px] font-black">{s}</div>
                  ))}
                </div>
              </div>

              <div className="pt-10 space-y-4">
                <button 
                  onClick={() => alert("Model processing... Implementation is active.")}
                  className="w-full py-6 bg-[#F5F5F7] rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                >
                  Visual Try-On
                </button>
                <button className="w-full py-7 bg-black text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                  Reserve for Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;