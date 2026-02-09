import { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O' | null;
type GameBoard = Player[];

const TicTacToeView = () => {
  const [board, setBoard] = useState<GameBoard>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8],   
    [0, 4, 8], [2, 4, 6] 
  ];

  const checkWinner = (board: GameBoard): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const minimax = (board: GameBoard, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const winner = checkWinner(board);
    
    if (winner === 'O') return 10 - depth; 
    if (winner === 'X') return depth - 10; 
    if (board.every(cell => cell !== null)) return 0; 
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const eval_score = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, eval_score);
          alpha = Math.max(alpha, eval_score);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const eval_score = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          minEval = Math.min(minEval, eval_score);
          beta = Math.min(beta, eval_score);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const getBestMove = (board: GameBoard): number => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (difficulty === 'easy' && Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    if (difficulty === 'medium' && Math.random() < 0.4) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    let optimalMove = -1;
    let topScore = -Infinity;
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const moveValue = minimax(board, 0, false);
        board[i] = null;
        
        if (moveValue > topScore) {
          optimalMove = i;
          topScore = moveValue;
        }
      }
    }
    
    return optimalMove;
  };

  const checkDraw = (board: GameBoard): boolean => {
    return board.every(cell => cell !== null) && !checkWinner(board);
  };

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || gameOver || currentPlayer !== 'X' || isAiThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    const isGameDraw = checkDraw(newBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      const scoreKey = gameWinner === 'X' ? 'player' : 'computer';
      setScores(prev => ({
        ...prev,
        [scoreKey]: prev[scoreKey] + 1
      }));
    } else if (isGameDraw) {
      setIsDraw(true);
      setGameOver(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    } else {
      setCurrentPlayer('O');
    }
  }, [board, gameOver, currentPlayer, isAiThinking]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameOver(false);
    setIsDraw(false);
    setIsAiThinking(false);
  }, []);

  const getDifficultyLabel = (level: string) => {
    switch(level) {
      case 'easy': return { text: 'Easy', icon: 'fas fa-smile', color: 'text-green-400' };
      case 'medium': return { text: 'Medium', icon: 'fas fa-meh', color: 'text-yellow-400' };
      case 'hard': return { text: 'Hard', icon: 'fas fa-frown', color: 'text-red-400' };
      default: return { text: 'Medium', icon: 'fas fa-meh', color: 'text-yellow-400' };
    }
  };

  const resetScores = () => {
    setScores({ player: 0, computer: 0, draws: 0 });
  };

  const getWinningCells = (): number[] => {
    if (!winner) return [];
    
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combination;
      }
    }
    return [];
  };

  const winningCells = getWinningCells();

  useEffect(() => {
    if (currentPlayer === 'O' && !gameOver && !isDraw) {
      setIsAiThinking(true);
      const aiMoveTimer = setTimeout(() => {
        const bestMove = getBestMove(board);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = 'O';
          setBoard(newBoard);

          const gameWinner = checkWinner(newBoard);
          const isGameDraw = checkDraw(newBoard);

          if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);
            const scoreKey = gameWinner === 'X' ? 'player' : 'computer';
            setScores(prev => ({
              ...prev,
              [scoreKey]: prev[scoreKey] + 1
            }));
          } else if (isGameDraw) {
            setIsDraw(true);
            setGameOver(true);
            setScores(prev => ({
              ...prev,
              draws: prev.draws + 1
            }));
          } else {
            setCurrentPlayer('X');
          }
        }
        setIsAiThinking(false);
      }, 800);

      return () => clearTimeout(aiMoveTimer);
    }
  }, [currentPlayer, board, gameOver, isDraw]);

  return (
    <main className="section soft">
      <div className="container">
        <div className="sectionHeader">
          <p className="eyebrow">Games</p>
          <h1 className="sectionTitle">Tic Tac Toe</h1>
          <p className="sectionSubtitle">You are X, the computer is O. Win or force a draw by choosing the difficulty.</p>
        </div>

        <div className="gameShell">
          <div className="gameHeader">
            <div>
              <div className="projectTitle">AI difficulty</div>
              <div className="badgeRow" style={{ marginTop: '0.35rem' }}>
                {(['easy', 'medium', 'hard'] as const).map((level) => {
                  const { text, icon } = getDifficultyLabel(level);
                  const isActive = difficulty === level;
                  const variant =
                    level === 'easy' ? 'btnEasy' :
                    level === 'medium' ? 'btnMedium' :
                    'btnHard';
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      disabled={isAiThinking || (currentPlayer === 'O' && !gameOver)}
                      className={`btn btnDifficulty ${variant} ${isActive ? 'isActive' : ''}`}
                    >
                      <i className={icon} aria-hidden="true" />
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="gameActions">
              <button className="btn btnPrimary" onClick={resetGame}>
                {gameOver ? 'Play again' : 'Reset round'}
              </button>
              <button className="btn btnGhost" onClick={resetScores}>
                Reset scores
              </button>
            </div>
          </div>

          <div className="metricGrid">
            <div className="metricCard">
              <div className="metricLabel">You</div>
              <div className="metricValue">{scores.player}</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Empates</div>
              <div className="metricValue">{scores.draws}</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Computador</div>
              <div className="metricValue">{scores.computer}</div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            {!gameOver ? (
              <p className="muted">
                {currentPlayer === 'X' ? 'Your turn — click a spot.' : isAiThinking ? 'Computer thinking...' : 'Computer is playing.'}
              </p>
            ) : (
              <p className="muted">
                {isDraw ? 'Draw!' : winner === 'X' ? 'You won!' : 'Computer won!'}
              </p>
            )}
          </div>

          <div className="card" style={{ display: 'grid', justifyItems: 'center' }}>
            <div className="tttBoard">
              {board.map((cell, index) => {
                const isWinning = winningCells.includes(index);
                const cellClass = [
                  'tttCell',
                  cell === 'X' ? 'x' : '',
                  cell === 'O' ? 'o' : '',
                  isWinning ? 'win' : ''
                ].filter(Boolean).join(' ');

                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={gameOver || cell !== null || currentPlayer !== 'X' || isAiThinking}
                    className={cellClass}
                    aria-label={`Cell ${index + 1}`}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="metricGrid">
            <div className="metricCard">
              <div className="metricLabel">You</div>
              <div className="metricValue">X</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">IA</div>
              <div className="metricValue">O</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Goal</div>
              <div className="metricValue">3 in line</div>
            </div>
            <div className="metricCard">
              <div className="metricLabel">Controls</div>
              <div className="metricValue">Click / Tap</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TicTacToeView;
