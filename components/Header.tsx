import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-teal-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setView(ViewState.HOME)}
          >
            <span className="text-3xl mr-2">🧬</span>
            <h1 className="text-2xl font-bold text-teal-600 handwritten tracking-wider">
              Fen Atlası
            </h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === ViewState.HOME 
                  ? 'bg-teal-100 text-teal-700' 
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              Dersler
            </button>
            <button
              onClick={() => setView(ViewState.STUDIO)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === ViewState.STUDIO 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Görsel Laboratuvar
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;