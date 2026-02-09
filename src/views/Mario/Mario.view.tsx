import { useState, useEffect, useRef, useCallback } from 'react';

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
    }, 350);
  }, [isPlaying, isGameOver, isJumping]);

  const startGame = useCallback(() => {
    const isMobile = window.innerWidth < 640;
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setDifficultyLevel(1);
    setGameSpeed(isMobile ? 2.0 : 1.5);
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
          
          const isMobile = window.innerWidth < 640;
          const groundHeight = isMobile ? 48 : 64;
          const pipeHeight = isMobile ? 64 : 128;

          if (
            pipePosition < marioPosition - 5 && 
            pipePosition + pipeRect.width > marioRect.left + 5 && 
            marioBottom > gameAreaBottom - groundHeight - pipeHeight + (isMobile ? 30 : 20)
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
          
          const isMobile = window.innerWidth < 640;
          const baseSpeed = isMobile ? 2.0 : 1.5;
          const minSpeed = isMobile ? 1.2 : 0.8;
          const speedReduction = isMobile ? 0.05 : 0.1;
          
          const updatedSpeed = Math.max(baseSpeed - (currentLevel - 1) * speedReduction, minSpeed);
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

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  return (
    <main className="section soft">
      <div className="container">
        <div className="sectionHeader">
          <p className="eyebrow">Games</p>
          <h1 className="sectionTitle">Mario Runner</h1>
          <p className="sectionSubtitle">Run and jump the pipes. Space or tap to jump without squeezing the mobile layout.</p>
        </div>

        <div className="gameShell">
            <div className="gameHeader">
              <div>
                <div className="projectTitle">Progress</div>
                <p className="muted" style={{ marginTop: '0.25rem' }}>Score, level up, and keep the pace.</p>
              </div>
              <div className="gameActions">
              <button className="btn btnPrimary" onClick={startGame}>
                {isPlaying ? 'Restart' : isGameOver ? 'Play again' : 'Start'}
              </button>
            </div>
          </div>

          <div className="metricGrid">
            <div className="metricCard">
              <div className="metricLabel">Score</div>
              <div className="metricValue">{score}</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Level</div>
              <div className="metricValue">{difficultyLevel}</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">High Score</div>
              <div className="metricValue">{highScore}</div>
            </div>
          </div>

          <div className="runnerStage">
            <div className="runnerGround" />

            <img 
              src="/assets/MarioGame/clouds.png" 
              alt="Clouds" 
              className="runnerCloud" 
              style={{ top: '10%', left: '8%', width: '72px', height: '52px' }}
            />
            <img 
              src="/assets/MarioGame/clouds.png" 
              alt="Clouds" 
              className="runnerCloud" 
              style={{ top: '18%', right: '12%', width: '90px', height: '62px' }}
            />

            <div
              ref={marioRef}
              className="runnerCharacter"
              style={{
                transform: isJumping ? 'translateY(-40%)' : 'translateY(0)',
                width: isMobile ? '56px' : '72px',
                height: isMobile ? '56px' : '72px'
              }}
            >
              <img 
                src={isGameOver ? '/assets/MarioGame/game-over.png' : '/assets/MarioGame/mario.gif'} 
                alt={isGameOver ? "Game Over Mario" : "Mario"}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div
              ref={pipeRef}
              className="runnerPipe"
              style={{
                right: isPlaying && !isGameOver ? 'initial' : '0',
                animation: isPlaying && !isGameOver ? `pipe-move ${gameSpeed}s linear infinite` : 'none',
                width: isMobile ? '48px' : '64px',
                height: isMobile ? '70px' : '120px'
              }}
            >
              <img 
                src="/assets/MarioGame/pipe.png" 
                alt="Pipe"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {(isGameOver || (!isPlaying && !isGameOver)) && (
              <div className="gameOverlay">
                <div className="gameOverlayCard">
                  {isGameOver ? (
                    <>
                      <h2 className="projectTitle">Game Over</h2>
                      <p className="muted">Score: <strong>{score}</strong></p>
                      {score === highScore && score > 0 && <span className="pill success">New high score!</span>}
                      <button className="btn btnPrimary" onClick={startGame}>Play again</button>
                    </>
                  ) : (
                    <>
                      <h2 className="projectTitle">Ready to run?</h2>
                      <p className="muted">Press Space or tap to jump over pipes.</p>
                      <button className="btn btnPrimary" onClick={startGame}>Start</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="metricGrid">
            <div className="metricCard">
              <div className="metricLabel">Desktop</div>
              <div className="metricValue">Space to jump</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Mobile</div>
              <div className="metricValue">Tap to jump</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Objective</div>
              <div className="metricValue">Avoid the pipes</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Tip</div>
              <div className="metricValue">Short jumps with timing</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MarioRunnerView;
