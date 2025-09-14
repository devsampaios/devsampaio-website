import { useState, useEffect, useRef, useCallback } from 'react';
import MarioImg from '../../assets/MarioGame/mario.gif';
import GameOverImg from '../../assets/MarioGame/game-over.png';
import PipeImg from '../../assets/MarioGame/pipe.png';
import CloudsImg from '../../assets/MarioGame/clouds.png';

const MarioRunnerView = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(1.5);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('marioHighScore') || '0');
    } catch {
      return 0;
    }
  });

  const marioRef = useRef<HTMLDivElement>(null);
  const pipeRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const jump = useCallback(() => {
    if (!isPlaying || isGameOver || isJumping) return;

    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
    }, 300);
  }, [isPlaying, isGameOver, isJumping]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setDifficultyLevel(1);
    setGameSpeed(1.5);
    setIsJumping(false);

    scoreIntervalRef.current = setInterval(() => {
      setScore(prev => prev + 1);
    }, 100);
  }, []);

  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);

    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('marioHighScore', score.toString());
      } catch (error) {
        console.warn('Failed to save high score:', error);
      }
    }

    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (scoreIntervalRef.current) {
      clearInterval(scoreIntervalRef.current);
    }
  }, [score, highScore]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(() => {
        const mario = marioRef.current;
        const pipe = pipeRef.current;

        if (mario && pipe) {
          const marioRect = mario.getBoundingClientRect();
          const pipeRect = pipe.getBoundingClientRect();

          const pipePosition = pipeRect.left;
          const marioPosition = marioRect.left + marioRect.width;
          const marioBottom = marioRect.bottom;
          const gameAreaBottom = pipe.offsetParent ? (pipe.offsetParent as HTMLElement).getBoundingClientRect().bottom : window.innerHeight;

          if (
            pipePosition < marioPosition - 5 && 
            pipePosition + pipeRect.width > marioRect.left + 5 && 
            marioBottom > gameAreaBottom - 120
          ) {
            endGame();
          }
        }
      }, 10);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isGameOver, isJumping, endGame]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      const difficultyInterval = setInterval(() => {
        setScore(prevScore => {
          const currentLevel = Math.floor(prevScore / 200) + 1;
          setDifficultyLevel(currentLevel);
          
          const updatedSpeed = Math.max(1.5 - (currentLevel - 1) * 0.1, 0.8);
          setGameSpeed(updatedSpeed);
          
          return prevScore;
        });
      }, 1000);

      return () => clearInterval(difficultyInterval);
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
          startGame();
        } else if (isPlaying) {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isGameOver, jump, startGame]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!isPlaying && !isGameOver) {
        startGame();
      } else if (isPlaying) {
        jump();
      }
    };

    document.addEventListener('touchstart', handleTouch);
    return () => document.removeEventListener('touchstart', handleTouch);
  }, [isPlaying, isGameOver, jump, startGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-900 dark:via-neutral-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50/60 to-blue-100/60 dark:from-neutral-800/60 dark:to-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-200/40 dark:border-neutral-700/40 shadow-2xl max-w-4xl w-full">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 dark:from-yellow-300 dark:to-yellow-500">
              Mario Runner
            </span>
          </h1>
          
          <div className="flex justify-center gap-4 sm:gap-8 mb-4">
            <div className="text-center">
              <p className="text-blue-700 dark:text-neutral-300 text-sm">Score</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-blue-700 dark:text-neutral-300 text-sm">Level</p>
              <p className="text-green-600 dark:text-green-400 text-2xl font-bold">{difficultyLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-blue-700 dark:text-neutral-300 text-sm">High Score</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold">{highScore}</p>
            </div>
          </div>
        </div>

        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border-2 border-blue-300 dark:border-neutral-700" style={{background: 'linear-gradient(#87CEEB, #E0F6FF)'}}>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-green-400 to-green-600"></div>
          
          <img 
            src={CloudsImg} 
            alt="Clouds" 
            className="absolute top-4 left-8 w-16 h-12 opacity-80"
          />
          <img 
            src={CloudsImg} 
            alt="Clouds" 
            className="absolute top-8 right-16 w-20 h-14 opacity-70"
          />
          
          <div
            ref={marioRef}
            className={`absolute bottom-16 left-12 w-16 h-16 transition-all duration-300 ${
              isJumping ? 'transform -translate-y-32' : ''
            }`}
          >
            <img 
              src={isGameOver ? GameOverImg : MarioImg} 
              alt={isGameOver ? "Game Over Mario" : "Mario"}
              className="w-full h-full object-contain"
            />
          </div>

          <div
            ref={pipeRef}
            className={`absolute bottom-0 right-0 w-16 h-32 ${
              isPlaying && !isGameOver ? 'animate-pipe-move' : ''
            }`}
          >
            <img 
              src={PipeImg} 
              alt="Pipe"
              className="w-full h-full object-contain"
            />
          </div>

          {isGameOver && (
            <div className="absolute inset-0 bg-blue-900/50 dark:bg-black/50 flex items-center justify-center">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-xl border border-blue-300 dark:border-neutral-700 text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 justify-center">
                  <i className="fas fa-skull"></i>
                  Game Over!
                </h2>
                <p className="text-blue-800 dark:text-yellow-100 mb-2">Final Score: <span className="text-blue-600 dark:text-yellow-400 font-bold">{score}</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-green-600 dark:text-green-400 text-sm mb-4 flex items-center gap-2 justify-center">
                    <i className="fas fa-trophy"></i>
                    New High Score!
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-blue-900/30 dark:bg-black/30 flex items-center justify-center">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-800 dark:to-neutral-900 p-6 rounded-xl border border-blue-300 dark:border-neutral-700 text-center">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400 mb-4 flex items-center gap-2 justify-center">
                  <i className="fas fa-play"></i>
                  Ready to Run?
                </h2>
                <p className="text-blue-800 dark:text-neutral-300 mb-6">Help Mario jump over the pipes!</p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-blue-600 dark:text-neutral-400 text-sm sm:text-base flex items-center gap-2 justify-center flex-wrap mb-4">
            <i className="fas fa-lightbulb text-yellow-500 dark:text-yellow-400"></i>
            Press SPACE or tap to jump over pipes!
            <i className="fas fa-running text-green-600 dark:text-green-400"></i>
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium flex items-center gap-2 justify-center">
                <i className="fas fa-keyboard"></i>
                Desktop
              </p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Space to Jump</p>
            </div>
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium flex items-center gap-2 justify-center">
                <i className="fas fa-mobile-alt"></i>
                Mobile
              </p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Tap to Jump</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pipe-move {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100vw);
          }
        }
        
        .animate-pipe-move {
          animation: pipe-move ${gameSpeed}s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarioRunnerView;