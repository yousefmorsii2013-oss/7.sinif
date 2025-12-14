
import React, { useState, useEffect } from 'react';
import { generateBigRiskBoard } from '../services/geminiService';
import { LoadingState, RiskCategory, Team } from '../types';
import { SUBJECTS, TOPICS } from '../constants';

// Formatting helper for math content
const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\$.*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-yellow-300 font-bold">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={index} className="font-serif italic px-1 mx-0.5 bg-white bg-opacity-20 rounded inline-block">
            {part.slice(1, -1)}
          </span>
        );
      } else {
        return part;
      }
    });
};

const CompetitionView: React.FC = () => {
  const [setupStep, setSetupStep] = useState<'TEAM_SELECT' | 'SUBJECT_SELECT' | 'TOPIC_SELECT' | 'PLAYING' | 'WINNER'>('TEAM_SELECT');
  // We initialize with 3 teams. Names are placeholders, we will render 1, 2, 3 based on index.
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: '1', score: 0, color: 'bg-slate-700' },
    { id: 2, name: '2', score: 0, color: 'bg-slate-700' },
    { id: 3, name: '3', score: 0, color: 'bg-slate-700' }
  ]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0); // Tracks whose turn it is
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [categories, setCategories] = useState<RiskCategory[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [activeQuestion, setActiveQuestion] = useState<{ categoryIndex: number, questionIndex: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Helper to get number from index (0->1, 1->2, 2->3)
  const getTeamName = (index: number) => (index + 1).toString();

  // Initial Setup helpers
  const handleAddTeam = () => {
    if (teams.length < 5) {
      setTeams([...teams, { 
        id: teams.length + 1, 
        name: getTeamName(teams.length), 
        score: 0,
        color: 'bg-slate-700'
      }]);
    }
  };

  const handleRemoveTeam = () => {
      if (teams.length > 2) {
          setTeams(teams.slice(0, -1));
      }
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSetupStep('TOPIC_SELECT');
  };

  const handleTopicSelect = async (topicOrMix: string) => {
    setLoadingState(LoadingState.LOADING);
    
    try {
      const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);
      const isSpecific = topicOrMix !== "Karma";
      
      const data = await generateBigRiskBoard(isSpecific ? topicOrMix : currentSubject!.title, isSpecific);
      setCategories(data);
      setSetupStep('PLAYING');
      setCurrentTeamIndex(0); // Reset to first team
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleQuestionClick = (catIndex: number, qIndex: number) => {
    if (categories[catIndex].questions[qIndex].isOpened) return;
    setActiveQuestion({ categoryIndex: catIndex, questionIndex: qIndex });
    setShowAnswer(false);
  };

  // Turn Logic: Answer Correct or Incorrect
  const handleAnswerResult = (isCorrect: boolean) => {
    if (!activeQuestion) return;
    
    const points = categories[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].points;

    // Update Score
    const updatedTeams = [...teams];
    if (isCorrect) {
        updatedTeams[currentTeamIndex].score += points;
    } else {
        updatedTeams[currentTeamIndex].score -= points;
    }
    setTeams(updatedTeams);

    // Close Question
    const newCategories = [...categories];
    newCategories[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].isOpened = true;
    setCategories(newCategories);
    setActiveQuestion(null);
    setShowAnswer(false);
    
    // Check Game Over (Are all questions opened?)
    const allOpened = newCategories.every(cat => cat.questions.every(q => q.isOpened));
    if (allOpened) {
        setSetupStep('WINNER');
    } else {
        // Switch to next team only if game continues
        setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
    }
  };

  const closeQuestionWithoutScore = () => {
      setActiveQuestion(null);
      setShowAnswer(false);
  };

  const resetGame = () => {
      setSetupStep('SUBJECT_SELECT');
      setCategories([]);
      setTeams(teams.map(t => ({ ...t, score: 0 })));
      setCurrentTeamIndex(0);
  };

  const getWinners = () => {
      if (teams.length === 0) return [];
      const maxScore = Math.max(...teams.map(t => t.score));
      return teams.filter(t => t.score === maxScore);
  };

  // --- RENDER ---

  if (setupStep === 'TEAM_SELECT') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in-up text-center">
        <h2 className="text-4xl font-black text-indigo-900 mb-8 font-handwritten">Yarışmacı Gruplar</h2>
        
        <div className="flex justify-center gap-6 mb-12">
          {teams.map((team, index) => (
            <div key={team.id} className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-slate-200 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">TAKIM</span>
              <span className="text-6xl font-black text-slate-700">{getTeamName(index)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-8">
            <button onClick={handleAddTeam} disabled={teams.length >= 5} className="px-6 py-2 bg-green-100 text-green-700 rounded-full font-bold hover:bg-green-200 disabled:opacity-50">
                + Takım Ekle
            </button>
            <button onClick={handleRemoveTeam} disabled={teams.length <= 2} className="px-6 py-2 bg-red-100 text-red-700 rounded-full font-bold hover:bg-red-200 disabled:opacity-50">
                - Çıkar
            </button>
        </div>

        <button 
            onClick={() => setSetupStep('SUBJECT_SELECT')}
            className="px-12 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 text-xl transition-transform hover:-translate-y-1"
        >
            BAŞLA &rarr;
        </button>
      </div>
    );
  }

  if (setupStep === 'SUBJECT_SELECT') {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
        <button onClick={() => setSetupStep('TEAM_SELECT')} className="mb-6 text-gray-500 font-bold hover:text-indigo-600">&larr; Gruplara Dön</button>
        <h2 className="text-3xl font-black text-center mb-10 text-gray-800">Yarışma Konusunu Seç</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {SUBJECTS.map(subject => (
            <button
              key={subject.id}
              onClick={() => handleSubjectSelect(subject.id)}
              className={`p-6 rounded-2xl shadow-md border-b-4 bg-white hover:bg-gray-50 transition-all ${subject.colorClass}`}
            >
              <div className="text-5xl mb-4">{subject.icon}</div>
              <h3 className="text-xl font-bold">{subject.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (setupStep === 'TOPIC_SELECT' && selectedSubjectId) {
    const subject = SUBJECTS.find(s => s.id === selectedSubjectId);
    const topics = TOPICS.filter(t => t.subjectId === selectedSubjectId);

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in">
        <button onClick={() => setSetupStep('SUBJECT_SELECT')} className="mb-6 text-gray-500 font-bold hover:text-indigo-600">&larr; Derslere Dön</button>
        
        {loadingState === LoadingState.LOADING ? (
           <div className="text-center py-20">
             <div className="animate-spin w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-xl font-bold text-indigo-800">Yarışma Hazırlanıyor...</p>
           </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">{subject?.title} Yarışması</h2>
            <p className="text-center text-gray-600 mb-8">İstersen belirli bir ünite seç, istersen karma yap.</p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleTopicSelect("Karma")}
                className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg font-bold text-xl hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                🔀 Karma Yarışma (Tüm Üniteler)
              </button>
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.promptContext)}
                  className="p-5 bg-white border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all"
                >
                  <span className="font-bold text-gray-800 block">{topic.title}</span>
                  <span className="text-sm text-gray-500">{topic.description}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // WINNER SCREEN
  if (setupStep === 'WINNER') {
      const winners = getWinners();
      return (
        <div className={`fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center overflow-hidden text-white`}>
            {/* Fireworks Background */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
               <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
               <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-red-500 rounded-full animate-ping delay-100"></div>
               <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-blue-500 rounded-full animate-ping delay-200"></div>
               <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-green-500 rounded-full animate-ping delay-500"></div>
               <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
               <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full animate-ping delay-300"></div>
            </div>

            <div className="z-10 text-center animate-scale-in">
                <div className="text-8xl mb-6">🏆</div>
                <h1 className="text-6xl font-black mb-4 text-yellow-400 drop-shadow-lg">TEBRİKLER!</h1>
                
                {winners.map((winner, idx) => (
                    <div key={idx} className="mb-8">
                        <div className="text-8xl font-black mb-2">TAKIM {getTeamName(teams.indexOf(winner))}</div>
                        <div className="text-3xl font-bold bg-white text-slate-900 px-8 py-2 rounded-full inline-block">
                            {winner.score} PUAN
                        </div>
                    </div>
                ))}

                <button 
                    onClick={resetGame}
                    className="mt-8 px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-2xl shadow-xl transition-transform hover:scale-105"
                >
                    Yeni Oyun Başlat
                </button>
            </div>
        </div>
      );
  }

  // GAME BOARD LAYOUT
  return (
    <div className={`
      ${isFullScreen ? 'fixed inset-0 z-[100]' : 'min-h-screen'} 
      bg-slate-900 text-white font-sans flex flex-col md:flex-row transition-all duration-300
    `}>
      
      {/* LEFT SIDEBAR: TEAMS */}
      <div className={`
        ${isFullScreen ? 'w-24 md:w-48' : 'w-full md:w-64'} 
        bg-slate-800 p-4 border-r border-slate-700 flex flex-col items-center transition-all duration-300
      `}>
          {!isFullScreen && (
            <button onClick={() => setSetupStep('SUBJECT_SELECT')} className="self-start mb-6 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 text-xs font-bold">
                &larr; Çıkış
            </button>
          )}
          
          <div className="mb-4 text-center">
              <h1 className={`font-black text-yellow-400 tracking-tighter leading-none ${isFullScreen ? 'text-xs md:text-xl' : 'text-2xl'} font-handwritten transform -rotate-2 shadow-black drop-shadow-md`}>
                  RİSKLİ<br/>YUSUF
              </h1>
          </div>

          <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-6 text-xs md:text-sm">SKORLAR</h3>
          
          <div className="space-y-6 w-full flex flex-col items-center">
              {teams.map((team, index) => {
                  const isTurn = index === currentTeamIndex;
                  return (
                      <div 
                        key={team.id}
                        className={`
                            relative rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                            ${isFullScreen ? 'w-16 h-16 md:w-32 md:h-32' : 'w-20 h-20 md:w-32 md:h-32'}
                            ${isTurn ? 'bg-white text-slate-900 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-4 ring-yellow-400' : 'bg-slate-700 text-gray-400 opacity-80'}
                        `}
                      >
                          {isTurn && (
                              <div className="absolute -top-3 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full animate-bounce">
                                  SIRA
                              </div>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">TAKIM</span>
                          <span className={`font-black ${isFullScreen ? 'text-2xl md:text-5xl' : 'text-3xl md:text-5xl'}`}>{getTeamName(index)}</span>
                          <div className={`mt-1 font-bold px-2 py-0.5 rounded-full text-xs md:text-base ${isTurn ? 'bg-slate-100 text-slate-800' : 'bg-slate-800'}`}>
                              {team.score}
                          </div>
                      </div>
                  );
              })}
          </div>

          {/* FULL SCREEN TOGGLE BUTTON - BOTTOM LEFT */}
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute bottom-4 left-4 p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white shadow-lg transition-colors border border-slate-600 group"
            title={isFullScreen ? "Küçült" : "Tam Ekran Yap"}
          >
            {isFullScreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 14m0 0l5 5m-5-5h16M15 15l5-5m0 0l-5-5m5 5H4" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            )}
          </button>
      </div>

      {/* MAIN CONTENT: RISK BOARD */}
      <div className="flex-1 p-2 md:p-8 flex items-center justify-center overflow-auto">
        <div className={`grid grid-cols-5 gap-2 w-full ${isFullScreen ? 'h-[90vh]' : 'max-w-6xl'}`}>
            {/* Categories Header */}
            {categories.map((cat, idx) => (
            <div key={idx} className="bg-indigo-600 p-1 sm:p-4 rounded-lg flex items-center justify-center text-center shadow-md border-b-4 border-indigo-800 min-h-[60px]">
                <h3 className={`font-bold leading-tight uppercase ${isFullScreen ? 'text-lg md:text-2xl' : 'text-[10px] sm:text-sm md:text-base'}`}>{cat.title}</h3>
            </div>
            ))}

            {/* Questions Grid */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
                {categories.map((cat, colIndex) => {
                const question = cat.questions[rowIndex];
                return (
                    <button
                    key={`${colIndex}-${rowIndex}`}
                    onClick={() => handleQuestionClick(colIndex, rowIndex)}
                    disabled={question.isOpened}
                    className={`
                        rounded-lg font-black shadow-md transition-all transform
                        flex items-center justify-center relative overflow-hidden group
                        ${isFullScreen ? 'text-4xl md:text-6xl' : 'text-xl sm:text-3xl h-16 sm:h-24'}
                        ${question.isOpened 
                        ? 'bg-slate-800 text-slate-600 cursor-default border border-slate-700' 
                        : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 hover:scale-105 border-b-4 border-yellow-600'
                        }
                    `}
                    >
                    {!question.isOpened && (
                        <>
                        <span className="relative z-10">{question.points}</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </>
                    )}
                    </button>
                );
                })}
            </React.Fragment>
            ))}
        </div>
      </div>

      {/* QUESTION MODAL */}
      {activeQuestion && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black bg-opacity-95 backdrop-blur-sm animate-fade-in">
          <div className="bg-indigo-800 w-full max-w-5xl rounded-3xl shadow-2xl border-4 border-yellow-400 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="bg-indigo-900 p-6 flex justify-between items-center border-b border-indigo-700">
              <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold text-2xl">
                      {categories[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].points} Puan
                  </div>
                  <span className="text-gray-300 font-bold tracking-wide text-xl">
                      {categories[activeQuestion.categoryIndex].title}
                  </span>
              </div>
              <button onClick={closeQuestionWithoutScore} className="text-gray-400 hover:text-white text-4xl">&times;</button>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-16 flex-1 flex flex-col items-center justify-center text-center overflow-y-auto">
              {/* CURRENT TEAM INDICATOR IN MODAL */}
              <div className="mb-12">
                  <span className="block text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">CEVAP SIRASI</span>
                  <div className="inline-block bg-white text-indigo-900 text-4xl font-black px-10 py-3 rounded-2xl shadow-lg transform -rotate-2 border-b-8 border-indigo-200">
                      TAKIM {getTeamName(currentTeamIndex)}
                  </div>
              </div>

              {!showAnswer ? (
                <div className="animate-scale-in w-full">
                  <p className="text-3xl sm:text-5xl font-medium leading-relaxed text-white mb-16">
                    {formatText(categories[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].question)}
                  </p>
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="px-12 py-5 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 rounded-full font-bold text-2xl shadow-xl transition-transform hover:scale-105"
                  >
                    Cevabı Göster 👁️
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in w-full">
                  <p className="text-base text-indigo-300 uppercase font-bold mb-6 tracking-widest">DOĞRU CEVAP</p>
                  <p className="text-4xl sm:text-6xl font-black text-green-400 mb-16 drop-shadow-lg leading-tight">
                    {formatText(categories[activeQuestion.categoryIndex].questions[activeQuestion.questionIndex].answer)}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
                      <button 
                        onClick={() => handleAnswerResult(true)}
                        className="p-8 bg-green-600 hover:bg-green-500 text-white rounded-3xl shadow-xl transition-transform hover:scale-105 border-b-8 border-green-800 flex flex-col items-center"
                      >
                          <span className="text-5xl mb-3">✅</span>
                          <span className="text-3xl font-black">DOĞRU</span>
                          <span className="text-sm opacity-90 mt-2 font-bold">Takım {getTeamName(currentTeamIndex)} Kazanır</span>
                      </button>

                      <button 
                        onClick={() => handleAnswerResult(false)}
                        className="p-8 bg-red-600 hover:bg-red-500 text-white rounded-3xl shadow-xl transition-transform hover:scale-105 border-b-8 border-red-800 flex flex-col items-center"
                      >
                          <span className="text-5xl mb-3">❌</span>
                          <span className="text-3xl font-black">YANLIŞ</span>
                          <span className="text-sm opacity-90 mt-2 font-bold">Takım {getTeamName(currentTeamIndex)} Kaybeder</span>
                      </button>
                  </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionView;
