
import React, { useState, useRef, useEffect } from 'react';
import { analyzeProductImage, generateProfessionalShot } from '../services/gemini';
import { Product, ProductCategory, ProductVariant } from '../types';
import { sanitizeInput, validateImage, generateSecureId } from '../services/security';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  type?: 'text' | 'image' | 'form' | 'result' | 'comparison';
  data?: any;
}

interface ShopAssistantProps {
  onBack: () => void;
  onProductListed: (product: Product) => void;
}

const ShopAssistant: React.FC<ShopAssistantProps> = ({ onBack, onProductListed }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: generateSecureId(), 
      role: 'ai', 
      content: "Assalomu alaykum, Top-Menejer! Mahsulot yuklang, men uni professional suratga aylantiraman va biz birgalikda uning barcha ranglari, o'lchamlari va ombor qoldiqlarini tizimlashtiramiz.", 
      type: 'text' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form State for Inventory
  const [colors, setColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [stockMatrix, setStockMatrix] = useState<Record<string, number>>({});

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await validateImage(file);
    if (!isValid) {
      alert("Sifatli rasm yuklang.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      addMessage({ role: 'user', content: "Rasm yuklandi", type: 'image', data: base64 });
      setIsTyping(true);

      try {
        const analysis = await analyzeProductImage(base64);
        setIsTyping(false);
        setColors([analysis.attributes.color || 'Oq']);
        addMessage({ 
          role: 'ai', 
          content: `AI kiyimni aniqladi. Endi uning barcha variantlarini (rang va o'lchamlar) va har biri uchun nechtadan mahsulot borligini ko'rsating. Xaridorlar uchun bu juda muhim!`, 
          type: 'form',
          data: { ...analysis, originalImage: base64 }
        });
      } catch (err) {
        setIsTyping(false);
        addMessage({ role: 'ai', content: "Tahlil xatosi. Qayta urinib ko'ring." });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: generateSecureId() }]);
  };

  const finalizeListing = async (formData: any) => {
    setIsTyping(true);
    addMessage({ role: 'ai', content: "Mo'jizaviy surat va ombor matritsasi tayyorlanmoqda..." });

    try {
      const profImage = await generateProfessionalShot(formData.originalImage, formData.name, formData.vibe || "Luxury Minimalism Studio");
      
      const variants: ProductVariant[] = [];
      colors.forEach(color => {
        selectedSizes.forEach(size => {
          const key = `${color}-${size}`;
          variants.push({
            id: generateSecureId(),
            color,
            size,
            stock: stockMatrix[key] || 0
          });
        });
      });

      const newProduct: Product = {
        id: generateSecureId(),
        sellerId: 'auth-user-v1',
        originalImageUrl: formData.originalImage,
        professionalImageUrl: profImage,
        name: sanitizeInput(formData.name),
        brand: sanitizeInput(formData.brand),
        material: sanitizeInput(formData.material),
        quality: 'New',
        price: Number(formData.price),
        description: sanitizeInput(formData.description),
        category: formData.category as ProductCategory,
        attributes: {
          color: colors[0],
          availableColors: colors,
          season: 'All-season',
          gender: 'Unisex',
          sizes: selectedSizes,
          tags: []
        },
        variants: variants,
        timestamp: Date.now(),
        status: 'Approved',
        stats: { views: 0, likes: 0, reviews: [] }
      };

      onProductListed(newProduct);
      setIsTyping(false);
      addMessage({ 
        role: 'ai', 
        content: `Tabriklaymiz! Mahsulot ${variants.length} xil variantda va jami ${variants.reduce((a, b) => a + b.stock, 0)} dona zaxira bilan e'longa chiqdi.`, 
        type: 'comparison',
        data: { original: formData.originalImage, generated: profImage }
      });
    } catch (err) {
      setIsTyping(false);
      addMessage({ role: 'ai', content: "Xatolik yuz berdi." });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 apple-blur border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
        <div className="text-center">
           <p className="text-[8px] font-black tracking-[0.4em] text-blue-500 uppercase">Pro Inventory Mode</p>
           <h2 className="text-xs font-bold uppercase tracking-widest">Listing Assistant</h2>
        </div>
        <div className="w-10"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] space-y-4 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {m.type === 'image' && (
                <div className="rounded-3xl overflow-hidden border border-white/10 w-48 shadow-2xl">
                  <img src={m.data} className="w-full" alt="Source" />
                </div>
              )}
              
              <div className={`px-6 py-4 rounded-3xl text-sm ${m.role === 'user' ? 'bg-blue-600' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                {m.content}
              </div>

              {m.type === 'form' && (
                <div className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Mahsulot Nomi</label>
                      <input id={`name-${m.id}`} defaultValue={m.data.name} className="w-full bg-white/5 p-4 rounded-xl text-xs font-bold outline-none border border-white/5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Narxi ($)</label>
                      <input id={`price-${m.id}`} type="number" defaultValue={m.data.suggestedPrice} className="w-full bg-white/5 p-4 rounded-xl text-xs font-bold outline-none border border-white/5" />
                    </div>
                  </div>

                  {/* Colors Chip Input */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Mavjud Ranglar</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colors.map(c => (
                        <span key={c} className="px-3 py-1.5 bg-blue-600 rounded-full text-[10px] font-black flex items-center gap-2">
                          {c}
                          <button onClick={() => setColors(colors.filter(x => x !== c))} className="hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        id="new-color" 
                        placeholder="Yangi rang qo'shish..." 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val && !colors.includes(val)) {
                              setColors([...colors, val]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="flex-1 bg-white/5 p-4 rounded-xl text-xs font-bold outline-none border border-white/5" 
                      />
                    </div>
                  </div>

                  {/* Sizes Selector */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">O'lchamlar</label>
                    <div className="flex gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                        <button 
                          key={sz}
                          onClick={() => selectedSizes.includes(sz) ? setSelectedSizes(selectedSizes.filter(s => s !== sz)) : setSelectedSizes([...selectedSizes, sz])}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black border transition-all ${selectedSizes.includes(sz) ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white/40'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inventory Matrix */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-2">Ombor Qoldiqlari (Stock)</label>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {colors.map(color => (
                        <div key={color} className="space-y-2 p-4 bg-white/5 rounded-2xl">
                          <p className="text-[10px] font-black uppercase text-white/40">{color} rang uchun:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedSizes.map(size => (
                              <div key={`${color}-${size}`} className="space-y-1">
                                <p className="text-[8px] font-bold text-white/20 text-center">{size}</p>
                                <input 
                                  type="number" 
                                  placeholder="0"
                                  value={stockMatrix[`${color}-${size}`] || ''}
                                  onChange={(e) => setStockMatrix({...stockMatrix, [`${color}-${size}`]: parseInt(e.target.value) || 0})}
                                  className="w-full bg-black/40 p-2 rounded-lg text-[10px] font-bold text-center outline-none border border-white/5"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const getV = (id: string) => (document.getElementById(id) as any).value;
                      finalizeListing({
                        ...m.data,
                        name: getV(`name-${m.id}`),
                        price: getV(`price-${m.id}`),
                        category: (document.getElementById(`cat-${m.id}`) as any)?.value || 'Tops'
                      });
                    }} 
                    className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                  >
                    Barcha variantlarni e'longa chiqarish
                  </button>
                </div>
              )}

              {m.type === 'comparison' && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                   <div className="rounded-2xl overflow-hidden border border-white/5 opacity-40"><img src={m.data.original} className="w-full aspect-[3/4] object-cover" /></div>
                   <div className="rounded-2xl overflow-hidden border border-blue-500/50"><img src={m.data.generated} className="w-full aspect-[3/4] object-cover" /></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="p-4 text-xs font-bold text-white/20 animate-pulse uppercase tracking-widest">Studiyada ish ketmoqda...</div>}
      </div>

      {/* Input */}
      <div className="p-8 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-xl mx-auto bg-white/5 rounded-full p-2 flex items-center gap-2 border border-white/10">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10">
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
          <input placeholder="Kiyimni yuklang..." className="flex-1 bg-transparent px-4 text-xs outline-none" />
          <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7" /></svg></button>
        </div>
      </div>
    </div>
  );
};

export default ShopAssistant;
