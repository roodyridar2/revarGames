import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameHistory, setGameHistory] = useState({ X: 0, O: 0, tie: 0 });
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Check for winner
  useEffect(() => {
    const winningPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine(pattern);
        setGameHistory(prev => ({
          ...prev,
          [board[a]]: prev[board[a]] + 0.5
        }));
        setIsConfettiActive(true);
        return;
      }
    }

    // Check for tie
    if (!board.includes(null) && !winner) {
      setWinner('tie');
      setGameHistory(prev => ({
        ...prev,
        tie: prev.tie + 1
      }));
    }
  }, [board, winner]);

  // Handle click on a cell
  const handleClick = (index) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsConfettiActive(false);
  };

  // Render X or O in a cell
  const renderCell = (index) => {
    const isWinningCell = winningLine.includes(index);
    
    return (
      <motion.div
        className={`w-full h-full flex items-center justify-center ${isWinningCell ? 'text-emerald-500' : board[index] === 'X' ? 'text-indigo-600' : 'text-pink-500'}`}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {board[index] === 'X' && (
          <motion.svg 
            viewBox="0 0 24 24" 
            width="60%" 
            height="60%"
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.line x1="18" y1="6" x2="6" y2="18" />
            <motion.line x1="6" y1="6" x2="18" y2="18" />
          </motion.svg>
        )}
        
        {board[index] === 'O' && (
          <motion.svg 
            viewBox="0 0 24 24" 
            width="60%" 
            height="60%"
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.circle cx="12" cy="12" r="8" />
          </motion.svg>
        )}
      </motion.div>
    );
  };

  // Confetti component
  const Confetti = () => {
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
      if (isConfettiActive) {
        const newParticles = [];
        const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB'];
        
        for (let i = 0; i < 100; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * 100,
            y: -20 - Math.random() * 100,
            size: 5 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
          });
        }
        
        setParticles(newParticles);
        
        const timeout = setTimeout(() => {
          setIsConfettiActive(false);
        }, 3000);
        
        return () => clearTimeout(timeout);
      }
    }, [isConfettiActive]);
    
    if (!isConfettiActive) return null;
    
    return (
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
            initial={{ y: particle.y }}
            animate={{
              y: `${100 + Math.random() * 50}vh`,
              x: `${particle.x + (Math.random() * 40 - 20)}%`,
              opacity: [1, 1, 0],
              rotate: `${particle.rotation + 360 * 2}`,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Get status message
  const getStatusMessage = () => {
    if (winner === 'tie') {
      return "It's a tie!";
    } else if (winner) {
      return `Player ${winner} wins!`;
    } else {
      return `Player ${isXNext ? 'X' : 'O'}'s turn`;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white overflow-hidden">
      <Confetti />
      
      <motion.h1 
        className="mb-6 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tic Tac Toe
      </motion.h1>
      
      <motion.div 
        className="mb-8 text-xl font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {getStatusMessage()}
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-3 gap-3 bg-gray-800 p-3 rounded-lg shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {board.map((_, index) => (
          <motion.button
            key={index}
            className={`h-24 w-24 md:h-28 md:w-28 bg-gray-700 rounded-lg shadow-inner hover:bg-gray-600 transition-colors duration-300 ${winningLine.includes(index) ? 'ring-2 ring-emerald-400' : ''}`}
            onClick={() => handleClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={board[index] || winner}
          >
            {board[index] && renderCell(index)}
          </motion.button>
        ))}
      </motion.div>
      
      <motion.button
        className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full font-medium shadow-lg transition-all duration-300"
        onClick={resetGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        New Game
      </motion.button>
      
      <motion.div
        className="mt-12 grid grid-cols-3 gap-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-indigo-400 text-xl font-bold">X</div>
          <div className="text-2xl font-bold">{gameHistory.X}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-gray-400 text-xl font-bold">Ties</div>
          <div className="text-2xl font-bold">{gameHistory.tie}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-pink-400 text-xl font-bold">O</div>
          <div className="text-2xl font-bold">{gameHistory.O}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicTacToe;