import React, { useState } from 'react';
import Header from './components/Header';
import LessonCard from './components/LessonCard';
import SubjectCard from './components/SubjectCard';
import LessonView from './components/LessonView';
import StudioView from './components/StudioView';
import AskTeacherView from './components/AskTeacherView';
import GameView from './components/GameView';
import { ViewState, Topic, Subject } from './types';
import { TOPICS, SUBJECTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.SUBJECT_SELECTION);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView(ViewState.TOPIC_SELECTION);
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView(ViewState.LESSON);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentView(ViewState.TOPIC_SELECTION);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setCurrentView(ViewState.SUBJECT_SELECTION);
  };

  // Color palette for topic cards (reused for variety)
  const cardColors = [
    'bg-blue-100 text-blue-600',
    'bg-teal-100 text-teal-600',
    'bg-emerald-100 text-emerald-600',
    'bg-indigo-100 text-indigo-600',
    'bg-cyan-100 text-cyan-600',
    'bg-violet-100 text-violet-600',
    'bg-amber-100 text-amber-600',
  ];

  // Filter topics based on selected subject
  const filteredTopics = selectedSubject 
    ? TOPICS.filter(t => t.subjectId === selectedSubject.id) 
    : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        selectedSubject={selectedSubject}
        onHomeClick={handleBackToSubjects}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SUBJECT SELECTION VIEW */}
        {currentView === ViewState.SUBJECT_SELECTION && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 font-handwritten mb-4">
                Merhaba! Bugün Hangi Dersi Çalışmak İstersin? 👋
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                7. Sınıf müfredatındaki tüm dersler burada. Başlamak için birini seç.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SUBJECTS.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  onClick={handleSubjectClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* TOPIC SELECTION VIEW */}
        {currentView === ViewState.TOPIC_SELECTION && selectedSubject && (
           <div className="animate-fade-in-up">
             <div className="flex items-center mb-8">
                <button 
                  onClick={handleBackToSubjects}
                  className="mr-4 text-gray-500 hover:text-gray-800"
                >
                  &larr; Derslere Dön
                </button>
                <h2 className="text-3xl font-bold text-gray-800 font-handwritten">
                  {selectedSubject.title} Konuları
                </h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredTopics.map((topic, index) => (
                 <LessonCard 
                   key={topic.id} 
                   topic={topic} 
                   onClick={handleTopicClick}
                   colorClass={cardColors[index % cardColors.length]}
                 />
               ))}
               {filteredTopics.length === 0 && (
                 <p className="text-gray-500">Bu ders için henüz konu eklenmemiş.</p>
               )}
             </div>
           </div>
        )}

        {/* LESSON VIEW */}
        {currentView === ViewState.LESSON && selectedTopic && selectedSubject && (
          <LessonView 
            topic={selectedTopic} 
            subject={selectedSubject}
            onBack={handleBackToTopics} 
          />
        )}

        {/* STUDIO VIEW */}
        {currentView === ViewState.STUDIO && (
          <StudioView />
        )}

        {/* ASK TEACHER VIEW */}
        {currentView === ViewState.ASK_TEACHER && (
          <AskTeacherView />
        )}

        {/* GAME VIEW */}
        {currentView === ViewState.GAME && (
          <GameView />
        )}
      </main>
    </div>
  );
};

export default App;