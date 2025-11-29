
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

  // Configuration for Yusuf's Avatar (Specific Request)
  // Using DiceBear v9 API (Micah style)
  // baseColor: ac6651 (Esmer/Tan)
  // hair: danny (Long Wavy/Curly style)
  // eyebrows: up (Thinner, higher, not connected)
  // eyes: round (Large/Round)
  const avatarUrl = "https://api.dicebear.com/9.x/micah/svg?seed=YusufCurlyV2&baseColor=ac6651&hair=danny&hairColor=0e0e0e&eyes=round&eyebrows=up&mouth=smile&earringsProbability=0&glassesProbability=0";

  // Fallback SVG (Generic Face) in case internet blocks DiceBear
  const fallbackAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ac6651'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> 
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={onHomeClick}
          >
            {/* Logo Image Container */}
            <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-2 border-indigo-600 shadow-lg relative bg-white transform group-hover:scale-105 transition-transform">
                <img
                  src={avatarUrl}
                  alt="Yusuf Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to generic face icon, NOT a letter
                    e.currentTarget.src = fallbackAvatar;
                    e.currentTarget.style.padding = '4px'; // Add padding for the icon
                  }}
                />
            </div>
            
            <div className="flex flex-col">
                <h1 className="text-3xl font-black text-indigo-900 tracking-tight leading-none font-sans">
                YUSUF
                </h1>
                <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">Ders Atlası</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto">
            {/* Main Page Button - Added as requested */}
            <button
              onClick={onHomeClick}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                isHome 
                  ? 'bg-slate-100 text-slate-800 font-bold border border-slate-200' 
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              <span className="mr-1 text-lg">🏠</span>
              <span className="hidden sm:inline">Ana Sayfa</span>
            </button>

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
              <span className="mr-1 text-lg">🎮</span>
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
              <span className="mr-1 text-lg">📝</span>
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
              <span className="mr-1 text-lg">🤖</span>
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
              <span className="mr-1 text-lg">🎨</span>
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
              <span className="mr-1 text-lg">📚</span>
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
              <span className="mr-1 text-lg">🏆</span>
              <span className="hidden sm:inline">Yarışma</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
