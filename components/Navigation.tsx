
import React from 'react';

interface NavigationProps {
  currentView: 'upload' | 'gallery';
  setView: (view: 'upload' | 'gallery') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around md:relative md:flex-col md:h-screen md:w-64 md:border-r md:border-t-0 z-50">
      <div className="hidden md:block mb-12 px-2">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-900">VogueAI</h1>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Studio Dashboard</p>
      </div>

      <div className="flex flex-row md:flex-col gap-4 w-full">
        <button
          onClick={() => setView('upload')}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentView === 'upload'
              ? 'bg-black text-white shadow-lg shadow-black/10'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Studio</span>
        </button>

        <button
          onClick={() => setView('gallery')}
          className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentView === 'gallery'
              ? 'bg-black text-white shadow-lg shadow-black/10'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span className="font-medium">My Collection</span>
        </button>
      </div>

      <div className="hidden md:block mt-auto pb-8 px-2">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Usage Plan</p>
          <div className="w-full bg-gray-200 h-1 rounded-full mb-3">
            <div className="bg-black h-1 rounded-full w-2/3"></div>
          </div>
          <p className="text-xs text-gray-600">65% of monthly AI credits used.</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
