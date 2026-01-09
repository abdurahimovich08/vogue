
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
      content: "Xush kelibsiz. Kiyim rasmini yuklang, men uni professional studio darajasiga ko'taraman va inventar tizimiga kiritaman.", 
      type: 'text' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [colors, setColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [stockMatrix, setStockMatrix] = useState<Record<string, number>>({});

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: generateSecureId() }]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          content: `AI tahlili tayyor. Ma'lumotlarni tekshiring va variantlarni kiriting.`, 
          type: 'form',
          data: { ...analysis, originalImage: base64 }
        });
      } catch (err) {
        setIsTyping(false);
        addMessage({ role: 'ai', content: "Xatolik yuz berdi. Qayta urinib ko'ring." });
      }
    };
    reader.readAsDataURL(file);
  };

  const finalizeListing = async (formData: any) => {
    setIsTyping(true);
    addMessage({ role: 'ai', content: "Mo'jizaviy surat yaratilmoqda..." });

    try {
      const profImage = await generateProfessionalShot(formData.originalImage, formData.name);
      
      const variants: ProductVariant[] = [];
      colors.forEach(color => {
        selectedSizes.forEach(size => {
          variants.push({
            id: generateSecureId(),
            color,
            size,
            stock: stockMatrix[`${color}-${size}`] || 0
          });
        });
      });

      const newProduct: Product = {
        id: generateSecureId(),
        sellerId: 'auth-v1',
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
        content: `Muvaffaqiyatli! Mahsulot ${variants.length} variantda e'longa chiqarildi.`, 
        type: 'comparison',
        data: { original: formData.originalImage, generated: profImage }
      });
    } catch (err) {
      setIsTyping(false);
      addMessage({ role: 'ai', content: "Tasvirni yaratishda xatolik." });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white animate-apple">
      {/* Header */}
      <div className="px-6 py-10 apple-blur sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.05]">
        <button onClick={onBack} className="w-11 h-11 bg-white/5 rounded-full flex items-center justify-center active:scale-90 transition-transform border border-white/5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
           <p className="text-[10px] font-black tracking-[0.4em] text-[#0A84FF] uppercase">AI Production</p>
           <h2 className="text-sm font-bold">Vogue Intelligence</h2>
        </div>
        <div className="w-11"></div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-10 no-scrollbar pb-40">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-apple`}>
            <div className={`max-w-[85%] space-y-4`}>
              {m.type === 'image' && (
                <div className="rounded-[28px] overflow-hidden border border-white/10 w-48 shadow-2xl">
                  <img src={m.data} className="w-full" alt="User upload" />
                </div>
              )}
              
              <div className={`px-6 py-4 rounded-[24px] text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#0A84FF] text-white' : 'bg-[#1C1C1E] text-white/90 border border-white/[0.05]'}`}>
                {m.content}
              </div>

              {m.type === 'form' && (
                <div className="apple-card p-8 space-y-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Name</label>
                      <input id={`name-${m.id}`} defaultValue={m.data.name} className="w-full bg-white/5 p-4 rounded-2xl text-xs font-bold outline-none border border-white/5 focus:border-[#0A84FF] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Price ($)</label>
                      <input id={`price-${m.id}`} type="number" defaultValue={m.data.suggestedPrice} className="w-full bg-white/5 p-4 rounded-2xl text-xs font-bold outline-none border border-white/5 focus:border-[#0A84FF] transition-all" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Sizes</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                        <button 
                          key={sz}
                          onClick={() => selectedSizes.includes(sz) ? setSelectedSizes(selectedSizes.filter(s => s !== sz)) : setSelectedSizes([...selectedSizes, sz])}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all ${selectedSizes.includes(sz) ? 'bg-white text-black' : 'bg-white/5 text-white/30'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const getV = (id: string) => (document.getElementById(id) as HTMLInputElement).value;
                      finalizeListing({
                        ...m.data,
                        name: getV(`name-${m.id}`),
                        price: getV(`price-${m.id}`),
                        category: m.data.category
                      });
                    }} 
                    className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all shadow-xl"
                  >
                    Finish Production
                  </button>
                </div>
              )}

              {m.type === 'comparison' && (
                <div className="flex gap-4 w-full">
                   <div className="rounded-2xl overflow-hidden border border-white/10 opacity-40 flex-1"><img src={m.data.original} className="w-full aspect-[3/4] object-cover" /></div>
                   <div className="rounded-2xl overflow-hidden border border-[#0A84FF] flex-1 shadow-[0_0_40px_rgba(10,132,255,0.25)]"><img src={m.data.generated} className="w-full aspect-[3/4] object-cover" /></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="p-4 text-[10px] font-black text-[#0A84FF] animate-pulse uppercase tracking-widest">Processing Intelligence...</div>}
      </div>

      {/* Input Bar */}
      <div className="p-8 apple-blur border-t border-white/[0.05] fixed bottom-0 left-0 right-0">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all border border-white/10 shadow-xl">
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
          <div className="flex-1 bg-white/5 rounded-full px-6 py-4 border border-white/10 text-white/20 text-sm font-medium">
            Upload garment photo...
          </div>
          <button className="w-14 h-14 bg-[#0A84FF] rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopAssistant;
