import React, { useState, useEffect, useRef } from 'react';
import { Subject, LoadingState, GameRound } from '../types';
import { generateGameData } from '../services/geminiService';
import { SUBJECTS } from '../constants';

interface Cloud {
  id: number;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

const GameView: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'round-transition' | 'game-over'>('menu');
  
  // Game Refs for Loop
  const requestRef = useRef<number>(0);
  const planeYRef = useRef<number>(50); // Percentage 0-100
  const cloudsRef = useRef<Cloud[]>([]);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // React State for rendering
  const [planeY, setPlaneY] = useState(50);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [lastFeedback, setLastFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const selectedSubject = SUBJECTS.find(s => s.id === selectedSubjectId);

  // --- INITIALIZATION ---
  const startGame = async (subject: Subject) => {
    setSelectedSubjectId(subject.id);
    setLoadingState(LoadingState.LOADING);
    setScore(0);
    setCurrentRoundIndex(0);
    
    try {
      const rounds = await generateGameData(subject.title);
      setGameRounds(rounds);
      setLoadingState(LoadingState.SUCCESS);
      startRound(0, rounds);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const startRound = (index: number, rounds: GameRound[]) => {
    setGameState('playing');
    setLastFeedback('none');
    
    // Spawn Clouds for this round
    const round = rounds[index];
    if (!round) return;

    const answers = [
        { text: round.correctAnswer, isCorrect: true },
        ...round.wrongAnswers.map(ans => ({ text: ans, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    // Create cloud objects distributed vertically
    const newClouds: Cloud[] = answers.map((ans, i) => ({
        id: Date.now() + i,
        text: ans.text,
        isCorrect: ans.isCorrect,
        x: 100 + (i * 25), // Staggered start X
        y: 10 + (Math.random() * 70), // Random Y between 10% and 80%
        width: 15, // percent
        height: 12, // percent
        speed: 0.3 + (Math.random() * 0.1) // Random speed
    }));

    cloudsRef.current = newClouds;
    setClouds(newClouds);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(requestRef.current);
      return;
    }

    const updateGame = () => {
        // Update Cloud Positions
        let cloudsChanged = false;
        const currentClouds = cloudsRef.current;
        
        // Move clouds left
        currentClouds.forEach(cloud => {
            cloud.x -= cloud.speed;
        });

        // Remove off-screen clouds
        const activeClouds = currentClouds.filter(c => c.x > -20);
        if (activeClouds.length !== currentClouds.length) {
             // If correct answer goes off screen, respawn it? Or fail?
             // For simplicity, we loop them back if missed, or fail round.
             // Let's loop them back for endless runner feel until hit.
             const missedClouds = currentClouds.filter(c => c.x <= -20);
             missedClouds.forEach(mc => {
                 mc.x = 110 + (Math.random() * 20);
                 mc.y = 10 + (Math.random() * 70);
             });
             cloudsChanged = true;
        } else {
             cloudsChanged = true; // Always update for smooth animation
        }
        
        cloudsRef.current = activeClouds.length === currentClouds.length ? currentClouds : activeClouds;

        // Collision Detection
        // Plane is roughly at X: 10%, Width: 8%, Height: 8% (Visual approx)
        const planeRect = { x: 10, y: planeYRef.current, w: 8, h: 6 }; 

        for (const cloud of cloudsRef.current) {
             // Simple AABB collision in percentage space
             // Check overlap
             if (
                 planeRect.x < cloud.x + cloud.width &&
                 planeRect.x + planeRect.w > cloud.x &&
                 planeRect.y < cloud.y + cloud.height &&
                 planeRect.y + planeRect.h > cloud.y
             ) {
                 handleCollision(cloud);
                 break; // Handle one collision per frame
             }
        }

        if (cloudsChanged) {
            setClouds([...cloudsRef.current]);
        }

        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);


  // --- INPUT HANDLING ---
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (gameState !== 'playing' || !gameContainerRef.current) return;

      let clientY = 0;
      if ('touches' in e) {
          clientY = e.touches[0].clientY;
      } else {
          clientY = (e as React.MouseEvent).clientY;
      }

      const rect = gameContainerRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const percentageY = (relativeY / rect.height) * 100;
      
      // Clamp
      const clampedY = Math.max(5, Math.min(90, percentageY));
      
      planeYRef.current = clampedY;
      setPlaneY(clampedY);
  };

  const handleCollision = (cloud: Cloud) => {
      if (cloud.isCorrect) {
          // CORRECT
          setScore(s => s + 10);
          setLastFeedback('correct');
          setGameState('round-transition');
          
          setTimeout(() => {
              if (currentRoundIndex < gameRounds.length - 1) {
                  setCurrentRoundIndex(prev => prev + 1);
                  startRound(currentRoundIndex + 1, gameRounds);
              } else {
                  setGameState('game-over');
              }
          }, 1000);
      } else {
          // WRONG
          // Just remove the cloud and shake screen, deduct points?
          // Let's push the cloud away or explode it.
          // For simplicity: Flash red, remove cloud.
          setLastFeedback('wrong');
          setTimeout(() => setLastFeedback('none'), 500);
          
          // Remove this cloud from array
          cloudsRef.current = cloudsRef.current.filter(c => c.id !== cloud.id);
          setClouds([...cloudsRef.current]);
      }
  };

  // Helper for Math Formatting
  const formatText = (text: string) => {
     if (text.startsWith('$') && text.endsWith('$')) {
        return <span className="font-serif italic font-bold">{text.slice(1, -1)}</span>;
     }
     return text;
  };

  return (
    <div className="max-w-6xl mx-auto h-full pb-8 select-none">
      
      {/* MENU SCREEN */}
      {selectedSubjectId === null && (
        <div className="text-center py-10 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-sky-600 font-handwritten mb-6">Bilgi Uçağı ✈️</h2>
          <p className="text-gray-600 text-lg mb-10">
            Pilot sensin! Uçağı fare ile yönet ve doğru bulutların içinden geç.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {SUBJECTS.map((sub) => (
               <button
                 key={sub.id}
                 onClick={() => startGame(sub)}
                 className={`p-6 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-xl border-b-4 bg-white ${sub.colorClass} border-transparent`}
               >
                 <div className="text-5xl mb-4">{sub.icon}</div>
                 <h3 className="text-xl font-bold">{sub.title} Uçuşu</h3>
               </button>
             ))}
          </div>
        </div>
      )}

      {/* GAME SCREEN */}
      {selectedSubjectId && (
        <div 
            ref={gameContainerRef}
            className="relative w-full h-[600px] bg-sky-400 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300 cursor-crosshair touch-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
          
          {/* Header UI */}
          <div className="absolute top-4 left-4 right-4 flex justify-between z-50 pointer-events-none">
             <button 
               onClick={() => { setSelectedSubjectId(null); setGameState('menu'); }}
               className="bg-white px-4 py-2 rounded-full font-bold shadow-md pointer-events-auto hover:bg-gray-100 text-gray-700"
             >
               &larr; Çıkış
             </button>
             
             {/* QUESTION DISPLAY */}
             {loadingState === LoadingState.SUCCESS && gameState !== 'game-over' && (
                 <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-2xl font-bold shadow-lg text-xl border-2 border-sky-200 max-w-xl text-center">
                    {gameRounds[currentRoundIndex]?.question}
                 </div>
             )}

             <div className="bg-white px-6 py-2 rounded-full font-bold shadow-md text-xl text-gray-700">
               Puan: <span className="text-green-600">{score}</span>
             </div>
          </div>

          {/* Feedback Flash Overlay */}
          <div className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-300 ${
              lastFeedback === 'correct' ? 'bg-green-400 opacity-30' : 
              lastFeedback === 'wrong' ? 'bg-red-500 opacity-40' : 'opacity-0'
          }`}></div>

          {/* Loading Screen */}
          {loadingState === LoadingState.LOADING && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-sky-200">
               <div className="text-6xl animate-spin mb-4">✈️</div>
               <p className="text-xl font-bold text-sky-800">Motorlar Çalıştırılıyor...</p>
            </div>
          )}

          {/* GAME OVER SCREEN */}
          {gameState === 'game-over' && (
             <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white animate-fade-in backdrop-blur-sm">
                <div className="text-8xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold mb-2">Uçuş Tamamlandı!</h2>
                <p className="text-xl mb-6">Toplam Puan: {score} / {gameRounds.length * 10}</p>
                <button 
                  onClick={() => startGame(selectedSubject!)}
                  className="px-8 py-3 bg-sky-500 hover:bg-sky-600 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105"
                >
                  Tekrar Uç 🛫
                </button>
             </div>
          )}

          {/* BACKGROUND ELEMENTS */}
          {/* Moving sky/clouds background effect could be CSS, but let's keep it simple color */}
          <div className="absolute bottom-0 w-full h-32 bg-green-600/30 rounded-t-[50%] blur-3xl transform translate-y-10"></div>
          
          {/* PLANE */}
          {loadingState === LoadingState.SUCCESS && (
            <div 
                className="absolute left-[10%] w-20 h-16 z-30 transition-transform duration-75 ease-out"
                style={{ top: `${planeY}%`, transform: 'translateY(-50%)' }}
            >
                {/* Simple CSS Plane */}
                <div className="relative w-full h-full">
                    {/* Body */}
                    <div className="absolute top-1/2 left-0 w-full h-8 bg-red-600 rounded-full shadow-lg transform -translate-y-1/2 border-2 border-red-800"></div>
                    {/* Wing Top */}
                    <div className="absolute top-0 left-4 w-12 h-2 bg-red-700 rounded-full border border-red-900"></div>
                    {/* Wing Bottom */}
                    <div className="absolute bottom-0 left-4 w-12 h-2 bg-red-700 rounded-full border border-red-900"></div>
                    {/* Propeller */}
                    <div className="absolute top-1/2 right-0 w-2 h-10 bg-gray-800 rounded-full animate-spin-fast transform -translate-y-1/2"></div>
                    {/* Tail */}
                    <div className="absolute top-1/2 left-0 w-4 h-8 bg-red-700 transform -translate-y-1/2 -skew-x-12 border border-red-900"></div>
                    {/* Cockpit */}
                    <div className="absolute top-4 left-8 w-6 h-4 bg-sky-200 rounded-t-full border border-sky-300 opacity-80"></div>
                </div>
            </div>
          )}

          {/* CLOUDS (Answers) */}
          {loadingState === LoadingState.SUCCESS && clouds.map((cloud) => (
             <div
                key={cloud.id}
                className="absolute z-20 flex items-center justify-center text-center"
                style={{
                    left: `${cloud.x}%`,
                    top: `${cloud.y}%`,
                    width: `${cloud.width}%`,
                    height: `${cloud.height}%`,
                    transform: 'translateY(-50%)'
                }}
             >
                {/* Cloud Graphic */}
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-white rounded-full shadow-lg opacity-90 border-4 border-slate-100"></div>
                    <div className="absolute -top-4 left-2 w-10 h-10 bg-white rounded-full"></div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-white rounded-full"></div>
                    <div className="absolute -top-2 right-2 w-10 h-10 bg-white rounded-full"></div>
                    
                    {/* Text */}
                    <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                        <span className="text-slate-700 font-bold text-sm sm:text-base leading-tight drop-shadow-sm select-none">
                            {formatText(cloud.text)}
                        </span>
                    </div>
                </div>
             </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default GameView;
