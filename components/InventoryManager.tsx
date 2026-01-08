
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductCategory } from '../types';

interface InventoryManagerProps {
  products: Product[];
  onBack: () => void;
  onUpdate: (product: Product) => void;
}

const WebApp = (window as any).Telegram?.WebApp;

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, onBack, onUpdate }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use Telegram MainButton for Save action in modal
  useEffect(() => {
    if (!WebApp) return;
    if (editingProduct) {
      WebApp.MainButton.setText('O\'ZGARISHLARNI SAQLASH');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(saveChanges);
    } else {
      WebApp.MainButton.hide();
    }
    return () => WebApp.MainButton.offClick(saveChanges);
  }, [editingProduct]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = (variantId: string, newStock: number) => {
    if (!editingProduct) return;
    WebApp?.HapticFeedback.selectionChanged();
    const updatedVariants = editingProduct.variants.map(v => 
      v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
    );
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  const saveChanges = () => {
    if (editingProduct) {
      onUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 pb-32 animate-in slide-in-from-right-8 duration-500 overflow-hidden">
      {/* Search Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-black tracking-tighter mb-6">Ombor</h2>
        <div className="relative">
           <input 
            placeholder="Qidiruv..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all" 
           />
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {filteredProducts.map(p => {
          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
          const isLowStock = totalStock < 10;
          
          return (
            <div 
              key={p.id} 
              onClick={() => {
                WebApp?.HapticFeedback.impactOccurred('light');
                setEditingProduct(JSON.parse(JSON.stringify(p)));
              }}
              className="group apple-blur border border-white/5 rounded-[2rem] p-4 flex items-center gap-6 hover:bg-white/5"
            >
              <div className="w-16 h-20 bg-black rounded-xl overflow-hidden shadow-2xl relative">
                <img src={p.professionalImageUrl} className="w-full h-full object-cover" />
                {isLowStock && <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold truncate">{p.name}</h3>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">{p.brand}</p>
                <div className="flex gap-4">
                  <span className={`text-[10px] font-black ${isLowStock ? 'text-red-400' : 'text-green-500'}`}>Stock: {totalStock}</span>
                  <span className="text-[10px] font-black text-blue-500">${p.price}</span>
                </div>
              </div>
              
              <div className="text-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setEditingProduct(null)}></div>
          
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black">Tahrirlash</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 bg-white/5 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-bold" 
                />
                <input 
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-bold" 
                />
              </div>

              <div className="space-y-4">
                {editingProduct.attributes.availableColors.map(color => (
                  <div key={color} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                    <p className="text-[9px] font-black uppercase text-white/30 mb-4">{color} Stock</p>
                    <div className="grid grid-cols-3 gap-3">
                      {editingProduct.variants.filter(v => v.color === color).map(variant => (
                        <div key={variant.id} className="space-y-1">
                           <p className="text-center text-[8px] font-bold text-white/20">{variant.size}</p>
                           <input 
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleUpdateStock(variant.id, parseInt(e.target.value))}
                            className="w-full bg-black/50 border border-white/5 rounded-lg p-3 text-center text-xs font-black"
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
