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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-900 dark:via-neutral-900 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50/60 to-blue-100/60 dark:from-neutral-800/60 dark:to-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-200/40 dark:border-neutral-700/40 shadow-2xl max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 dark:from-yellow-300 dark:to-yellow-500">
              Tic Tac Toe
            </span>
          </h1>
          
          {/* Current Player or Game Status */}
          {!gameOver ? (
            <div className="flex items-center justify-center gap-3">
              {currentPlayer === 'X' ? (
                <p className="text-blue-400 text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-user"></i>
                  Your Turn - Click a cell!
                </p>
              ) : isAiThinking ? (
                <div className="flex items-center gap-3">
                  <i className="fas fa-cog animate-spin text-red-400"></i>
                  <p className="text-red-400 text-lg sm:text-xl font-semibold">
                    Computer is thinking...
                  </p>
                </div>
              ) : (
                <p className="text-red-400 text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <i className="fas fa-robot"></i>
                  Computer's Turn
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              {isDraw ? (
                <h2 className="text-2xl font-bold text-yellow-400 mb-2 flex items-center gap-2 justify-center">
                  <i className="fas fa-handshake"></i>
                  It's a Draw!
                </h2>
              ) : (
                <h2 className="text-2xl font-bold mb-2">
                  <span className={`flex items-center gap-2 justify-center ${winner === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
                    {winner === 'X' ? (
                      <>
                        <i className="fas fa-trophy"></i>
                        You Win!
                        <i className="fas fa-star"></i>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-robot"></i>
                        Computer Wins!
                        <i className="fas fa-times-circle"></i>
                      </>
                    )}
                  </span>
                </h2>
              )}
            </div>
          )}
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100/50 dark:bg-neutral-800/50 rounded-lg p-4 border border-blue-200/60 dark:border-neutral-700">
            <p className="text-blue-700 dark:text-neutral-300 text-sm mb-3 text-center flex items-center gap-2 justify-center">
              <i className="fas fa-cog"></i>
              AI Difficulty
            </p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => {
                const { text, icon } = getDifficultyLabel(level);
                return (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    disabled={isAiThinking || (currentPlayer === 'O' && !gameOver)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      difficulty === level
                        ? level === 'easy' 
                          ? 'text-white bg-green-600 border border-green-500' 
                          : level === 'medium'
                            ? 'text-neutral-900 bg-yellow-400 border border-yellow-300'
                            : 'text-white bg-red-600 border border-red-500'
                        : 'text-blue-600 hover:text-blue-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-blue-50 hover:bg-blue-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 border border-transparent'
                    } ${isAiThinking || (currentPlayer === 'O' && !gameOver) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <i className={icon}></i>
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Score Board */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-blue-500/10 rounded-lg p-3 sm:p-4 border border-blue-500/30 text-center">
              <p className="text-blue-400 font-bold text-lg sm:text-xl flex items-center gap-2 justify-center">
                <i className="fas fa-user"></i>
                You
              </p>
              <p className="text-blue-900 dark:text-white text-2xl sm:text-3xl font-bold">{scores.player}</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3 sm:p-4 border border-yellow-500/30 text-center">
              <p className="text-yellow-400 font-bold text-lg sm:text-xl flex items-center gap-2 justify-center">
                <i className="fas fa-handshake"></i>
                Draws
              </p>
              <p className="text-blue-900 dark:text-white text-2xl sm:text-3xl font-bold">{scores.draws}</p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 sm:p-4 border border-red-500/30 text-center">
              <p className="text-red-400 font-bold text-lg sm:text-xl flex items-center gap-2 justify-center">
                <i className="fas fa-robot"></i>
                Computer
              </p>
              <p className="text-blue-900 dark:text-white text-2xl sm:text-3xl font-bold">{scores.computer}</p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-100/30 dark:bg-neutral-900/50 rounded-xl border-2 border-blue-300/50 dark:border-neutral-700 p-4 sm:p-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {board.map((cell, index) => {
                let cellClasses = 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg border-2 text-2xl sm:text-3xl lg:text-4xl font-bold transition-all duration-200 transform hover:scale-105 flex items-center justify-center';
                
                if (cell === 'X') {
                  cellClasses += ' bg-blue-500/20 text-blue-400 border-blue-500/50';
                } else if (cell === 'O') {
                  cellClasses += ' bg-red-500/20 text-red-400 border-red-500/50';
                } else {
                  cellClasses += ' bg-blue-50/50 dark:bg-neutral-800/50 border-blue-200 dark:border-neutral-600 hover:border-yellow-400/60 hover:bg-blue-100/50 dark:hover:bg-neutral-700/50';
                }
                
                if (winningCells.includes(index)) {
                  cellClasses += ' ring-4 ring-yellow-400/50 animate-pulse';
                }
                
                if (gameOver || cell || currentPlayer !== 'X' || isAiThinking) {
                  cellClasses += ' cursor-not-allowed';
                } else {
                  cellClasses += ' cursor-pointer';
                }
                
                if (isAiThinking && !cell) {
                  cellClasses += ' opacity-70';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={gameOver || cell !== null}
                    className={cellClasses}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            {gameOver ? 'Play Again' : 'Reset Game'}
          </button>
          
          <button
            onClick={resetScores}
            className="bg-blue-200 hover:bg-blue-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-blue-900 dark:text-yellow-100 font-medium px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto"
          >
            Reset Scores
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-blue-600 dark:text-neutral-400 text-sm sm:text-base flex items-center gap-2 justify-center flex-wrap mb-2">
            <i className="fas fa-lightbulb text-yellow-400"></i>
            You are X, computer is O. Get 3 in a row to win!
          </p>
          <p className="text-blue-500 dark:text-neutral-500 text-xs sm:text-sm flex items-center gap-2 justify-center flex-wrap">
            <i className="fas fa-info-circle"></i>
            <span className={getDifficultyLabel(difficulty).color}>{getDifficultyLabel(difficulty).text}</span> 
            difficulty: {difficulty === 'easy' ? '70% chance AI makes random moves' : difficulty === 'medium' ? '40% chance AI makes random moves' : 'AI plays perfectly'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeView;