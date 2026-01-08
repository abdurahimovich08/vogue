
import React, { useState } from 'react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Hozircha natijalar yo'q</h3>
        <p className="text-gray-500 max-w-sm">Kiyim rasmini yuklang va AI sizga qanday turishini ko'rsatib beradi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Mening To'plamim</h2>
          <p className="text-sm text-gray-500">{images.length} ta dizayn yaratildi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
              <img src={img.generatedUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${img.isFittingRoom ? 'bg-indigo-600' : 'bg-black'}`}>
                  {img.isFittingRoom ? 'Custom Try-On' : img.category}
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                   <img src={img.originalUrl} className="w-full h-full object-contain" />
                 </div>
                 {img.personUrl && (
                   <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                     <img src={img.personUrl} className="w-full h-full object-cover" />
                   </div>
                 )}
              </div>
              <button className="text-[10px] font-bold text-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100">Batafsil</button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          
          <div className="flex flex-col md:flex-row gap-12 max-w-7xl w-full max-h-[90vh]">
            <div className="flex-1 flex items-center justify-center">
              <img src={selectedImage.generatedUrl} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-indigo-500/20" />
            </div>
            
            <div className="w-full md:w-96 bg-white rounded-3xl p-8 flex flex-col shadow-2xl">
              <h3 className="text-2xl font-serif font-bold mb-8">Dizayn Tafsilotlari</h3>
              
              <div className="space-y-8 flex-1">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Manba Kiyim</label>
                    <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden p-2">
                       <img src={selectedImage.originalUrl} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  {selectedImage.personUrl && (
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Foydalanuvchi</label>
                      <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
                        <img src={selectedImage.personUrl} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Holat</label>
                   <p className="text-sm font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">"{selectedImage.prompt}"</p>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <a href={selectedImage.generatedUrl} download="vogue-ai.png" className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Rasmni Yuklab Olish
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
