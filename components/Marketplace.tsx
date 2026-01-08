
import React, { useState, useMemo } from 'react';
import { Product, UserMeasurements, ClothingSize, ProductCategory, ProductVariant } from '../types';
import { virtualTryOn } from '../services/gemini';

interface MarketplaceProps {
  products: Product[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ products }) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isFitting, setIsFitting] = useState(false);

  // Buyer selections
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const categories: (ProductCategory | 'All')[] = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Footwear', 'Accessories', 'Headwear'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const currentVariant = useMemo(() => {
    if (!selectedProduct || !selectedColor || !selectedSize) return null;
    return selectedProduct.variants.find(v => v.color === selectedColor && v.size === selectedSize);
  }, [selectedProduct, selectedColor, selectedSize]);

  const handleTryOn = async () => {
    if (!selectedProduct || !personImage) return;
    setIsFitting(true);
    try {
      const result = await virtualTryOn(selectedProduct.professionalImageUrl, personImage, { height: 175, weight: 70, bodyType: 'Average' }, (selectedSize as ClothingSize) || 'M');
      setTryOnResult(result);
    } catch (err) {
      alert("Xatolik: Try-on amalga oshmadi.");
    } finally {
      setIsFitting(false);
    }
  };

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
    setSelectedColor(p.attributes.availableColors[0] || p.attributes.color);
    setSelectedSize(p.attributes.sizes[0] || 'M');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 p-4 max-w-7xl mx-auto text-black">
      <header className="space-y-6">
        <h1 className="text-5xl font-black tracking-tighter">Marketplace</h1>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-black text-white shadow-xl' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(p => (
          <div key={p.id} onClick={() => handleOpenProduct(p)} className="group cursor-pointer bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
              <img src={p.professionalImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black shadow-lg">${p.price}</div>
              {p.variants?.reduce((a, b) => a + b.stock, 0) === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                   <span className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Sotilgan</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{p.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">{p.brand}</p>
              <div className="flex gap-1.5">
                {p.attributes.availableColors.slice(0, 4).map(c => (
                  <div key={c} className="w-3 h-3 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: c.toLowerCase() }}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl max-h-[90vh]">
            <button onClick={() => { setSelectedProduct(null); setTryOnResult(null); setPersonImage(null); }} className="absolute top-6 right-6 p-4 bg-gray-50 rounded-full hover:bg-gray-100 z-10 transition-colors">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 overflow-hidden">
              <img src={tryOnResult || selectedProduct.professionalImageUrl} className="max-h-full rounded-2xl shadow-xl object-contain animate-in fade-in" />
            </div>

            <div className="w-full md:w-[450px] p-10 space-y-8 overflow-y-auto bg-white custom-scrollbar">
              <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{selectedProduct.brand}</p>
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-black">{selectedProduct.name}</h2>
                <div className="text-3xl font-black text-black">${selectedProduct.price}</div>
              </div>

              {/* Color Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rangni Tanlang</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.attributes.availableColors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${selectedColor === c ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">O'lcham (Size)</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.attributes.sizes.map(s => {
                    const variant = selectedProduct.variants.find(v => v.color === selectedColor && v.size === s);
                    const isOutOfStock = !variant || variant.stock === 0;
                    return (
                      <button 
                        key={s}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(s)}
                        className={`w-12 h-12 rounded-xl text-[10px] font-black border transition-all relative ${
                          selectedSize === s ? 'bg-black text-white border-black' : isOutOfStock ? 'bg-gray-50 text-gray-200 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {s}
                        {isOutOfStock && <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-400 -rotate-45"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inventory Info */}
              {currentVariant && (
                <div className={`p-4 rounded-2xl flex items-center justify-between ${currentVariant.stock < 5 ? 'bg-orange-50' : 'bg-green-50'}`}>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">Mavjud:</span>
                   <span className={`text-sm font-black ${currentVariant.stock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                     {currentVariant.stock > 0 ? `${currentVariant.stock} dona qoldi` : 'Tugadi'}
                   </span>
                </div>
              )}

              <div className="pt-6 space-y-4">
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file'; input.onchange = (e) => {
                      const file = (e.target as any).files?.[0];
                      const r = new FileReader(); r.onload = () => setPersonImage(r.result as string); r.readAsDataURL(file);
                    }; input.click();
                  }}
                  className="w-full py-5 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100"
                >
                  O'zingizda kiyib ko'ring
                </button>
                {personImage && (
                  <button onClick={handleTryOn} disabled={isFitting} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {isFitting ? "Kiyintirilmoqda..." : "Natijani ko'rish"}
                  </button>
                )}
                <button 
                  disabled={!currentVariant || currentVariant.stock === 0}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all ${
                    !currentVariant || currentVariant.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:scale-[1.02]'
                  }`}
                >
                  Savatga qo'shish
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
