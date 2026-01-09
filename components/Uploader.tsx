
import React, { useState, useRef } from 'react';
import { ModelVibe, GenerationConfig, GeneratedImage, BodyType, ClothingSize } from '../types';
import { generateModelShot } from '../services/gemini';

interface UploaderProps {
  onSuccess: (image: GeneratedImage) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onSuccess }) => {
  const [isFittingRoom, setIsFittingRoom] = useState(false);
  const [clothPreview, setClothPreview] = useState<string | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<GenerationConfig>({
    vibe: ModelVibe.STUDIO,
    gender: 'Female',
    lighting: 'Natural',
    measurements: {
      height: 175,
      weight: 70,
      bodyType: 'Average'
    },
    clothingSize: 'M'
  });

  const clothInputRef = useRef<HTMLInputElement>(null);
  const personInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cloth' | 'person') => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cloth') setClothPreview(reader.result as string);
        else setPersonPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!clothPreview || (isFittingRoom && !personPreview)) return;
    setError(null);
    setIsGenerating(true);

    try {
      if (isHighQuality) {
        // Safe check for AI Studio environment (Project IDX)
        // This prevents crashes on Vercel where window.aistudio is undefined
        // @ts-ignore
        if (typeof window !== 'undefined' && window.aistudio && window.aistudio.hasSelectedApiKey) {
           // @ts-ignore
           if (!(await window.aistudio.hasSelectedApiKey())) {
             // @ts-ignore
             await window.aistudio.openSelectKey();
           }
        }
      }

      const generatedUrl = await generateModelShot(
        clothPreview, 
        config, 
        isHighQuality, 
        isFittingRoom ? personPreview! : undefined
      );
      
      onSuccess({
        id: Math.random().toString(36).substr(2, 9),
        originalUrl: clothPreview,
        personUrl: personPreview || undefined,
        generatedUrl: generatedUrl,
        timestamp: Date.now(),
        prompt: isFittingRoom 
          ? `Fitting ${config.clothingSize} size on ${config.measurements?.height}cm person` 
          : `Model wearing item in ${config.vibe}`,
        category: isFittingRoom ? 'Personal Try-On' : config.vibe,
        isFittingRoom: isFittingRoom
      });
      
      setClothPreview(null);
      setPersonPreview(null);
    } catch (err: any) {
      console.error("Generation Error:", err);
      // Handle API key selection reset if the request fails with "Requested entity was not found"
      // Only applicable in AI Studio environment
      if (err.message?.includes('Requested entity was not found')) {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.aistudio) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
          setError("Iltimos, API kalitini tanlang va qaytadan 'Create' tugmasini bosing.");
          return;
        }
      }
      
      setError(err.message || "Rasm yaratishda xatolik yuz berdi. Internet aloqasi yoki API kalitini tekshiring.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mx-auto mb-8 shadow-inner">
        <button 
          onClick={() => { setIsFittingRoom(false); setError(null); }}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${!isFittingRoom ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Studio (Modelda)
        </button>
        <button 
          onClick={() => { setIsFittingRoom(true); setError(null); }}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${isFittingRoom ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Virtual Kiyib Ko'rish (Sizda)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center">1</span>
              Kiyim rasmi
            </h3>
            {!clothPreview ? (
              <div onClick={() => clothInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                <span className="text-xs text-gray-400 font-medium">Kiyimni yuklang</span>
              </div>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <img src={clothPreview} className="w-full h-full object-contain" alt="Cloth" />
                <button onClick={() => setClothPreview(null)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-red-500 hover:bg-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            )}
            <input type="file" ref={clothInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cloth')} />
          </div>

          {isFittingRoom && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-left duration-500 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center">2</span>
                Sizning rasmingiz
              </h3>
              {!personPreview ? (
                <div onClick={() => personInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                  <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-xs text-gray-400 font-medium">O'z rasmingizni yuklang</span>
                </div>
              ) : (
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={personPreview} className="w-full h-full object-cover" alt="Person" />
                  <button onClick={() => setPersonPreview(null)} className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-red-500 hover:bg-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              <input type="file" ref={personInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'person')} />
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
            <h2 className="text-2xl font-serif font-bold mb-8 text-gray-800 border-b border-gray-50 pb-4">
              {isFittingRoom ? "Virtual Fitting Sozlamalari" : "Studio Generatsiyasi"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
              {isFittingRoom ? (
                <>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bo'y: {config.measurements?.height} sm</label>
                      </div>
                      <input 
                        type="range" min="140" max="210" 
                        value={config.measurements?.height} 
                        onChange={(e) => setConfig({ ...config, measurements: { ...config.measurements!, height: parseInt(e.target.value) } })}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vazn: {config.measurements?.weight} kg</label>
                      </div>
                      <input 
                        type="range" min="40" max="150" 
                        value={config.measurements?.weight} 
                        onChange={(e) => setConfig({ ...config, measurements: { ...config.measurements!, weight: parseInt(e.target.value) } })}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Tana turi</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Athletic', 'Slim', 'Average', 'Curvy', 'Large'].map((t) => (
                          <button 
                            key={t} onClick={() => setConfig({ ...config, measurements: { ...config.measurements!, bodyType: t as BodyType } })}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${config.measurements?.bodyType === t ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Kiyim o'lchami</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                          <button 
                            key={s} onClick={() => setConfig({ ...config, clothingSize: s as ClothingSize })}
                            className={`py-3 rounded-xl text-xs font-black transition-all border ${config.clothingSize === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2 text-indigo-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Eslatma</span>
                      </div>
                      <p className="text-xs text-indigo-900/70 leading-relaxed font-medium">Realistik natija uchun o'lchamlarni aniq kiriting. AI bu ma'lumotlar asosida kiyimning tana bo'ylab qanday buklanishini hisoblaydi.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Model Jinsi</label>
                      <div className="flex gap-2">
                        {['Male', 'Female', 'Non-binary'].map((g) => (
                          <button key={g} onClick={() => setConfig({...config, gender: g as any})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${config.gender === g ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-400'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Atmosfera</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.values(ModelVibe) as ModelVibe[]).map((v) => (
                          <button key={v} onClick={() => setConfig({...config, vibe: v})} className={`py-3 px-3 rounded-xl text-[10px] font-bold transition-all border ${config.vibe === v ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-400'}`}>{v}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                     <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Yoritish</label>
                      <div className="flex gap-2">
                        {['Natural', 'Soft', 'Dramatic'].map((l) => (
                          <button key={l} onClick={() => setConfig({...config, lighting: l as any})} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${config.lighting === l ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-400'}`}>{l}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isHighQuality ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                   </div>
                   <div>
                     <span className="text-sm font-black text-gray-800 tracking-tight">Ultra Realistik Rejim</span>
                     <p className="text-[10px] text-gray-400 font-medium">Professional natija uchun Gemini 3 Pro (Tavsiya etiladi)</p>
                   </div>
                </div>
                <button 
                    onClick={() => setIsHighQuality(!isHighQuality)}
                    className={`w-14 h-7 rounded-full transition-all relative ${isHighQuality ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${isHighQuality ? 'left-8' : 'left-1'}`} />
                </button>
              </div>

              <button
                disabled={!clothPreview || (isFittingRoom && !personPreview) || isGenerating}
                onClick={handleGenerate}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl ${
                  !clothPreview || (isFittingRoom && !personPreview) || isGenerating 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-black text-white hover:scale-[1.01] active:scale-95 hover:shadow-black/20'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    AI Hisoblamoqda...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>{isFittingRoom ? "Kiyimni menga kiydir" : "Modelda yaratish"}</span>
                  </>
                )}
              </button>
              {error && (
                <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 items-start animate-in fade-in duration-300">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
