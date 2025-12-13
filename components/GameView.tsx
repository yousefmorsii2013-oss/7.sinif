
import React, { useState, useEffect, useRef } from 'react';
import { Subject, LoadingState, GameRound } from '../types';
import { generateGameData } from '../services/geminiService';
import { SUBJECTS, TOPICS } from '../constants';

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

// Room Centers
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
    isAlerted?: boolean;
}

// --- VISUAL COMPONENTS ---

const EnemyAvatar: React.FC<{ color: string, shape: 'triangle' | 'square' | 'circle', isAlerted?: boolean }> = ({ color, shape, isAlerted }) => {
    // Logic: If alerted, non-red becomes RED. Red becomes CYAN.
    let fillColorClass = color.replace('bg-', 'fill-');
    let strokeColor = "stroke-white";
    
    if (isAlerted) {
        if (color.includes('red')) {
            fillColorClass = "fill-cyan-500"; // Square turns Cyan
        } else {
            fillColorClass = "fill-red-600"; // Others turn Red
        }
        strokeColor = "stroke-yellow-300"; // Highlight border
    }

    return (
        <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-md transition-all duration-300 ${isAlerted ? 'filter brightness-125 drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]' : 'filter saturate-150'}`}>
            <defs>
                <radialGradient id="gradEnemy" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </radialGradient>
            </defs>

            {shape === 'triangle' && (
                <g>
                    <polygon points="50,10 90,85 10,85" className={`${fillColorClass} ${strokeColor}`} strokeWidth={isAlerted ? "5" : "3"} />
                    {isAlerted ? (
                        // Angry Eyes
                        <g>
                            <line x1="35" y1="45" x2="50" y2="55" stroke="black" strokeWidth="3" />
                            <line x1="65" y1="45" x2="50" y2="55" stroke="black" strokeWidth="3" />
                            <circle cx="40" cy="60" r="5" fill="white" />
                            <circle cx="40" cy="60" r="2" fill="black" />
                            <circle cx="60" cy="60" r="5" fill="white" />
                            <circle cx="60" cy="60" r="2" fill="black" />
                        </g>
                    ) : (
                        // Normal Eyes
                        <g>
                            <circle cx="40" cy="55" r="6" fill="#00ff00" className="animate-pulse" />
                            <circle cx="60" cy="55" r="6" fill="#00ff00" className="animate-pulse" />
                        </g>
                    )}
                </g>
            )}

            {shape === 'square' && (
                <g>
                    <rect x="15" y="15" width="70" height="70" rx="10" className={`${fillColorClass} ${strokeColor}`} strokeWidth={isAlerted ? "5" : "3"} />
                    <rect x="25" y="25" width="50" height="50" fill="url(#gradEnemy)" />
                    {isAlerted ? (
                        // Angry Eyes
                        <g>
                             <rect x="30" y="40" width="15" height="5" fill="black" transform="rotate(15, 37.5, 42.5)" />
                             <rect x="55" y="40" width="15" height="5" fill="black" transform="rotate(-15, 62.5, 42.5)" />
                             <rect x="32" y="48" width="12" height="12" fill="yellow" />
                             <rect x="58" y="48" width="12" height="12" fill="yellow" />
                        </g>
                    ) : (
                        // Normal Eyes
                        <g>
                            <rect x="30" y="40" width="15" height="10" fill="#ff0000" className="animate-pulse" />
                            <rect x="55" y="40" width="15" height="10" fill="#ff0000" className="animate-pulse" />
                        </g>
                    )}
                </g>
            )}

            {shape === 'circle' && (
                <g>
                    <circle cx="50" cy="50" r="40" className={`${fillColorClass} ${strokeColor}`} strokeWidth={isAlerted ? "5" : "3"} />
                    <circle cx="50" cy="50" r="25" fill="#333" opacity="0.5" />
                    {isAlerted ? (
                        // Cyclops Angry Eye
                        <g>
                            <circle cx="50" cy="50" r="15" fill="white" />
                            <circle cx="50" cy="50" r="5" fill="red" />
                            <path d="M 35 40 Q 50 55 65 40" stroke="black" strokeWidth="3" fill="none" />
                        </g>
                    ) : (
                        // Normal Eye
                        <circle cx="50" cy="50" r="10" fill="yellow" className="animate-ping" />
                    )}
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

// --- LINE OF SIGHT HELPER (RAYCASTING) ---
const hasLineOfSight = (start: Point, end: Point, map: number[][]): boolean => {
    // 1. Check strict distance first
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance > 6) return false; // Max vision range: 6 blocks

    // 2. Raycast to check for walls
    const steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2; // Increase resolution
    if (steps === 0) return true;

    for (let i = 1; i < steps; i++) { // Start from 1 to avoid checking self
        const t = i / steps;
        const checkX = Math.round(start.x + dx * t);
        const checkY = Math.round(start.y + dy * t);

        // Bounds check
        if (checkY >= 0 && checkY < MAZE_HEIGHT && checkX >= 0 && checkX < MAZE_WIDTH) {
            // If we hit a wall (1), LOS is blocked
            if (map[checkY][checkX] === 1) {
                return false;
            }
        }
    }
    return true;
};

// --- SPAWN HELPER ---
const getRandomSpawnPosition = (occupied: Point[], playerPos: Point): Point => {
    let attempts = 0;
    while (attempts < 100) {
        const x = Math.floor(Math.random() * MAZE_WIDTH);
        const y = Math.floor(Math.random() * MAZE_HEIGHT);
        
        // Check Map Bounds and Type
        if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) continue;
        const cell = MAZE_MAP[y][x];

        // Must be a Path (0). 
        // 1=Wall, 2=AnswerRoom, 9=SpawnCenter. 
        if (cell !== 0) {
            attempts++; continue;
        }

        // Distance Check from Player (Start Safe)
        const dist = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
        if (dist < 6) { // Ensure at least 6 blocks away
            attempts++; continue;
        }

        // Overlap Check (Don't spawn on other enemies)
        const isOccupied = occupied.some(p => p.x === x && p.y === y);
        if (isOccupied) {
            attempts++; continue;
        }

        return { x, y };
    }
    
    // Fallback to corners if random fails (rare)
    const corners = [{x:1, y:1}, {x:19, y:1}, {x:1, y:13}, {x:19, y:13}];
    for (const c of corners) {
         const dist = Math.abs(c.x - playerPos.x) + Math.abs(c.y - playerPos.y);
         if (dist > 5 && !occupied.some(p => p.x === c.x && p.y === c.y)) return c;
    }
    return { x: 1, y: 1 };
};


const GameView: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'topic-select' | 'playing' | 'round-transition' | 'game-over'>('menu');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isSafe, setIsSafe] = useState(false);
  const [deathReason, setDeathReason] = useState<'caught' | 'wrong_answer' | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
  const isGamePausedRef = useRef(false); // To freeze game during death animation

  // --- INITIALIZATION ---
  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubjectId(subject.id);
    setSelectedTopicIds([]); // Reset selected topics
    setGameState('topic-select');
  };

  const handleTopicToggle = (topicId: string) => {
      setSelectedTopicIds(prev => 
          prev.includes(topicId) 
              ? prev.filter(id => id !== topicId) 
              : [...prev, topicId]
      );
  };

  const launchGame = async () => {
    if (!selectedSubjectId) return;
    const subject = SUBJECTS.find(s => s.id === selectedSubjectId);
    if (!subject) return;

    if (selectedTopicIds.length === 0) {
        return; 
    }

    setLoadingState(LoadingState.LOADING);
    setScore(0);
    setCurrentRoundIndex(0);
    isGamePausedRef.current = false;
    
    // Combine contexts of selected topics
    const relevantTopics = TOPICS.filter(t => t.subjectId === selectedSubjectId);
    const selectedTopics = relevantTopics.filter(t => selectedTopicIds.includes(t.id));
    const contexts = selectedTopics.map(t => t.promptContext);

    try {
      const rounds = await generateGameData(subject.title, contexts);
      
      // Shuffle rounds to ensure questions are mixed (interleaved) between topics
      const shuffledRounds = [...rounds].sort(() => Math.random() - 0.5);
      
      setGameRounds(shuffledRounds);
      setLoadingState(LoadingState.SUCCESS);
      startRound(0, shuffledRounds);
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
    isGamePausedRef.current = false;
    
    // Safety Period
    setIsSafe(true);
    isSafeRef.current = true;
    setTimeout(() => {
        setIsSafe(false);
        isSafeRef.current = false;
    }, 3000); 
    
    // PROGRESSIVE ENEMY CONFIGS (Defines what enemies exist, but not position yet)
    const enemyConfigs: Omit<Enemy, 'x' | 'y'>[] = [];
    
    enemyConfigs.push({ id: 0, color: 'bg-red-500', shape: 'triangle', speed: 'fast' });
    enemyConfigs.push({ id: 1, color: 'bg-orange-500', shape: 'triangle', speed: 'fast' });

    if (index >= 1) {
        enemyConfigs.push({ id: 2, color: 'bg-purple-600', shape: 'square', speed: 'slow' });
    }
    if (index >= 2) {
        enemyConfigs.push({ id: 3, color: 'bg-pink-500', shape: 'circle', speed: 'medium' });
    }
    if (index >= 4) {
         enemyConfigs.push({ id: 4, color: 'bg-blue-500', shape: 'square', speed: 'slow' });
    }

    // Assign RANDOM spawn positions
    const newEnemies: Enemy[] = [];
    for (const config of enemyConfigs) {
         const pos = getRandomSpawnPosition(newEnemies, startPos);
         newEnemies.push({ ...config, x: pos.x, y: pos.y });
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
    if (isGamePausedRef.current) return;
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
      if (isGamePausedRef.current) return;

      // 1. Enemy Collision
      if (!isSafeRef.current) {
          for (const en of enemiesRef.current) {
              if (Math.abs(en.x - px) < 0.6 && Math.abs(en.y - py) < 0.6) {
                  handleDeath('caught');
                  return;
              }
          }
      }

      // 2. Answer Collision (IMMEDIATE TRIGGER)
      if (px >= 0 && px < MAZE_WIDTH && py >= 0 && py < MAZE_HEIGHT) {
          const cellType = MAZE_MAP[py][px];
          if (cellType === 2) {
             let closestRoomIndex = -1;
             let minDistance = 1000;
             ROOM_CENTERS.forEach((room, index) => {
                 const dist = Math.abs(room.x - px) + Math.abs(room.y - py);
                 if (dist < minDistance) {
                     minDistance = dist;
                     closestRoomIndex = index;
                 }
             });

             if (closestRoomIndex !== -1 && roundAnswers[closestRoomIndex]) {
                 setIsMoving(false);
                 playerMovementRef.current = { x: 0, y: 0 };
                 const answer = roundAnswers[closestRoomIndex];
                 if (answer.isCorrect) {
                     handleWin();
                 } else {
                     handleDeath('wrong_answer'); // WRONG ANSWER ALWAYS KILLS, NO IMMUNITY
                 }
             }
          }
      }
  };

  // --- GAME LOOPS ---

  // Player Auto-Movement Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
        if (isGamePausedRef.current) return; // Stop player when paused

        const { x: dx, y: dy } = playerMovementRef.current;
        if (dx === 0 && dy === 0) {
            if (isMoving) setIsMoving(false);
            return;
        }
        const current = playerPosRef.current;
        const nextX = current.x + dx;
        const nextY = current.y + dy;
        if (isValidMove(nextX, nextY)) {
            playerPosRef.current = { x: nextX, y: nextY };
            setPlayerPos({ x: nextX, y: nextY });
            setIsMoving(true);
            checkCollisions(nextX, nextY);
        } else {
            playerMovementRef.current = { x: 0, y: 0 };
            setIsMoving(false);
        }
    }, 250); 
    return () => clearInterval(moveInterval);
  }, [gameState, roundAnswers, gameRounds]);

  // Enemy Movement Loop
  const moveEnemies = () => {
      if (isGamePausedRef.current) return; // Stop enemies when paused

      const newEnemies = enemiesRef.current.map((en, index) => {
          // 1. DETERMINE ALERT STATUS (Line of Sight + Distance)
          const isVisible = hasLineOfSight({x: en.x, y: en.y}, playerPosRef.current, MAZE_MAP);
          let isAlerted = isVisible;

          // If not visible (too far or behind wall), alert is false.

          // 2. MOVEMENT LOGIC
          // Speed Check: If not alerted, apply random skip based on speed type
          if (!isAlerted) {
              if (en.speed === 'slow' && Math.random() > 0.6) return { ...en, isAlerted };
              if (en.speed === 'medium' && Math.random() > 0.8) return { ...en, isAlerted };
          }

          const moves = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
          
          // Filter valid moves
          let validMoves = moves.filter(m => {
              const nx = en.x + m.x;
              const ny = en.y + m.y;
              
              // A. Map Bounds & Walls
              if (!isValidMove(nx, ny)) return false;

              // B. Answer Zones (Cell Type 2) - Enemies CANNOT enter
              if (MAZE_MAP[ny][nx] === 2) return false;

              // C. Enemy Stacking Prevention
              // Check against other enemies in the ref array
              const isOccupied = enemiesRef.current.some((other, otherIdx) => {
                  if (otherIdx === index) return false; // Don't check self
                  return other.x === nx && other.y === ny;
              });
              if (isOccupied) return false;

              return true;
          });

          if (validMoves.length === 0) return { ...en, isAlerted };

          let chosenMove = {x:0, y:0};

          // AI Logic
          if (isSafeRef.current) {
              // Safe mode: Random wander (Flee logic could be added here, but wander is fine)
              chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else if (isAlerted) {
              // ALERT MODE: CHASE DIRECTLY
              // Sort moves by distance to player
              const bestMoves = validMoves.sort((a, b) => {
                   const posA = {x: en.x + a.x, y: en.y + a.y};
                   const posB = {x: en.x + b.x, y: en.y + b.y};
                   const distA = Math.abs(posA.x - playerPosRef.current.x) + Math.abs(posA.y - playerPosRef.current.y);
                   const distB = Math.abs(posB.x - playerPosRef.current.x) + Math.abs(posB.y - playerPosRef.current.y);
                   return distA - distB;
               });
               if (bestMoves.length > 0) {
                   chosenMove = bestMoves[0];
               } else {
                   // If blocked, just pick random valid
                    chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
               }
          } else {
              // IDLE MODE: Random Wander
              chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          }

          return { ...en, x: en.x + chosenMove.x, y: en.y + chosenMove.y, isAlerted };
      });
      
      enemiesRef.current = newEnemies;
      setEnemies(newEnemies);

      checkCollisions(playerPosRef.current.x, playerPosRef.current.y);
  };

  const handleWin = () => {
      setGameState('round-transition');
      setFeedback('correct');
      setScore(s => s + 10);
      playerMovementRef.current = { x: 0, y: 0 }; 
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

  const handleDeath = (reason: 'caught' | 'wrong_answer' = 'caught') => {
      // If caught by enemy, respect safety.
      // If wrong answer, IGNORE safety (answering wrong is always fatal).
      if (reason === 'caught' && isSafeRef.current) return;
      
      if (isGamePausedRef.current) return;

      // 1. FREEZE GAME
      isGamePausedRef.current = true;
      setFeedback('wrong');
      setDeathReason(reason);
      playerMovementRef.current = { x: 0, y: 0 }; 
      
      // 2. WAIT FOR VISUAL FEEDBACK (1.5 seconds)
      setTimeout(() => {
        // 3. RESET POSITIONS
        const resetPlayerPos = { x: 10, y: 7 };
        setPlayerPos(resetPlayerPos);
        playerPosRef.current = resetPlayerPos;
        
        // RESPAWN ENEMIES RANDOMLY
        const currentEnemies = enemiesRef.current;
        const relocatedEnemies: Enemy[] = [];
        
        for (const en of currentEnemies) {
             const newPos = getRandomSpawnPosition(relocatedEnemies, resetPlayerPos);
             relocatedEnemies.push({ 
                 ...en, 
                 x: newPos.x, 
                 y: newPos.y, 
                 isAlerted: false // Reset alert state
             });
        }
        setEnemies(relocatedEnemies);
        enemiesRef.current = relocatedEnemies;

        // 4. RESUME GAME
        setFeedback('none');
        setDeathReason(null);
        isGamePausedRef.current = false;
        
        // 5. GRANT IMMUNITY
        setIsSafe(true);
        isSafeRef.current = true;
        setTimeout(() => {
            setIsSafe(false);
            isSafeRef.current = false;
        }, 3000);
      }, 1500);
  };

  useEffect(() => {
      if (gameState !== 'playing') return;
      const interval = setInterval(moveEnemies, 400); // Slightly faster updates for smoother chasing
      return () => clearInterval(interval);
  }, [gameState]);

  // Keyboard Support
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              e.preventDefault();
          }
          if (gameState !== 'playing') return;
          if (e.key === 'ArrowUp') handleInput(0, -1);
          if (e.key === 'ArrowDown') handleInput(0, 1);
          if (e.key === 'ArrowLeft') handleInput(-1, 0);
          if (e.key === 'ArrowRight') handleInput(1, 0);
      };
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const cellWidthPct = 100 / MAZE_WIDTH;
  const cellHeightPct = 100 / MAZE_HEIGHT;

  // --- TOPIC SELECTION RENDER ---
  if (gameState === 'topic-select' && selectedSubjectId) {
    const subject = SUBJECTS.find(s => s.id === selectedSubjectId);
    const subTopics = TOPICS.filter(t => t.subjectId === selectedSubjectId);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
            <button 
                onClick={() => setGameState('menu')}
                className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm"
            >
                &larr; Ders Seçimine Dön
            </button>
            
            <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg ${subject?.colorClass}`}>
                    {subject?.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 font-handwritten mb-2">{subject?.title} Konuları</h2>
                <p className="text-gray-600">Hangi konulardan soru gelmesini istersin? (Birden fazla seçebilirsin)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {subTopics.map(topic => {
                    const isSelected = selectedTopicIds.includes(topic.id);
                    return (
                        <div 
                            key={topic.id}
                            onClick={() => handleTopicToggle(topic.id)}
                            className={`
                                cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 relative overflow-hidden group
                                ${isSelected 
                                    ? `border-indigo-500 bg-indigo-50 shadow-md` 
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}
                            `}>
                                {isSelected && <span className="text-white text-sm font-bold">✓</span>}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{topic.title}</h3>
                                <p className="text-xs text-gray-500">{topic.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={launchGame}
                    disabled={selectedTopicIds.length === 0}
                    className={`
                        px-10 py-4 rounded-full font-bold text-xl shadow-xl transition-all transform hover:-translate-y-1
                        ${selectedTopicIds.length > 0 
                            ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {selectedTopicIds.length === 0 ? 'En Az 1 Konu Seç' : 'Oyuna Başla 🚀'}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto pb-8 select-none px-2 ${isFullScreen ? 'fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center' : ''}`}>
       {/* MENU */}
       {gameState === 'menu' && (
        <div className="text-center py-10 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-indigo-600 font-handwritten mb-6">Uzay Labirenti 🚀</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {SUBJECTS.map((sub) => (
               <button
                 key={sub.id}
                 onClick={() => handleSubjectSelect(sub)}
                 className={`p-6 rounded-2xl shadow-md transition-all hover:scale-105 border-b-4 bg-white ${sub.colorClass}`}
               >
                 <div className="text-5xl mb-4">{sub.icon}</div>
                 <h3 className="text-xl font-bold">{sub.title}</h3>
               </button>
             ))}
          </div>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'game-over' || gameState === 'round-transition' || loadingState !== LoadingState.IDLE) && selectedSubjectId && (
          <div className="flex flex-col items-center w-full">
              {!isFullScreen && (
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
              )}

              {/* GAME CONTAINER - ENLARGED */}
              <div className={`relative p-2 rounded-2xl shadow-2xl bg-slate-900 border-4 border-slate-700 w-full ${isFullScreen ? 'max-w-none h-full border-none rounded-none' : 'max-w-5xl'}`}>
                  
                  {/* FULL SCREEN TOGGLE BUTTON */}
                  <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="absolute bottom-4 left-4 z-50 p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white shadow-lg transition-colors border border-slate-600 group"
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

                  {/* Question Banner */}
                  <div className="absolute top-4 sm:-top-16 left-0 right-0 flex justify-center z-10 px-4">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-xl border-b-4 border-indigo-500 text-center w-full max-w-2xl">
                        {loadingState === LoadingState.SUCCESS ? (
                             <h3 className="font-bold text-indigo-900 text-xl md:text-2xl">
                                 {gameState === 'game-over' ? 'Oyun Bitti!' : gameRounds[currentRoundIndex]?.question}
                             </h3>
                        ) : "Yükleniyor..."}
                    </div>
                  </div>

                  {feedback !== 'none' && (
                      <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 rounded-lg animate-fade-in backdrop-blur-sm`}>
                          <div className={`text-7xl p-8 rounded-3xl bg-white shadow-2xl transform scale-150 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                              {feedback === 'correct' ? '✅' : '❌'}
                          </div>
                          {feedback === 'wrong' && (
                              <p className="text-white font-bold text-3xl mt-8 animate-pulse shadow-black drop-shadow-md">
                                  {deathReason === 'wrong_answer' ? 'YANLIŞ CEVAP!' : 'YAKALANDIN!'}
                              </p>
                          )}
                      </div>
                  )}

                  {loadingState === LoadingState.SUCCESS && (
                      <div 
                         className="relative mx-auto bg-[#1e1b4b] overflow-hidden rounded-lg shadow-inner"
                         style={{ 
                            width: isFullScreen ? '100%' : 'min(95vw, 1024px)', 
                            height: isFullScreen ? '100%' : 'auto',
                            aspectRatio: isFullScreen ? 'unset' : `${MAZE_WIDTH}/${MAZE_HEIGHT}`, 
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
                                        <EnemyAvatar color={en.color} shape={en.shape} isAlerted={en.isAlerted} />
                                    </div>
                                  </div>
                              ))}
                          </div>

                          {/* SAFETY INDICATOR */}
                          {isSafe && feedback === 'none' && (
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
                                    if (sub) handleSubjectSelect(sub);
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
