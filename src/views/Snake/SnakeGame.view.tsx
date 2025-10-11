import { useState, useEffect, useRef, useCallback } from 'react';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOverTriggered, setGameOverTriggered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('snakeHighScore') || '0');
    } catch (error) {
      console.warn('Failed to load high score from localStorage:', error);
      return 0;
    }
  });
  
  const gameStateRef = useRef({
    snake: [{ x: 270, y: 240 }],
    direction: null,
    food: { x: 0, y: 0, color: '#f59e0b' },
    loopId: null,
    shouldGrow: false
  });

  const size = 30;
  const canvasSize = 600;

  const getRandomNum = (min: number, max: number) => {
    return Math.round(Math.random() * (max - min) + min);
  };

  const getRandomPos = () => {
    const num = getRandomNum(0, canvasSize - size);
    return Math.round(num / size) * size;
  };

  const getRandomColor = () => {
    const colorPalette = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f97316'];
    return colorPalette[getRandomNum(0, colorPalette.length - 1)];
  };

  const pickSnakeColor = () => {
    const palette = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#06b6d4'];
    return palette[getRandomNum(0, palette.length - 1)];
  };

  const [snakeColor] = useState(() => pickSnakeColor());

  const initializeFood = useCallback(() => {
    let x: number, y: number;
    do {
      x = getRandomPos();
      y = getRandomPos();
    } while (gameStateRef.current.snake.find(segment => segment.x === x && segment.y === y));
    
    gameStateRef.current.food = {
      x,
      y,
      color: getRandomColor()
    };
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 1;
    const isDark = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDark ? '#404040' : '#93c5fd';
    
    for (let i = size; i < canvasSize; i += size) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasSize, i);
      ctx.stroke();
    }
  };

  const drawFood = (ctx: CanvasRenderingContext2D) => {
    const { x, y, color } = gameStateRef.current.food;
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
    ctx.shadowBlur = 0;

    const gradient = ctx.createRadialGradient(x + size/3, y + size/3, 0, x + size/2, y + size/2, size/2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    gameStateRef.current.snake.forEach((segment, index) => {
      const isHead = index === gameStateRef.current.snake.length - 1;
      
      if (isHead) {
        const gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + size, segment.y + size);
        gradient.addColorStop(0, snakeColor);
        gradient.addColorStop(1, snakeColor + '99');
        ctx.fillStyle = gradient;
        ctx.shadowColor = snakeColor;
        ctx.shadowBlur = 5;
      } else {
        ctx.fillStyle = snakeColor + '66';
        ctx.shadowBlur = 0;
      }
      
      ctx.fillRect(segment.x + 1, segment.y + 1, size - 2, size - 2);
      
      ctx.strokeStyle = isHead ? snakeColor : snakeColor + '99';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x + 1, segment.y + 1, size - 2, size - 2);
    });
    ctx.shadowBlur = 0;
  };

  const moveSnake = () => {
    if (!gameStateRef.current.direction) return;

    const snake = [...gameStateRef.current.snake];
    const head = snake[snake.length - 1];
    let newHead;

    switch (gameStateRef.current.direction) {
      case 'right':
        newHead = { x: head.x + size, y: head.y };
        break;
      case 'left':
        newHead = { x: head.x - size, y: head.y };
        break;
      case 'down':
        newHead = { x: head.x, y: head.y + size };
        break;
      case 'up':
        newHead = { x: head.x, y: head.y - size };
        break;
      default:
        return;
    }

    snake.push(newHead);
    
    if (!gameStateRef.current.shouldGrow) {
      snake.shift();
    } else {
      gameStateRef.current.shouldGrow = false;
    }
    
    gameStateRef.current.snake = snake;
  };

  const checkEat = () => {
    const head = gameStateRef.current.snake[gameStateRef.current.snake.length - 1];
    const food = gameStateRef.current.food;

    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);

      gameStateRef.current.shouldGrow = true;
      initializeFood();
      
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioContext = new AudioContextClass();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        }
      } catch (error) {
      }
    }
  };

  const checkCollision = () => {
    const head = gameStateRef.current.snake[gameStateRef.current.snake.length - 1];
    const canvasLimit = canvasSize - size;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = gameStateRef.current.snake.slice(0, -1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );

    if (wallCollision || selfCollision) {
      handleGameOver();
    }
  };

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    setIsPlaying(false);
    setGameOverTriggered(true);
    
    if (gameStateRef.current.loopId) {
      clearTimeout(gameStateRef.current.loopId);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#1a1a1a' : '#f1f5f9';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    drawGrid(ctx);
    drawFood(ctx);
    moveSnake();
    drawSnake(ctx);
    checkEat();
    checkCollision();

    gameStateRef.current.loopId = setTimeout(gameLoop, 150) as any;
  }, [isPlaying, isPaused, initializeFood]);

  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setGameOverTriggered(false);
    gameStateRef.current.snake = [{ x: 270, y: 240 }];
    gameStateRef.current.direction = null as any;
    gameStateRef.current.shouldGrow = false;
    initializeFood();

    setTimeout(() => {
      canvasRef.current?.focus();
    }, 100);
  }, [initializeFood]);

  const togglePause = useCallback(() => {
    if (gameOver) return;
    setIsPaused(prev => !prev);
  }, [gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const { direction } = gameStateRef.current;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (isPlaying && !isPaused && direction !== 'left') {
            gameStateRef.current.direction = 'right' as any;
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (isPlaying && !isPaused && direction !== 'right') {
            gameStateRef.current.direction = 'left' as any;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (isPlaying && !isPaused && direction !== 'up') {
            gameStateRef.current.direction = 'down' as any;
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isPlaying && !isPaused && direction !== 'down') {
            gameStateRef.current.direction = 'up' as any;
          }
          break;
        case ' ':
          e.preventDefault();
          if (gameOver) {
            return;
          }
          if (isPlaying) {
            togglePause();
          } else {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, isPaused, gameOver, togglePause, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX: number = 0;
    let touchStartY: number = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (!isPlaying) {
        if (!gameOver) startGame();
        return;
      }
      
      if (isPaused) {
        togglePause();
        return;
      }

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        togglePause();
        return;
      }
      
      const { direction } = gameStateRef.current;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== 'left') {
          gameStateRef.current.direction = 'right' as any;
        } else if (deltaX < 0 && direction !== 'right') {
          gameStateRef.current.direction = 'left' as any;
        }
      } else {
        if (deltaY > 0 && direction !== 'up') {
          gameStateRef.current.direction = 'down' as any;
        } else if (deltaY < 0 && direction !== 'down') {
          gameStateRef.current.direction = 'up' as any;
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, isPaused, gameOver, startGame, togglePause]);

  useEffect(() => {
    if (isPlaying) {
      gameLoop();
    }
    return () => {
      if (gameStateRef.current.loopId) {
        clearTimeout(gameStateRef.current.loopId);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    initializeFood();
  }, [initializeFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && isPlaying) {
      canvas.focus();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (gameOverTriggered && gameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('snakeHighScore', score.toString());
      } catch (error) {
        console.warn('Failed to save high score to localStorage:', error);
      }
    }
    if (gameOverTriggered) {
      setGameOverTriggered(false);
    }
  }, [gameOverTriggered, gameOver, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-900 dark:via-neutral-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50/60 to-blue-100/60 dark:from-neutral-800/60 dark:to-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-200/40 dark:border-neutral-700/40 shadow-2xl">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-white">
            Snake Game
          </h1>
          
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-blue-700 dark:text-yellow-100 text-sm font-medium">Score</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400">{score.toString().padStart(2, '0')}</p>
            </div>
            <div>
              <p className="text-blue-700 dark:text-yellow-100 text-sm font-medium">High Score</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400">{highScore.toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            tabIndex={0}
            className={`border-2 border-blue-300 dark:border-neutral-700 rounded-xl bg-blue-50 dark:bg-neutral-900 ${gameOver || isPaused ? 'blur-sm' : ''} max-w-full h-auto focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-yellow-400 touch-none`}
            style={{ aspectRatio: '1/1' }}
            onClick={() => canvasRef.current?.focus()}
          />
          
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 dark:bg-black/50 rounded-xl">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-800 dark:to-neutral-900 p-8 rounded-xl border border-blue-300 dark:border-neutral-700 text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Game Over!</h2>
                <p className="text-blue-800 dark:text-yellow-100 mb-2">Final Score: <span className="text-blue-600 dark:text-yellow-400 font-bold">{score}</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-green-600 dark:text-green-400 text-sm mb-4">New High Score!</p>
                )}
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Play Again
                </button>
                <p className="text-blue-600 dark:text-neutral-400 text-xs mt-2">Press Space or Tap to play again</p>
              </div>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 dark:bg-black/50 rounded-xl">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-800 dark:to-neutral-900 p-8 rounded-xl border border-blue-300 dark:border-neutral-700 text-center">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400 mb-4">Paused</h2>
                <p className="text-blue-800 dark:text-neutral-300 mb-4">Game is paused</p>
                <button
                  onClick={togglePause}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Resume
                </button>
                <p className="text-blue-800 dark:text-neutral-400 text-xs mt-2">Press Space or Tap to resume</p>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 dark:bg-black/50 rounded-xl">
              <div className="bg-gradient-to-br from-white to-blue-50 dark:from-neutral-800 dark:to-neutral-900 p-8 rounded-xl border border-blue-300 dark:border-neutral-700 text-center">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400 mb-4">Ready to Play?</h2>
                <p className="text-blue-800 dark:text-neutral-300 mb-6">Use arrow keys to move, Space to pause</p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          {isPlaying && !isPaused && (
            <p className="text-blue-700 dark:text-yellow-100 text-sm mb-4">
              Use Arrows/swipe to move • Space/tap to pause
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium">Move</p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Arrows/Swipe</p>
            </div>
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium">Pause</p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Space/Tap</p>
            </div>
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium">Goal</p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Eat Food</p>
            </div>
            <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-3 border border-blue-200 dark:border-neutral-700">
              <p className="text-blue-800 dark:text-yellow-100 text-xs font-medium">Start</p>
              <p className="text-blue-600 dark:text-neutral-400 text-xs">Space/Tap</p>
            </div>
          </div>
          
          {isPlaying && (
            <button
              onClick={togglePause}
              className="mt-4 bg-blue-200 hover:bg-blue-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-blue-900 dark:text-yellow-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;