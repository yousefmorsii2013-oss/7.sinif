import React, { useState } from 'react';
import Header from './components/Header';
import LessonCard from './components/LessonCard';
import LessonView from './components/LessonView';
import StudioView from './components/StudioView';
import { ViewState, Topic } from './types';
import { TOPICS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView(ViewState.LESSON);
  };

  const handleBackToHome = () => {
    setSelectedTopic(null);
    setCurrentView(ViewState.HOME);
  };

  // Color palette for cards - Sciency colors
  const cardColors = [
    'bg-blue-100 text-blue-600',
    'bg-teal-100 text-teal-600',
    'bg-emerald-100 text-emerald-600',
    'bg-indigo-100 text-indigo-600',
    'bg-cyan-100 text-cyan-600',
    'bg-violet-100 text-violet-600',
    'bg-amber-100 text-amber-600',
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header currentView={currentView} setView={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === ViewState.HOME && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 font-handwritten mb-4">
                Hoş Geldin, Genç Bilim İnsanı! 👋
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Bugün evrenin hangi sırrını çözmek istersin? Bir konu seç ve keşfetmeye başla.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {TOPICS.map((topic, index) => (
                <LessonCard 
                  key={topic.id} 
                  topic={topic} 
                  onClick={handleTopicClick}
                  colorClass={cardColors[index % cardColors.length]}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === ViewState.LESSON && selectedTopic && (
          <LessonView topic={selectedTopic} onBack={handleBackToHome} />
        )}

        {currentView === ViewState.STUDIO && (
          <StudioView />
        )}
      </main>
    </div>
  );
};

export default App;