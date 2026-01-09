
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductCategory } from '../types';
import { dbService } from '../services/database';

interface InventoryManagerProps {
  products: Product[];
  onBack: () => void;
  onUpdate: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const WebApp = (window as any).Telegram?.WebApp;

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, onBack, onUpdate, onDelete }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!WebApp) return;
    if (editingProduct) {
      WebApp.MainButton.setText('O\'ZGARISHLARNI SAQLASH');
      WebApp.MainButton.show();
      const saveFn = () => saveChanges();
      WebApp.MainButton.onClick(saveFn);
      return () => {
        WebApp.MainButton.offClick(saveFn);
        WebApp.MainButton.hide();
      };
    }
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

  const handleDelete = (id: string) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      onDelete?.(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCFE] p-6 pb-32 animate-in slide-in-from-right-8 duration-500 overflow-hidden">
      {/* Search Header */}
      <div className="mb-8 flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm border border-[#CAC4D0]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tighter">Ombor</h2>
          <p className="text-xs text-[#49454F] font-medium">{products.length} ta mahsulot mavjud</p>
        </div>
      </div>

      <div className="relative mb-6">
         <input 
          placeholder="Mahsulot qidirish..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#F3EDF7] border border-[#CAC4D0] rounded-full py-4 px-6 pl-12 text-sm outline-none focus:ring-2 focus:ring-[#6750A4] transition-all" 
         />
         <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49454F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {filteredProducts.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-[#49454F]/50">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <p className="text-sm font-medium">Mahsulotlar topilmadi</p>
          </div>
        ) : (
          filteredProducts.map(p => {
            const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
            const isLowStock = totalStock < 5;
            
            return (
              <div 
                key={p.id} 
                className="bg-white border border-[#CAC4D0] rounded-[28px] p-4 flex items-center gap-4 hover:bg-[#F3EDF7] transition-all"
              >
                <div 
                  onClick={() => setEditingProduct(JSON.parse(JSON.stringify(p)))}
                  className="w-20 h-24 bg-[#E7E0EC] rounded-2xl overflow-hidden shadow-sm relative cursor-pointer"
                >
                  <img src={p.professionalImageUrl} className="w-full h-full object-cover" />
                  {isLowStock && <div className="absolute top-1 right-1 w-3 h-3 bg-[#B3261E] border-2 border-white rounded-full"></div>}
                </div>
                
                <div 
                  onClick={() => setEditingProduct(JSON.parse(JSON.stringify(p)))}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <h3 className="text-sm font-bold truncate text-[#1C1B1F]">{p.name}</h3>
                  <p className="text-[10px] font-bold text-[#49454F] uppercase tracking-widest mb-2">{p.brand}</p>
                  <div className="flex gap-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLowStock ? 'bg-[#F9DEDC] text-[#B3261E]' : 'bg-[#E8DEF8] text-[#1D192B]'}`}>
                      Stock: {totalStock}
                    </span>
                    <span className="text-[10px] font-bold text-[#6750A4] self-center">${p.price}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-3 text-[#B3261E] hover:bg-[#F9DEDC] rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          
          <div className="relative w-full max-w-xl bg-white rounded-t-[40px] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-20 shadow-2xl">
            <div className="p-8 border-b border-[#CAC4D0] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#1C1B1F]">Mahsulotni tahrirlash</h3>
                <p className="text-xs text-[#49454F]">{editingProduct.name}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-3 bg-[#F3EDF7] rounded-full text-[#1D192B]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#49454F] uppercase tracking-widest ml-1">Nomi</label>
                  <input 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-[#F3EDF7] border-none rounded-2xl p-4 text-xs font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#49454F] uppercase tracking-widest ml-1">Narxi ($)</label>
                  <input 
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full bg-[#F3EDF7] border-none rounded-2xl p-4 text-xs font-bold" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-[#49454F] tracking-widest ml-1">Variantlar va Stok</h4>
                {editingProduct.attributes.availableColors.map(color => (
                  <div key={color} className="bg-[#F3EDF7] border border-[#CAC4D0] rounded-3xl p-6">
                    <p className="text-[10px] font-black uppercase text-[#6750A4] mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6750A4]"></span>
                      {color} Rangi
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {editingProduct.variants.filter(v => v.color === color).map(variant => (
                        <div key={variant.id} className="space-y-1">
                           <p className="text-center text-[10px] font-bold text-[#49454F]">{variant.size}</p>
                           <input 
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleUpdateStock(variant.id, parseInt(e.target.value))}
                            className="w-full bg-white border border-[#CAC4D0] rounded-xl p-3 text-center text-xs font-black shadow-sm"
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
