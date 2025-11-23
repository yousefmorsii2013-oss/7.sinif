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
            <span className="text-3xl mr-2 transform group-hover:rotate-12 transition-transform">🎒</span>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-700 handwritten tracking-wider leading-none">
                Ders Atlası
                </h1>
                <span className="text-xs text-slate-500 font-sans">7. Sınıf Dijital Okul</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-3">
            {!isHome && selectedSubject && currentView !== ViewState.ASK_TEACHER && currentView !== ViewState.STUDIO && currentView !== ViewState.GAME && (
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;