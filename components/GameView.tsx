import React, { useState, useEffect, useRef } from 'react';
import { Subject, LoadingState, GameRound } from '../types';
import { generateGameData } from '../services/geminiService';
import { SUBJECTS } from '../constants';

// --- GAME CONFIG ---
const MAZE_WIDTH = 21;
const MAZE_HEIGHT = 15;
const TILE_SIZE = 30; // Base tile size, scaled via CSS

// 1 = Wall, 0 = Path, 9 = Center Box (Spawn)
// A predefined symmetric maze map
const MAZE_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,9,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,9,9,9,9,9,9,9,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface Point { x: number; y: number }

const GameView: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'round-transition' | 'game-over'>('menu');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // Game Entities
  const [playerPos, setPlayerPos] = useState<Point>({ x: 10, y: 11 });
  const [enemies, setEnemies] = useState<Point[]>([
    { x: 1, y: 1 }, { x: 19, y: 1 }, { x: 1, y: 13 }, { x: 19, y: 13 }
  ]);
  
  // Mapping corners to answers: TL, TR, BL, BR
  const cornerPositions = [
      { x: 1, y: 1, label: 'A' },
      { x: 19, y: 1, label: 'B' },
      { x: 1, y: 13, label: 'C' },
      { x: 19, y: 13, label: 'D' }
  ];
  
  const [roundAnswers, setRoundAnswers] = useState<{text: string, isCorrect: boolean, id: number}[]>([]);
  
  // Refs for Game Loop
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const playerPosRef = useRef<Point>({ x: 10, y: 11 });
  const enemiesRef = useRef<Point[]>([]);
  
  // Controls
  const inputQueue = useRef<{x: number, y: number} | null>(null);

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
    const round = rounds[index];
    if (!round) return;

    // Reset Positions
    const startPos = { x: 10, y: 11 };
    setPlayerPos(startPos);
    playerPosRef.current = startPos;
    
    const startEnemies = [
        { x: 10, y: 7 }, // Middle
        { x: 1, y: 1 },  // Corner
        { x: 19, y: 1 }  // Corner
    ];
    setEnemies(startEnemies);
    enemiesRef.current = startEnemies;

    // Prepare Answers (Shuffle)
    const answers = [
        { text: round.correctAnswer, isCorrect: true, id: 0 },
        ...round.wrongAnswers.map((ans, i) => ({ text: ans, isCorrect: false, id: i+1 }))
    ].sort(() => Math.random() - 0.5);

    setRoundAnswers(answers);
    setGameState('playing');
    setFeedback('none');
    inputQueue.current = null;
  };

  // --- GAME LOOP & LOGIC ---
  const isValidMove = (x: number, y: number) => {
      if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) return false;
      return MAZE_MAP[y][x] !== 1;
  };

  const movePlayer = (dx: number, dy: number) => {
      const current = playerPosRef.current;
      const nextX = current.x + dx;
      const nextY = current.y + dy;

      if (isValidMove(nextX, nextY)) {
          playerPosRef.current = { x: nextX, y: nextY };
          setPlayerPos({ x: nextX, y: nextY });
          checkCollisions(nextX, nextY);
      }
  };

  const checkCollisions = (px: number, py: number) => {
      // Check Enemies
      for (const en of enemiesRef.current) {
          if (en.x === px && en.y === py) {
              handleDeath();
              return;
          }
      }

      // Check Answers (Corners)
      const hitCornerIndex = cornerPositions.findIndex(c => Math.abs(c.x - px) <= 1 && Math.abs(c.y - py) <= 1);
      
      if (hitCornerIndex !== -1 && roundAnswers[hitCornerIndex]) {
          const answer = roundAnswers[hitCornerIndex];
          if (answer.isCorrect) {
              handleWin();
          } else {
              handleDeath(); // Wrong answer kills in this hard mode? Or just resets? Let's say resets.
          }
      }
  };

  const moveEnemies = () => {
      // Simple Random/Chase AI
      const newEnemies = enemiesRef.current.map(en => {
          // 30% chance to chase player, 70% random valid move
          const moves = [
              {x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}
          ];
          
          let validMoves = moves.filter(m => isValidMove(en.x + m.x, en.y + m.y));
          if (validMoves.length === 0) return en;

          // Simple chase logic: pick move that reduces distance to player
          const dx = playerPosRef.current.x - en.x;
          const dy = playerPosRef.current.y - en.y;
          
          let chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];

          if (Math.random() > 0.6) { // Chase Factor
               const bestMove = validMoves.sort((a, b) => {
                   const distA = Math.abs((en.x + a.x) - playerPosRef.current.x) + Math.abs((en.y + a.y) - playerPosRef.current.y);
                   const distB = Math.abs((en.x + b.x) - playerPosRef.current.x) + Math.abs((en.y + b.y) - playerPosRef.current.y);
                   return distA - distB;
               })[0];
               if (bestMove) chosenMove = bestMove;
          }

          return { x: en.x + chosenMove.x, y: en.y + chosenMove.y };
      });
      
      enemiesRef.current = newEnemies;
      setEnemies(newEnemies);
      
      // Check collision after enemy move
      for (const en of newEnemies) {
        if (en.x === playerPosRef.current.x && en.y === playerPosRef.current.y) {
            handleDeath();
        }
      }
  };

  const handleWin = () => {
      setGameState('round-transition');
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => {
          if (currentRoundIndex < gameRounds.length - 1) {
              setCurrentRoundIndex(p => p + 1);
              startRound(currentRoundIndex + 1, gameRounds);
          } else {
              setGameState('game-over');
          }
      }, 1500);
  };

  const handleDeath = () => {
      setFeedback('wrong');
      // Reset position to center but keep playing same round
      setTimeout(() => {
        setPlayerPos({ x: 10, y: 11 });
        playerPosRef.current = { x: 10, y: 11 };
        setFeedback('none');
      }, 500);
  };

  // Game Loop Interval
  useEffect(() => {
      if (gameState !== 'playing') return;

      const moveInterval = setInterval(() => {
          if (inputQueue.current) {
              movePlayer(inputQueue.current.x, inputQueue.current.y);
              inputQueue.current = null;
          }
      }, 150); // Player Speed

      const enemyInterval = setInterval(() => {
          moveEnemies();
      }, 400); // Enemy Speed (Slower)

      return () => {
          clearInterval(moveInterval);
          clearInterval(enemyInterval);
      };
  }, [gameState, roundAnswers]); // Re-bind if round answers change

  // Input Handlers
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (gameState !== 'playing') return;
          if (e.key === 'ArrowUp') inputQueue.current = {x: 0, y: -1};
          if (e.key === 'ArrowDown') inputQueue.current = {x: 0, y: 1};
          if (e.key === 'ArrowLeft') inputQueue.current = {x: -1, y: 0};
          if (e.key === 'ArrowRight') inputQueue.current = {x: 1, y: 0};
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleTouchControl = (dx: number, dy: number) => {
      if (gameState === 'playing') {
          inputQueue.current = {x: dx, y: dy};
      }
  };

  const formatText = (text: string) => {
    if (text.startsWith('$') && text.endsWith('$')) {
       return <span className="font-serif italic font-black">{text.slice(1, -1)}</span>;
    }
    return text;
 };

  return (
    <div className="max-w-4xl mx-auto pb-8 select-none">
       {/* MENU SCREEN */}
       {selectedSubjectId === null && (
        <div className="text-center py-10 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-indigo-600 font-handwritten mb-6">Labirent Kovalamaca 🏃‍♂️</h2>
          <p className="text-gray-600 text-lg mb-10">
            Karakterini yönet, hayaletlerden kaç ve doğru köşeye ulaş!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {SUBJECTS.map((sub) => (
               <button
                 key={sub.id}
                 onClick={() => startGame(sub)}
                 className={`p-6 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-xl border-b-4 bg-white ${sub.colorClass} border-transparent`}
               >
                 <div className="text-5xl mb-4">{sub.icon}</div>
                 <h3 className="text-xl font-bold">{sub.title}</h3>
               </button>
             ))}
          </div>
        </div>
      )}

      {selectedSubjectId && (
          <div className="flex flex-col items-center">
              
              {/* Header */}
              <div className="w-full flex justify-between items-center mb-4 px-4">
                  <button 
                    onClick={() => { setSelectedSubjectId(null); setGameState('menu'); }}
                    className="bg-white px-4 py-2 rounded-full font-bold shadow-md text-gray-700 hover:bg-gray-100"
                  >
                    &larr; Çıkış
                  </button>
                  <div className="bg-indigo-100 text-indigo-800 px-6 py-2 rounded-full font-bold shadow-sm">
                      Puan: {score}
                  </div>
              </div>

              {/* Game Area */}
              <div className="relative bg-slate-800 p-2 rounded-xl shadow-2xl border-4 border-slate-600">
                  
                  {/* Question Banner */}
                  <div className="absolute -top-16 left-0 right-0 flex justify-center z-10">
                    <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-indigo-200 text-center max-w-lg">
                        {loadingState === LoadingState.SUCCESS && (
                             <h3 className="font-bold text-gray-800 text-lg">
                                 {gameState === 'game-over' ? 'Oyun Bitti!' : gameRounds[currentRoundIndex]?.question}
                             </h3>
                        )}
                        {loadingState === LoadingState.LOADING && "Labirent Hazırlanıyor..."}
                    </div>
                  </div>

                  {/* Feedback Overlay */}
                  {feedback !== 'none' && (
                      <div className={`absolute inset-0 z-20 flex items-center justify-center bg-opacity-40 rounded-lg ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                          <div className="text-6xl animate-bounce">
                              {feedback === 'correct' ? '✅' : '❌'}
                          </div>
                      </div>
                  )}

                  {/* MAZE RENDER */}
                  {loadingState === LoadingState.SUCCESS && (
                      <div 
                        className="grid gap-0.5 bg-slate-900"
                        style={{ 
                            gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
                            width: 'min(90vw, 630px)',
                            aspectRatio: `${MAZE_WIDTH}/${MAZE_HEIGHT}`
                        }}
                      >
                          {MAZE_MAP.map((row, y) => (
                              row.map((cell, x) => {
                                  // Determine content of cell
                                  const isWall = cell === 1;
                                  const isPlayer = playerPos.x === x && playerPos.y === y;
                                  const isEnemy = enemies.some(e => e.x === x && e.y === y);
                                  
                                  // Check if this cell is a corner answer zone
                                  const cornerIdx = cornerPositions.findIndex(c => Math.abs(c.x - x) <= 1 && Math.abs(c.y - y) <= 1);
                                  const isCorner = cornerIdx !== -1;
                                  const answerText = isCorner ? roundAnswers[cornerIdx]?.text : null;
                                  
                                  // High visibility styling for answers: Yellow Background, Black Text
                                  const cornerColorClass = 'bg-yellow-400 border border-yellow-500 shadow-inner';

                                  return (
                                      <div 
                                        key={`${x}-${y}`} 
                                        className={`relative w-full h-full flex items-center justify-center
                                            ${isWall ? 'bg-slate-700 rounded-sm' : 'bg-slate-900'}
                                            ${isCorner && !isWall ? cornerColorClass : ''}
                                        `}
                                      >
                                          {isCorner && !isWall && (
                                              <span className="absolute inset-0 flex items-center justify-center text-[9px] sm:text-[11px] font-black text-black leading-none text-center p-0.5 break-words z-10 drop-shadow-sm">
                                                  {formatText(answerText || '')}
                                              </span>
                                          )}
                                          
                                          {/* Dot for path */}
                                          {!isWall && !isCorner && !isPlayer && !isEnemy && (
                                              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                                          )}

                                          {/* Player */}
                                          {isPlayer && (
                                              <div className="w-[80%] h-[80%] bg-yellow-400 rounded-full shadow-lg border-2 border-yellow-600 z-20 animate-pulse relative">
                                                 <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full"></div> {/* Eye */}
                                              </div>
                                          )}

                                          {/* Enemy */}
                                          {isEnemy && (
                                              <div className="w-[80%] h-[80%] bg-pink-500 rounded-t-full shadow-lg z-20 relative border border-pink-600">
                                                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                                                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></div>
                                              </div>
                                          )}
                                      </div>
                                  );
                              })
                          ))}
                      </div>
                  )}
                  
                   {gameState === 'game-over' && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900/90 text-white rounded-lg">
                            <h2 className="text-4xl font-bold mb-4">Oyun Bitti!</h2>
                            <p className="text-2xl mb-8 text-yellow-400">Skor: {score}</p>
                            <button 
                                onClick={() => startGame(selectedSubject!)}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                            >
                                Tekrar Oyna
                            </button>
                        </div>
                    )}
              </div>

              {/* Mobile Controls */}
              <div className="mt-8 grid grid-cols-3 gap-2 w-48">
                  <div></div>
                  <button 
                    onPointerDown={() => handleTouchControl(0, -1)}
                    className="bg-gray-200 active:bg-gray-300 p-4 rounded-xl shadow-md text-2xl"
                  >⬆️</button>
                  <div></div>
                  
                  <button 
                    onPointerDown={() => handleTouchControl(-1, 0)}
                    className="bg-gray-200 active:bg-gray-300 p-4 rounded-xl shadow-md text-2xl"
                  >⬅️</button>
                  <div className="flex items-center justify-center font-bold text-gray-400">Kontrol</div>
                  <button 
                    onPointerDown={() => handleTouchControl(1, 0)}
                    className="bg-gray-200 active:bg-gray-300 p-4 rounded-xl shadow-md text-2xl"
                  >➡️</button>
                  
                  <div></div>
                  <button 
                    onPointerDown={() => handleTouchControl(0, 1)}
                    className="bg-gray-200 active:bg-gray-300 p-4 rounded-xl shadow-md text-2xl"
                  >⬇️</button>
                  <div></div>
              </div>

          </div>
      )}
    </div>
  );
};

export default GameView;