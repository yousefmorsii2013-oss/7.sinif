
import React, { useState, useEffect, useRef } from 'react';
import { Subject, LoadingState, GameRound } from '../types';
import { generateGameData } from '../services/geminiService';
import { SUBJECTS } from '../constants';

// --- GAME CONFIG ---
const MAZE_WIDTH = 21;
const MAZE_HEIGHT = 15;

// MAP LEGEND:
// 1 = Wall
// 0 = Path
// 9 = Center Spawn Area
// 2 = Answer Room Floor
const MAZE_MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,1,0,0,0,0,0,1,0,0,0,0,0,1,2,2,2,1],
    [1,2,2,2,1,0,1,1,1,0,1,0,1,1,1,0,1,2,2,2,1],
    [1,2,2,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,2,2,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,9,9,9,9,9,0,0,0,0,0,1,0,1], // Row 7 (Spawn Center)
    [1,0,1,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,2,2,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,2,2,1],
    [1,2,2,2,1,0,1,1,1,0,1,0,1,1,1,0,1,2,2,2,1],
    [1,2,2,2,1,0,0,0,0,0,1,0,0,0,0,0,1,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Updated Room Centers to be in the 4 corners
const ROOM_CENTERS = [
    { id: 0, x: 2, y: 2, label: 'Top Left' },
    { id: 1, x: 18, y: 2, label: 'Top Right' },
    { id: 2, x: 2, y: 12, label: 'Bottom Left' },
    { id: 3, x: 18, y: 12, label: 'Bottom Right' }
];

interface Point { x: number; y: number }
interface Enemy extends Point {
    id: number;
    color: string;
    shape: 'triangle' | 'square' | 'circle';
    speed: 'slow' | 'medium' | 'fast';
}

// --- VISUAL COMPONENTS ---

const EnemyAvatar: React.FC<{ color: string, shape: 'triangle' | 'square' | 'circle' }> = ({ color, shape }) => {
    const fillColorClass = color.replace('bg-', 'fill-');

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md filter saturate-150">
            <defs>
                <radialGradient id="gradEnemy" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </radialGradient>
            </defs>

            {shape === 'triangle' && (
                <g>
                    <polygon points="50,10 90,85 10,85" className={`${fillColorClass} stroke-white`} strokeWidth="3" />
                    <circle cx="40" cy="55" r="6" fill="#00ff00" className="animate-pulse" />
                    <circle cx="60" cy="55" r="6" fill="#00ff00" className="animate-pulse" />
                </g>
            )}

            {shape === 'square' && (
                <g>
                    <rect x="15" y="15" width="70" height="70" rx="10" className={`${fillColorClass} stroke-white`} strokeWidth="3" />
                    <rect x="25" y="25" width="50" height="50" fill="url(#gradEnemy)" />
                    <rect x="30" y="40" width="15" height="10" fill="#ff0000" className="animate-pulse" />
                    <rect x="55" y="40" width="15" height="10" fill="#ff0000" className="animate-pulse" />
                </g>
            )}

            {shape === 'circle' && (
                <g>
                    <circle cx="50" cy="50" r="40" className={`${fillColorClass} stroke-white`} strokeWidth="3" />
                    <circle cx="50" cy="50" r="25" fill="#333" opacity="0.5" />
                    <circle cx="50" cy="50" r="10" fill="yellow" className="animate-ping" />
                </g>
            )}
        </svg>
    );
};

const RobotAvatar: React.FC<{ isMoving: boolean, direction: 'left' | 'right', isSafe: boolean }> = ({ isMoving, direction, isSafe }) => {
    return (
        <div className="relative w-full h-full">
            {isSafe && (
                <div className="absolute -inset-4 border-4 border-cyan-400 rounded-full animate-pulse opacity-60 z-0"></div>
            )}
            <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-lg transition-transform duration-150 relative z-10 ${direction === 'left' ? '-scale-x-100' : ''}`}>
                 <g transform={isMoving ? "translate(0, -2)" : ""}>
                    {/* Antenna */}
                    <line x1="50" y1="20" x2="50" y2="5" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="50" cy="5" r="4" fill={isSafe ? "#00ff00" : "#ef4444"} className={isMoving ? "animate-ping" : ""} />
                    
                    {/* Head */}
                    <rect x="25" y="20" width="50" height="35" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                    
                    {/* Face Screen */}
                    <rect x="30" y="30" width="40" height="15" rx="4" fill="#1e293b" />
                    
                    {/* EYES - Bright Cyan */}
                    <circle cx="40" cy="37" r="4" fill="#00ffff" className="animate-pulse" />
                    <circle cx="60" cy="37" r="4" fill="#00ffff" className="animate-pulse" />

                    {/* Body */}
                    <path d="M 30 60 L 70 60 L 75 85 L 25 85 Z" fill="#fff" stroke="#475569" strokeWidth="2" />
                    <rect x="40" y="65" width="20" height="10" rx="2" fill="#cbd5e1" />
                    
                    {/* Wheels/Tracks */}
                    <circle cx="25" cy="65" r="8" fill="#94a3b8" />
                    <circle cx="75" cy="65" r="8" fill="#94a3b8" />
                    <circle cx="35" cy="85" r="8" fill="#1e293b" />
                    <circle cx="65" cy="85" r="8" fill="#1e293b" />
                 </g>
            </svg>
        </div>
    );
};

// NEON TRIANGLE CONTROLS
const ArrowControl = ({ direction, onTap }: { direction: 'up' | 'down' | 'left' | 'right', onTap: () => void }) => {
    const points = {
        up: "50,15 15,85 85,85",
        down: "50,85 15,15 85,15",
        left: "15,50 85,15 85,85",
        right: "85,50 15,15 15,85"
    };

    return (
        <button
            className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 focus:outline-none transition-transform active:scale-90 opacity-80 hover:opacity-100 touch-none"
            onPointerDown={(e) => { e.preventDefault(); onTap(); }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] filter">
                <polygon 
                    points={points[direction]} 
                    fill="rgba(34, 211, 238, 0.2)" 
                    stroke="#22d3ee" 
                    strokeWidth="4" 
                    strokeLinejoin="round"
                />
                {/* Inner Glow/Detail */}
                <polygon 
                    points={points[direction]} 
                    fill="none" 
                    stroke="#a5f3fc" 
                    strokeWidth="2" 
                    strokeDasharray="4 4"
                    transform="scale(0.7) translate(21,21)"
                    className="opacity-70"
                />
            </svg>
        </button>
    );
};

const GameView: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'round-transition' | 'game-over'>('menu');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isSafe, setIsSafe] = useState(false);

  // Game Entities
  const [playerPos, setPlayerPos] = useState<Point>({ x: 10, y: 7 }); 
  const [playerDir, setPlayerDir] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  
  const [roundAnswers, setRoundAnswers] = useState<{text: string, isCorrect: boolean, id: number}[]>([]);
  
  const playerPosRef = useRef<Point>({ x: 10, y: 7 });
  const playerMovementRef = useRef<Point>({ x: 0, y: 0 }); // Current Movement Vector
  const enemiesRef = useRef<Enemy[]>([]);
  const isSafeRef = useRef(false);

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

    // Reset Player to center
    const startPos = { x: 10, y: 7 };
    setPlayerPos(startPos);
    playerPosRef.current = startPos;
    playerMovementRef.current = { x: 0, y: 0 };
    setPlayerDir('right');
    setIsMoving(false);
    
    // Safety Period
    setIsSafe(true);
    isSafeRef.current = true;
    setTimeout(() => {
        setIsSafe(false);
        isSafeRef.current = false;
    }, 3000); 
    
    // PROGRESSIVE ENEMY SPAWNING
    const newEnemies: Enemy[] = [];
    
    // Spawn enemies away from the center but not in answer rooms to avoid camping
    newEnemies.push({ x: 10, y: 1, id: 0, color: 'bg-red-500', shape: 'triangle', speed: 'fast' }); // Top Middle
    newEnemies.push({ x: 10, y: 13, id: 1, color: 'bg-orange-500', shape: 'triangle', speed: 'fast' }); // Bottom Middle

    if (index >= 1) {
        newEnemies.push({ x: 1, y: 7, id: 2, color: 'bg-purple-600', shape: 'square', speed: 'slow' }); // Left Middle
    }
    if (index >= 2) {
        newEnemies.push({ x: 19, y: 7, id: 3, color: 'bg-pink-500', shape: 'circle', speed: 'medium' }); // Right Middle
    }
    if (index >= 4) {
         newEnemies.push({ x: 5, y: 7, id: 4, color: 'bg-blue-500', shape: 'square', speed: 'slow' });
    }

    setEnemies(newEnemies);
    enemiesRef.current = newEnemies;

    const allAnswers = [
        { text: round.correctAnswer, isCorrect: true, id: 0 },
        ...round.wrongAnswers.map((ans, i) => ({ text: ans, isCorrect: false, id: i+1 }))
    ];
    allAnswers.sort(() => Math.random() - 0.5);
    setRoundAnswers(allAnswers);

    setGameState('playing');
    setFeedback('none');
  };

  // --- MOVEMENT LOGIC ---
  const handleInput = (dx: number, dy: number) => {
    // Visual direction
    if (dx > 0) setPlayerDir('right');
    if (dx < 0) setPlayerDir('left');
    
    // Set auto-move direction
    playerMovementRef.current = { x: dx, y: dy };
    setIsMoving(true); // Immediate visual feedback
  };

  const isValidMove = (x: number, y: number) => {
      if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) return false;
      return MAZE_MAP[y][x] !== 1;
  };

  const checkCollisions = (px: number, py: number) => {
      // 1. Enemy Collision
      if (!isSafeRef.current) {
          for (const en of enemiesRef.current) {
              if (Math.abs(en.x - px) < 0.6 && Math.abs(en.y - py) < 0.6) {
                  handleDeath();
                  return;
              }
          }
      }

      // 2. Answer Collision
      const roomHit = ROOM_CENTERS.findIndex(room => 
          Math.abs(room.x - px) < 1.5 && Math.abs(room.y - py) < 1.5
      );

      if (roomHit !== -1 && roundAnswers[roomHit]) {
          if (Math.abs(ROOM_CENTERS[roomHit].x - px) < 1.0 && Math.abs(ROOM_CENTERS[roomHit].y - py) < 1.0) {
              const answer = roundAnswers[roomHit];
              if (answer.isCorrect) {
                  handleWin();
              } else {
                  handleDeath();
              }
          }
      }
  };

  // --- GAME LOOPS ---

  // Player Auto-Movement Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
        const { x: dx, y: dy } = playerMovementRef.current;
        
        // If not moving, do nothing
        if (dx === 0 && dy === 0) {
            if (isMoving) setIsMoving(false);
            return;
        }

        const current = playerPosRef.current;
        const nextX = current.x + dx;
        const nextY = current.y + dy;

        // Try to move in the current direction
        if (isValidMove(nextX, nextY)) {
            playerPosRef.current = { x: nextX, y: nextY };
            setPlayerPos({ x: nextX, y: nextY });
            setIsMoving(true);
            checkCollisions(nextX, nextY);
        } else {
            // Hit Wall - Stop
            playerMovementRef.current = { x: 0, y: 0 };
            setIsMoving(false);
        }
    }, 150); // Move every 150ms

    return () => clearInterval(moveInterval);
  }, [gameState, roundAnswers, gameRounds]);

  // Enemy Movement Loop
  const moveEnemies = () => {
      const newEnemies = enemiesRef.current.map(en => {
          // Speed logic
          if (en.speed === 'slow' && Math.random() > 0.6) return en;
          if (en.speed === 'medium' && Math.random() > 0.8) return en;

          const moves = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
          let validMoves = moves.filter(m => isValidMove(en.x + m.x, en.y + m.y));
          
          if (validMoves.length === 0) return en;

          let chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          const distToPlayer = Math.abs(en.x - playerPosRef.current.x) + Math.abs(en.y - playerPosRef.current.y);
          
          // AI Logic
          if (isSafeRef.current) {
              // SAFETY MODE: WANDER RANDOMLY, DO NOT CHASE
              chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else {
              // CHASE MODE
              let chaseChance = 0.2;
              if (en.shape === 'triangle') chaseChance = 0.7;
              if (en.shape === 'circle') chaseChance = 0.4;

              if (distToPlayer < 12 && Math.random() < chaseChance) {
                   const bestMoves = validMoves.sort((a, b) => {
                       const posA = {x: en.x + a.x, y: en.y + a.y};
                       const posB = {x: en.x + b.x, y: en.y + b.y};
                       const distA = Math.abs(posA.x - playerPosRef.current.x) + Math.abs(posA.y - playerPosRef.current.y);
                       const distB = Math.abs(posB.x - playerPosRef.current.x) + Math.abs(posB.y - playerPosRef.current.y);
                       return distA - distB;
                   });
                   if (bestMoves.length > 0) {
                       chosenMove = bestMoves[0];
                   }
              }
          }

          return { ...en, x: en.x + chosenMove.x, y: en.y + chosenMove.y };
      });
      
      enemiesRef.current = newEnemies;
      setEnemies(newEnemies);

      checkCollisions(playerPosRef.current.x, playerPosRef.current.y);
  };

  const handleWin = () => {
      setGameState('round-transition');
      setFeedback('correct');
      setScore(s => s + 10);
      playerMovementRef.current = { x: 0, y: 0 }; // Stop player
      
      setTimeout(() => {
          if (currentRoundIndex < gameRounds.length - 1) {
              const nextRound = currentRoundIndex + 1;
              setCurrentRoundIndex(nextRound);
              startRound(nextRound, gameRounds);
          } else {
              setGameState('game-over');
          }
      }, 1500);
  };

  const handleDeath = () => {
      if (isSafeRef.current) return;
      setFeedback('wrong');
      playerMovementRef.current = { x: 0, y: 0 }; // Stop player
      
      setTimeout(() => {
        // Respawn logic
        setPlayerPos({ x: 10, y: 7 });
        playerPosRef.current = { x: 10, y: 7 };
        setFeedback('none');
        // Give shield again
        setIsSafe(true);
        isSafeRef.current = true;
        setTimeout(() => {
            setIsSafe(false);
            isSafeRef.current = false;
        }, 3000);
      }, 500);
  };

  useEffect(() => {
      if (gameState !== 'playing') return;
      const interval = setInterval(moveEnemies, 500);
      return () => clearInterval(interval);
  }, [gameState]);

  // Keyboard Support
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // PREVENT SCROLLING with arrow keys
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              e.preventDefault();
          }

          if (gameState !== 'playing') return;
          
          if (e.key === 'ArrowUp') handleInput(0, -1);
          if (e.key === 'ArrowDown') handleInput(0, 1);
          if (e.key === 'ArrowLeft') handleInput(-1, 0);
          if (e.key === 'ArrowRight') handleInput(1, 0);
      };
      // Add 'passive: false' to ensure preventDefault works
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const cellWidthPct = 100 / MAZE_WIDTH;
  const cellHeightPct = 100 / MAZE_HEIGHT;

  return (
    <div className="max-w-6xl mx-auto pb-8 select-none px-2">
       {/* MENU */}
       {selectedSubjectId === null && (
        <div className="text-center py-10 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-indigo-600 font-handwritten mb-6">Uzay Labirenti 🚀</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {SUBJECTS.map((sub) => (
               <button
                 key={sub.id}
                 onClick={() => startGame(sub)}
                 className={`p-6 rounded-2xl shadow-md transition-all hover:scale-105 border-b-4 bg-white ${sub.colorClass}`}
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
              <div className="w-full flex justify-between items-center mb-4 px-2">
                  <button 
                    onClick={() => { setSelectedSubjectId(null); setGameState('menu'); }}
                    className="bg-white px-4 py-2 rounded-full font-bold shadow-md text-gray-700"
                  >
                    &larr; Çıkış
                  </button>
                  <div className="bg-indigo-900 text-yellow-300 px-6 py-2 rounded-full font-bold shadow-lg border border-yellow-500/30">
                      Puan: {score} | Seviye: {currentRoundIndex + 1}
                  </div>
              </div>

              {/* GAME CONTAINER - ENLARGED */}
              <div className="relative p-2 rounded-2xl shadow-2xl bg-slate-900 border-4 border-slate-700 w-full max-w-5xl">
                  
                  {/* Question Banner */}
                  <div className="absolute -top-16 left-0 right-0 flex justify-center z-10 px-4">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-xl border-b-4 border-indigo-500 text-center w-full max-w-2xl">
                        {loadingState === LoadingState.SUCCESS ? (
                             <h3 className="font-bold text-indigo-900 text-xl md:text-2xl">
                                 {gameState === 'game-over' ? 'Oyun Bitti!' : gameRounds[currentRoundIndex]?.question}
                             </h3>
                        ) : "Yükleniyor..."}
                    </div>
                  </div>

                  {feedback !== 'none' && (
                      <div className={`absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-lg animate-fade-in`}>
                          <div className={`text-7xl p-8 rounded-3xl bg-white shadow-2xl transform scale-150 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                              {feedback === 'correct' ? '✅' : '❌'}
                          </div>
                      </div>
                  )}

                  {loadingState === LoadingState.SUCCESS && (
                      <div 
                         className="relative mx-auto bg-[#1e1b4b] overflow-hidden rounded-lg shadow-inner"
                         style={{ 
                            width: 'min(95vw, 1024px)', // ENLARGED
                            aspectRatio: `${MAZE_WIDTH}/${MAZE_HEIGHT}`, 
                            backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
                        }}
                      >
                         <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

                         {/* 1. MAP LAYER - IRON THEME */}
                         <div 
                            className="grid absolute inset-0 w-full h-full"
                            style={{ gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)` }}
                          >
                              {MAZE_MAP.map((row, y) => (
                                  row.map((cell, x) => {
                                      const isWall = cell === 1;
                                      return (
                                          <div 
                                            key={`${x}-${y}`} 
                                            className={`relative w-full h-full`}
                                          >
                                              {isWall ? (
                                                // IRON WALL VISUALS
                                                <div className="absolute inset-0 bg-gradient-to-b from-slate-400 to-slate-600 border border-slate-700 shadow-xl">
                                                    {/* Rivet Details */}
                                                    <div className="absolute top-1 left-1 w-1 h-1 bg-slate-300 rounded-full shadow-sm"></div>
                                                    <div className="absolute top-1 right-1 w-1 h-1 bg-slate-300 rounded-full shadow-sm"></div>
                                                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-slate-800 rounded-full shadow-sm opacity-50"></div>
                                                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-slate-800 rounded-full shadow-sm opacity-50"></div>
                                                    {/* Inner Plate */}
                                                    <div className="absolute inset-2 border border-slate-500/50 bg-slate-500/10"></div>
                                                </div>
                                              ) : (
                                                // PATH VISUALS
                                                <div className="absolute inset-0 border border-white/5 bg-slate-800/50"></div>
                                              )}
                                              
                                              {/* Room Floor Highlight */}
                                              {cell === 2 && (
                                                  <div className="absolute inset-1 bg-cyan-900/30 rounded-sm border border-cyan-800/30"></div>
                                              )}
                                          </div>
                                      );
                                  })
                              ))}
                          </div>

                          {/* 2. ANSWER BOXES (Updated Style to Match Screenshot: Yellow Border, Blue Striped BG) */}
                          {ROOM_CENTERS.map((room, idx) => (
                              <div
                                key={idx}
                                className="absolute flex items-center justify-center pointer-events-none z-10"
                                style={{
                                    // Make the box 3x2 cells in size, centered. scale-y-75 to look 'flat' on floor
                                    width: `${3 * cellWidthPct}%`,
                                    height: `${2 * cellHeightPct}%`,
                                    left: `${(room.x - 1.5) * cellWidthPct}%`,
                                    top: `${(room.y - 1) * cellHeightPct}%`,
                                    transform: 'scaleY(0.85)', 
                                    transformOrigin: 'bottom'
                                }}
                              >
                                  {/* The Visual Square Box */}
                                  <div className="w-full h-full bg-[#1e293b] border-4 border-yellow-500 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center p-1 overflow-hidden relative group">
                                      {/* Blue Scanlines Background */}
                                      <div className="absolute inset-0" style={{
                                          background: 'repeating-linear-gradient(0deg, rgba(59, 130, 246, 0.2) 0px, rgba(59, 130, 246, 0.2) 2px, transparent 2px, transparent 4px)'
                                      }}></div>
                                      <div className="absolute inset-0 bg-blue-900/30"></div>
                                      
                                      <span className="text-white font-black text-xs sm:text-sm md:text-base lg:text-lg text-center leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative z-10">
                                          {roundAnswers[idx]?.text}
                                      </span>
                                  </div>
                              </div>
                          ))}

                          {/* 3. ENTITIES */}
                          <div className="absolute inset-0 pointer-events-none">
                              {/* PLAYER */}
                              <div 
                                className="absolute z-30 transition-all duration-200 ease-linear will-change-transform"
                                style={{
                                    width: `${cellWidthPct}%`,
                                    height: `${cellHeightPct}%`,
                                    left: `${playerPos.x * cellWidthPct}%`,
                                    top: `${playerPos.y * cellHeightPct}%`
                                }}
                              >
                                  <div className="w-full h-full p-[5%]"> 
                                      <RobotAvatar isMoving={isMoving} direction={playerDir} isSafe={isSafe} />
                                  </div>
                              </div>

                              {/* ENEMIES */}
                              {enemies.map(en => (
                                  <div 
                                    key={en.id}
                                    className="absolute z-20 transition-all duration-300 ease-linear"
                                    style={{
                                        width: `${cellWidthPct}%`,
                                        height: `${cellHeightPct}%`,
                                        left: `${en.x * cellWidthPct}%`,
                                        top: `${en.y * cellHeightPct}%`
                                    }}
                                  >
                                    <div className="w-full h-full p-[5%]">
                                        <EnemyAvatar color={en.color} shape={en.shape} />
                                    </div>
                                  </div>
                              ))}
                          </div>

                          {/* SAFETY INDICATOR */}
                          {isSafe && (
                              <div className="absolute top-2 right-2 bg-cyan-500/20 border border-cyan-400 text-cyan-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse z-40 backdrop-blur-sm">
                                  🛡️ KORUMA AKTİF
                              </div>
                          )}
                          
                          {/* 4. CONTROLS - NEON TRIANGLE KEYS ("Keys/Arrows") - POSITIONED AROUND PLAYER */}
                          {gameState === 'playing' && (
                              <div className="absolute inset-0 z-40 pointer-events-none">
                                  {/* UP */}
                                  <div 
                                      className="absolute pointer-events-auto transition-all duration-200 ease-linear will-change-transform flex justify-center items-center"
                                      style={{
                                          width: `${cellWidthPct}%`,
                                          height: `${cellHeightPct}%`,
                                          left: `${playerPos.x * cellWidthPct}%`,
                                          top: `${(playerPos.y - 1.2) * cellHeightPct}%`
                                      }}
                                  >
                                      <ArrowControl direction="up" onTap={() => handleInput(0, -1)} />
                                  </div>
                                  
                                  {/* DOWN */}
                                  <div 
                                      className="absolute pointer-events-auto transition-all duration-200 ease-linear will-change-transform flex justify-center items-center"
                                      style={{
                                          width: `${cellWidthPct}%`,
                                          height: `${cellHeightPct}%`,
                                          left: `${playerPos.x * cellWidthPct}%`,
                                          top: `${(playerPos.y + 1.2) * cellHeightPct}%`
                                      }}
                                  >
                                      <ArrowControl direction="down" onTap={() => handleInput(0, 1)} />
                                  </div>

                                  {/* LEFT */}
                                  <div 
                                      className="absolute pointer-events-auto transition-all duration-200 ease-linear will-change-transform flex justify-center items-center"
                                      style={{
                                          width: `${cellWidthPct}%`,
                                          height: `${cellHeightPct}%`,
                                          left: `${(playerPos.x - 1.2) * cellWidthPct}%`,
                                          top: `${playerPos.y * cellHeightPct}%`
                                      }}
                                  >
                                      <ArrowControl direction="left" onTap={() => handleInput(-1, 0)} />
                                  </div>

                                  {/* RIGHT */}
                                  <div 
                                      className="absolute pointer-events-auto transition-all duration-200 ease-linear will-change-transform flex justify-center items-center"
                                      style={{
                                          width: `${cellWidthPct}%`,
                                          height: `${cellHeightPct}%`,
                                          left: `${(playerPos.x + 1.2) * cellWidthPct}%`,
                                          top: `${playerPos.y * cellHeightPct}%`
                                      }}
                                  >
                                      <ArrowControl direction="right" onTap={() => handleInput(1, 0)} />
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
                  
                   {gameState === 'game-over' && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-indigo-950/95 text-white rounded-lg">
                            <h2 className="text-5xl font-bold mb-4 font-handwritten">Oyun Bitti!</h2>
                            <p className="text-3xl mb-8 text-yellow-400">Puan: {score}</p>
                            <button 
                                onClick={() => {
                                    const sub = SUBJECTS.find(s => s.id === selectedSubjectId);
                                    if (sub) startGame(sub);
                                }}
                                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold shadow-lg text-xl border-b-4 border-indigo-800"
                            >
                                Tekrar Oyna
                            </button>
                        </div>
                    )}
              </div>
          </div>
      )}
    </div>
  );
};

export default GameView;
