
import React, { useState, useEffect } from 'react';
import { generateBigRiskBoard } from '../services/geminiService';
import { LoadingState, RiskCategory, RiskQuestion, Team, Topic } from '../types';
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
  const [setupStep, setSetupStep] = useState<'TEAM_SELECT' | 'SUBJECT_SELECT' | 'TOPIC_SELECT' | 'PLAYING'>('TEAM_SELECT');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // Tracks whose turn it is
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState<string>("Karma");
  const [categories, setCategories] = useState<RiskCategory[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [activeQuestion, setActiveQuestion] = useState<{catIndex: number, qIndex: number, question: RiskQuestion} | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const teamColors = [
      'border-red-400 bg-red-600 text-white', 
      'border-blue-400 bg-blue-600 text-white', 
      'border-green-400 bg-green-600 text-white', 
      'border-yellow-400 bg-yellow-600 text-white', 
      'border-purple-400 bg-purple-600 text-white'
  ];

  // CSS for Fireworks
  const fireworkStyles = `
    @keyframes firework {
      0% { transform: translate(var(--x), var(--initialY)); width: var(--initialSize); opacity: 1; }
      50% { width: 0.5vmin; opacity: 1; }
      100% { width: var(--finalSize); opacity: 0; }
    }
    .firework,
    .firework::before,
    .firework::after {
      --initialSize: 0.5vmin;
      --finalSize: 45vmin;
      --particleSize: 0.2vmin;
      --color1: yellow;
      --color2: khaki;
      --color3: white;
      --color4: lime;
      --color5: gold;
      --color6: mediumseagreen;
      --y: -30vmin;
      --x: -50%;
      --initialY: 60vmin;
      content: "";
      animation: firework 2s infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, var(--y));
      width: var(--initialSize);
      aspect-ratio: 1;
      background: 
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%,
        radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
        radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
        radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
        radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%,
        radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%,
        radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%,
        radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 55% 80%,
        radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 70% 77%,
        radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 22% 90%,
        radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 45% 90%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 70%,
        radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 60%,
        radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 31% 80%,
        radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 28% 77%,
        radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 13% 72%,
        radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 80% 10%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 95% 14%,
        radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 90% 23%,
        radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 100% 43%,
        radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 85% 27%,
        radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 77% 37%,
        radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 60% 7%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 22% 14%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 45% 20%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 34%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 10% 29%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 31% 37%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 28% 7%,
        radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 13% 42%;
      background-size: var(--initialSize) var(--initialSize);
      background-repeat: no-repeat;
    }
    .firework::before {
      --x: -50%;
      --y: -50%;
      --initialY: -50%;
      transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
    }
    .firework::after {
      --x: -50%;
      --y: -50%;
      --initialY: -50%;
      transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
    }
    .firework:nth-child(2) { --x: 30vmin; --initialY: 55vmin; }
    .firework:nth-child(2)::before { transform: translate(-50%, -50%) rotate(10deg) scale(0.9) rotateY(20deg); }
    .firework:nth-child(2)::after { transform: translate(-50%, -50%) rotate(120deg) scale(1) rotateY(-10deg); }
    .firework:nth-child(3) { --x: -30vmin; --initialY: 70vmin; }
    .firework:nth-child(3)::before { transform: translate(-50%, -50%) rotate(90deg) scale(1.1) rotateY(60deg); }
    .firework:nth-child(3)::after { transform: translate(-50%, -50%) rotate(10deg) scale(0.8) rotateY(-5deg); }
  `;

  // STEP 1: Set up teams
  const handleTeamCount = (count: number) => {
      const newTeams = Array.from({ length: count }, (_, i) => ({
          id: i,
          name: `${i + 1}. Grup`,
          score: 0,
          color: teamColors[i % teamColors.length]
      }));
      setTeams(newTeams);
      setCurrentTurnIndex(0); // Start with 1st group
      setSetupStep('SUBJECT_SELECT');
  };

  // STEP 2: Select Subject
  const handleSubjectSelect = (subjectId: string) => {
    if (subjectId === 'Karma') {
      setSelectedSubjectId('Karma');
      setGameTitle("Karma (Tüm Dersler)");
      generateGame('Karma', false);
    } else {
      setSelectedSubjectId(subjectId);
      const sub = SUBJECTS.find(s => s.id === subjectId);
      setGameTitle(sub?.title || "Ders");
      setSetupStep('TOPIC_SELECT');
    }
  };

  // STEP 3: Select Topic
  const handleTopicSelect = (topic: Topic) => {
    setGameTitle(topic.title);
    generateGame(topic.title, true);
  };

  // STEP 4: Generate Game
  const generateGame = async (context: string, isTopic: boolean) => {
    setLoadingState(LoadingState.LOADING);
    setSetupStep('PLAYING');
    
    try {
        const boardData = await generateBigRiskBoard(context, isTopic);
        setCategories(boardData);
        setLoadingState(LoadingState.SUCCESS);
    } catch (e) {
        setLoadingState(LoadingState.ERROR);
    }
  };

  // GAMEPLAY: Open Question
  const handleQuestionClick = (catIndex: number, qIndex: number) => {
      if (categories[catIndex].questions[qIndex].isOpened) return;
      setActiveQuestion({ catIndex, qIndex, question: categories[catIndex].questions[qIndex] });
      setShowAnswer(false);
  };

  // GAMEPLAY: Handle Result
  const handleTurnResult = (isCorrect: boolean) => {
      if (!activeQuestion) return;

      const { catIndex, qIndex, question } = activeQuestion;
      const points = question.points;

      // Update current team's score
      setTeams(prevTeams => {
          const updated = [...prevTeams];
          const currentTeam = updated[currentTurnIndex];
          
          if (isCorrect) {
              currentTeam.score += points;
          } else {
              currentTeam.score -= points; // Penalty logic
          }
          return updated;
      });

      // Mark question as opened
      setCategories(prev => {
          const updated = [...prev];
          updated[catIndex].questions[qIndex].isOpened = true;
          return updated;
      });

      setActiveQuestion(null);

      // Rotate turn
      setCurrentTurnIndex(prev => (prev + 1) % teams.length);

      // Check Game Over
      const allOpened = categories.every(cat => cat.questions.every(q => q.isOpened));
      if (allOpened) {
          setIsGameOver(true);
      }
  };

  if (setupStep === 'TEAM_SELECT') {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 rounded-3xl p-8 text-white shadow-2xl">
              <h2 className="text-5xl font-bold mb-12 text-yellow-300 font-handwritten drop-shadow-md">Riskli Yusuf</h2>
              <p className="text-2xl mb-8 font-bold">Kaç grup yarışacak?</p>
              <div className="flex gap-6 flex-wrap justify-center">
                  {[1, 2, 3, 4, 5].map(num => (
                      <button 
                          key={num}
                          onClick={() => handleTeamCount(num)}
                          className="w-20 h-20 rounded-2xl bg-white text-indigo-900 text-4xl font-black shadow-lg hover:bg-yellow-400 hover:scale-110 transition-all border-4 border-indigo-200"
                      >
                          {num}
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  if (setupStep === 'SUBJECT_SELECT') {
    return (
      <div className="min-h-[80vh] p-8 bg-gradient-to-br from-indigo-900 to-purple-800 rounded-3xl text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-10 text-center text-yellow-300 font-handwritten">Hangi Dersten Yarışmak İstersin?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
           <button 
             onClick={() => handleSubjectSelect('Karma')}
             className="p-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl hover:scale-105 transition-transform font-bold text-2xl flex items-center justify-center border-4 border-white border-opacity-20"
           >
             🎲 Karma (Hepsi)
           </button>
           {SUBJECTS.map(sub => (
             <button 
               key={sub.id}
               onClick={() => handleSubjectSelect(sub.id)}
               className={`p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform font-bold text-xl flex flex-col items-center justify-center gap-4 bg-white bg-opacity-10 border-2 border-white border-opacity-30 hover:bg-opacity-20`}
             >
               <span className="text-5xl drop-shadow-md">{sub.icon}</span>
               <span className="text-center">{sub.title}</span>
             </button>
           ))}
        </div>
      </div>
    );
  }

  if (setupStep === 'TOPIC_SELECT') {
    const subTopics = TOPICS.filter(t => t.subjectId === selectedSubjectId);
    return (
      <div className="min-h-[80vh] p-8 bg-gradient-to-br from-indigo-900 to-purple-800 rounded-3xl text-white shadow-2xl">
        <button onClick={() => setSetupStep('SUBJECT_SELECT')} className="mb-6 px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 font-bold">&larr; Geri</button>
        <h2 className="text-4xl font-bold mb-10 text-center text-yellow-300 font-handwritten">{gameTitle} Konusu Seç</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {subTopics.map(topic => (
             <button 
               key={topic.id}
               onClick={() => handleTopicSelect(topic)}
               className="p-6 bg-indigo-800 border-l-8 border-yellow-400 rounded-r-xl shadow-md hover:bg-indigo-700 text-left transition-all"
             >
               <h3 className="font-bold text-xl text-yellow-100 mb-1">{topic.title}</h3>
               <p className="text-sm text-indigo-200">{topic.description}</p>
             </button>
           ))}
        </div>
      </div>
    );
  }

  // --- PLAYING STATE ---

  if (loadingState === LoadingState.LOADING) {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center bg-indigo-900 rounded-3xl text-white">
              <div className="animate-spin text-6xl mb-6">⚙️</div>
              <p className="text-2xl animate-pulse font-bold">Yarışma Hazırlanıyor...</p>
          </div>
      );
  }

  if (isGameOver) {
      // Find winner(s)
      const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
      const winner = sortedTeams[0];

      return (
          <div className="min-h-[80vh] bg-gradient-to-b from-slate-900 to-indigo-900 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-white shadow-2xl">
              <style>{fireworkStyles}</style>
              <div className="firework"></div>
              <div className="firework"></div>
              <div className="firework"></div>
              <div className="firework"></div>
              
              <div className="z-10 text-center animate-fade-in-up p-8">
                  <div className="text-9xl mb-6 drop-shadow-2xl">🏆</div>
                  <h1 className="text-6xl font-bold text-yellow-400 mb-4 font-handwritten drop-shadow-md">TEBRİKLER!</h1>
                  <h2 className="text-5xl font-bold mb-8">{winner.name} Kazandı!</h2>
                  <div className="bg-white bg-opacity-20 p-8 rounded-3xl backdrop-blur-md border border-white border-opacity-30 inline-block">
                      <p className="text-3xl">Puan: <span className="text-yellow-300 font-black text-4xl ml-2">{winner.score}</span></p>
                  </div>
                  
                  <div className="mt-12 space-y-3">
                      {sortedTeams.slice(1).map((t, i) => (
                          <div key={t.id} className="text-xl text-indigo-200 font-medium">
                              {i+2}. {t.name}: <span className="text-white">{t.score} Puan</span>
                          </div>
                      ))}
                  </div>

                  <button 
                    onClick={() => setSetupStep('TEAM_SELECT')}
                    className="mt-12 px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 rounded-full font-black text-xl shadow-xl hover:scale-105 transition-transform"
                  >
                    Yeni Yarışma Başlat
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900 min-h-screen p-2 sm:p-6 rounded-3xl text-white font-sans relative shadow-2xl">
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-8 bg-white bg-opacity-10 p-6 rounded-2xl border border-white border-opacity-10 backdrop-blur-sm">
            <div className="mb-4 xl:mb-0 text-center xl:text-left">
                <h1 className="text-4xl font-black text-yellow-400 font-handwritten tracking-wider drop-shadow-md">Riskli Yusuf</h1>
                <p className="text-sm text-indigo-200 uppercase tracking-widest font-bold mt-1">{gameTitle}</p>
            </div>
            
            {/* Scoreboard */}
            <div className="flex gap-4 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 px-2 justify-center xl:justify-end">
                {teams.map((team, idx) => (
                    <div 
                        key={team.id}
                        className={`px-4 py-3 rounded-xl border-b-4 min-w-[110px] text-center transition-all duration-300 ${
                            currentTurnIndex === idx 
                            ? `${team.color.replace('text-', 'text-opacity-100 ')} transform scale-110 shadow-lg z-10 ring-2 ring-yellow-400` 
                            : 'bg-slate-800 border-slate-700 opacity-60'
                        } ${team.color}`}
                    >
                        <div className="text-xs font-bold mb-1 opacity-80 uppercase tracking-wide">
                            {team.name}
                        </div>
                        <div className="text-3xl font-black">{team.score}</div>
                        {currentTurnIndex === idx && (
                            <div className="text-[10px] mt-1 font-bold bg-white text-black rounded-full px-2 py-0.5 animate-pulse">SIRA SİZDE</div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-5 gap-3 lg:gap-4 max-w-7xl mx-auto h-full">
            {/* Category Headers */}
            {categories.map((cat, i) => (
                <div key={i} className="bg-indigo-950 text-center p-3 rounded-lg border-2 border-indigo-700 flex items-center justify-center min-h-[80px] shadow-lg">
                    <h3 className="font-bold text-xs sm:text-base text-indigo-100 uppercase leading-snug">{cat.title}</h3>
                </div>
            ))}

            {/* Questions Grid */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    {categories.map((cat, colIndex) => {
                        const q = cat.questions[rowIndex];
                        return (
                            <button
                                key={`${colIndex}-${rowIndex}`}
                                onClick={() => handleQuestionClick(colIndex, rowIndex)}
                                disabled={q.isOpened}
                                className={`
                                    h-20 sm:h-32 rounded-xl flex items-center justify-center text-2xl sm:text-4xl font-black shadow-lg transition-all duration-200
                                    ${q.isOpened 
                                        ? 'bg-slate-800 text-slate-600 cursor-default border-2 border-slate-700' 
                                        : 'bg-gradient-to-b from-blue-500 to-blue-700 text-yellow-300 hover:from-blue-400 hover:to-blue-600 border-b-4 border-blue-900 active:translate-y-1 hover:shadow-yellow-400/20'
                                    }
                                `}
                            >
                                {q.isOpened ? '' : q.points}
                            </button>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>

        {/* Question Modal */}
        {activeQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-95 backdrop-blur-md animate-fade-in">
                <div className="bg-indigo-900 w-full max-w-5xl rounded-3xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="bg-yellow-500 p-6 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12"></div>
                        <h3 className="text-yellow-900 font-black text-3xl tracking-widest uppercase relative z-10">
                            {categories[activeQuestion.catIndex].title} &bull; <span className="text-white drop-shadow-md">{activeQuestion.question.points} PUAN</span>
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-16 text-center flex-1 overflow-y-auto flex flex-col items-center justify-center bg-indigo-900">
                        {!showAnswer ? (
                            <div className="prose prose-invert prose-2xl max-w-4xl">
                                <p className="text-4xl sm:text-5xl leading-tight font-bold text-white drop-shadow-lg">
                                    {formatText(activeQuestion.question.question)}
                                </p>
                            </div>
                        ) : (
                            <div className="animate-flip-in-x bg-white bg-opacity-10 p-10 rounded-3xl border border-white border-opacity-20">
                                <p className="text-green-400 text-2xl font-bold mb-4 uppercase tracking-wide">Doğru Cevap</p>
                                <p className="text-4xl sm:text-6xl font-black text-white drop-shadow-xl">
                                    {formatText(activeQuestion.question.answer)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer / Controls */}
                    <div className="p-8 bg-indigo-950 border-t border-indigo-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="text-indigo-300 text-lg hidden sm:block font-medium">
                            Sıra Kimde? <span className="text-yellow-400 font-bold text-xl ml-2 bg-indigo-800 px-3 py-1 rounded-lg">{teams[currentTurnIndex].name}</span>
                        </div>

                        {!showAnswer ? (
                            <button 
                                onClick={() => setShowAnswer(true)}
                                className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-2xl shadow-xl transition-transform hover:scale-105 border-b-4 border-blue-800"
                            >
                                Cevabı Göster
                            </button>
                        ) : (
                            <div className="flex gap-6 w-full sm:w-auto justify-center">
                                <button 
                                    onClick={() => handleTurnResult(false)}
                                    className="flex-1 sm:flex-none px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold shadow-lg border-b-4 border-red-800 text-lg flex flex-col items-center"
                                >
                                    <span>YANLIŞ</span>
                                    <span className="text-sm opacity-80 mt-1">Puan Sil</span>
                                </button>
                                <button 
                                    onClick={() => handleTurnResult(true)}
                                    className="flex-1 sm:flex-none px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold shadow-lg border-b-4 border-green-800 text-lg flex flex-col items-center"
                                >
                                    <span>DOĞRU</span>
                                    <span className="text-sm opacity-80 mt-1">Puan Ver</span>
                                </button>
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
