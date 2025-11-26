
import React from 'react';
import { ViewState, Subject } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  selectedSubject: Subject | null;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, selectedSubject, onHomeClick }) => {
  const isHome = currentView === ViewState.SUBJECT_SELECTION;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={onHomeClick}
          >
            {/* Logo Image Container */}
            <div className="w-12 h-12 mr-3 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md relative bg-black logo-glow transform group-hover:scale-105 transition-transform">
                {/* 
                   ÖNEMLİ: Kendi logonuzu kullanmak için görselinizi 'logo.png' olarak adlandırın 
                   ve projenin 'public' klasörüne atın.
                */}
                <img
                  src="/logo.png"
                  alt="Yusuf Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback in case file is missing
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Yusuf&backgroundColor=0d1b2a&clothing=hoodie&skinColor=edb98a";
                  }}
                />
            </div>
            
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-indigo-900 handwritten tracking-wider leading-none">
                Yusuf
                </h1>
                <span className="text-xs text-slate-500 font-sans font-bold tracking-widest uppercase">Ders Atlası</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto">
            {!isHome && selectedSubject && currentView !== ViewState.ASK_TEACHER && currentView !== ViewState.STUDIO && currentView !== ViewState.GAME && currentView !== ViewState.PDF && currentView !== ViewState.COMPETITION && currentView !== ViewState.TEST_CENTER && (
                 <button
                 onClick={() => setView(ViewState.TOPIC_SELECTION)}
                 className={`hidden sm:block px-3 py-2 rounded-full text-sm font-bold transition-colors border-2 ${
                    currentView === ViewState.TOPIC_SELECTION
                     ? 'bg-white text-gray-800 border-gray-300 shadow-sm' 
                     : `${selectedSubject.colorClass.split(' ')[0]} ${selectedSubject.colorClass.split(' ')[1]} border-transparent`
                 }`}
               >
                 {selectedSubject.title}
               </button>
            )}

            <button
              onClick={() => setView(ViewState.GAME)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.GAME 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <span className="mr-1">🎮</span>
              <span className="hidden sm:inline">Oyun</span>
            </button>

            <button
              onClick={() => setView(ViewState.TEST_CENTER)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.TEST_CENTER 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <span className="mr-1">📝</span>
              <span className="hidden sm:inline">TestTube</span>
            </button>

            <button
              onClick={() => setView(ViewState.ASK_TEACHER)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.ASK_TEACHER 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'text-gray-500 hover:text-pink-600'
              }`}
            >
              <span className="mr-1">🤖</span>
              <span className="hidden sm:inline">Yapay Zekaya Sor</span>
            </button>

            <button
              onClick={() => setView(ViewState.STUDIO)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.STUDIO 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <span className="mr-1">🎨</span>
              <span className="hidden sm:inline">Atölye</span>
            </button>

            <button
              onClick={() => setView(ViewState.PDF)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.PDF 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'text-gray-500 hover:text-yellow-600'
              }`}
            >
              <span className="mr-1">📚</span>
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={() => setView(ViewState.COMPETITION)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === ViewState.COMPETITION 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <span className="mr-1">🏆</span>
              <span className="hidden sm:inline">Yarışma</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
