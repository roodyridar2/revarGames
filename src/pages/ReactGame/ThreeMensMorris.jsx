import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ThreeMensMorris = () => {
  // Language state
  const [language, setLanguage] = useState('english'); // 'english' or 'kurdish'
  
  // Game state
  const [phase, setPhase] = useState('placement'); // 'placement' or 'movement'
  const [currentPlayer, setCurrentPlayer] = useState('black'); // 'black' or 'white'
  const [blackPieces, setBlackPieces] = useState(3); // remaining black pieces to place
  const [whitePieces, setWhitePieces] = useState(3); // remaining white pieces to place
  const [winner, setWinner] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  
  // Translations
  const translations = {
    english: {
      title: "Three Men's Morris",
      turn: "{player}'s Turn",
      placementPhase: "Placement Phase",
      movementPhase: "Movement Phase",
      blackPlayer: "Black",
      whitePlayer: "White",
      blackPieces: "Black Pieces",
      whitePieces: "White Pieces",
      wins: "Wins!",
      newGame: "New Game",
      playAgain: "Play Again",
      gameRules: "Game Rules:",
      rules: [
        "Each player has 3 pieces to place on the board",
        "After placing all pieces, players take turns moving along the lines",
        "First player to get three pieces in a row wins"
      ],
      movementTip: "Tip: Click on your piece to select it, then click on a valid position to move."
    },
    kurdish: {
      title: "یاری سێ پیاوی موریس",
      turn: "نۆرەی {player}",
      placementPhase: "قۆناغی دانان",
      movementPhase: "قۆناغی جووڵان",
      blackPlayer: "ڕەش",
      whitePlayer: "سپی",
      blackPieces: "دانەکانی ڕەش",
      whitePieces: "دانەکانی سپی",
      wins: "بردیەوە!",
      newGame: "یاری نوێ",
      playAgain: "دووبارە یاری بکە",
      gameRules: "یاساکانی یاری:",
      rules: [
        "هەر یاریزانێک ٣ دانەی هەیە بۆ دانان لەسەر تەختە",
        "دوای دانانی هەموو دانەکان، یاریزانەکان بە نۆرە دانەکانیان دەجووڵێنن",
        "یەکەم یاریزان کە بتوانێت سێ دانە بخاتە ڕیز بردویەتیەوە"
      ],
      movementTip: "ئامۆژگاری: کلیک لەسەر دانەکەت بکە بۆ هەڵبژاردنی، پاشان کلیک لەسەر شوێنێکی گونجاو بکە بۆ جووڵاندنی."
    }
  };
  
  // Get current translation
  const t = translations[language];
  
  // Board state - null means empty, 'black' or 'white' means occupied
  const [board, setBoard] = useState([
    null, null, null, // 0, 1, 2
    null, null, null, // 3, 4, 5
    null, null, null  // 6, 7, 8
  ]);
  
  // Board positions coordinates for rendering
  const positions = [
    { x: 50, y: 50 },   // 0: top-left
    { x: 150, y: 50 },  // 1: top-middle
    { x: 250, y: 50 },  // 2: top-right
    { x: 50, y: 150 },  // 3: middle-left
    { x: 150, y: 150 }, // 4: center
    { x: 250, y: 150 }, // 5: middle-right
    { x: 50, y: 250 },  // 6: bottom-left
    { x: 150, y: 250 }, // 7: bottom-middle
    { x: 250, y: 250 }  // 8: bottom-right
  ];
  
  // Valid connections between positions (valid moves)
  const connections = [
    [1, 3, 4],      // connections from position 0
    [0, 2, 4],      // connections from position 1
    [1, 4, 5],      // connections from position 2
    [0, 4, 6],      // connections from position 3
    [0, 1, 2, 3, 5, 6, 7, 8], // connections from position 4 (center)
    [2, 4, 8],      // connections from position 5
    [3, 4, 7],      // connections from position 6
    [4, 6, 8],      // connections from position 7
    [4, 5, 7]       // connections from position 8
  ];
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'kurdish' : 'english');
  };
  
  // Check for a win (3 in a row)
  const checkWin = (newBoard, player) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    return winPatterns.some(pattern => 
      pattern.every(pos => newBoard[pos] === player)
    );
  };
  
  // Handle position click during placement phase
  const handlePlacement = (position) => {
    if (board[position] !== null || winner) return;
    
    const newBoard = [...board];
    newBoard[position] = currentPlayer;
    
    // Update the board
    setBoard(newBoard);
    
    // Check for win
    if (checkWin(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }
    
    // Update pieces count
    if (currentPlayer === 'black') {
      const newCount = blackPieces - 1;
      setBlackPieces(newCount);
      
      // If all pieces are placed, switch to movement phase
      if (newCount === 0 && whitePieces === 0) {
        setPhase('movement');
      }
    } else {
      const newCount = whitePieces - 1;
      setWhitePieces(newCount);
      
      // If all pieces are placed, switch to movement phase
      if (newCount === 0 && blackPieces === 0) {
        setPhase('movement');
      }
    }
    
    // Switch player
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };
  
  // Check if a move is valid
  const isValidMove = (from, to) => {
    return board[to] === null && connections[from].includes(to);
  };
  
  // Handle piece selection and movement
  const handlePieceSelect = (position) => {
    if (winner) return;
    
    if (phase === 'placement') {
      handlePlacement(position);
      return;
    }
    
    // Movement phase
    if (selectedPiece === null) {
      // Select a piece if it belongs to the current player
      if (board[position] === currentPlayer) {
        setSelectedPiece(position);
      }
    } else if (selectedPiece === position) {
      // Deselect if clicking on the same piece
      setSelectedPiece(null);
    } else if (isValidMove(selectedPiece, position)) {
      // Move the piece
      const newBoard = [...board];
      newBoard[position] = currentPlayer;
      newBoard[selectedPiece] = null;
      
      setBoard(newBoard);
      setSelectedPiece(null);
      
      // Check for win
      if (checkWin(newBoard, currentPlayer)) {
        setWinner(currentPlayer);
        return;
      }
      
      // Switch player
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setPhase('placement');
    setCurrentPlayer('black');
    setBlackPieces(3);
    setWhitePieces(3);
    setWinner(null);
    setSelectedPiece(null);
    setBoard(Array(9).fill(null));
  };
  
  // Draw the lines between positions
  const renderLines = () => {
    // Define all lines to draw based on valid connections
    const linesToDraw = [
      // Horizontal lines
      { from: 0, to: 1 }, { from: 1, to: 2 },
      { from: 3, to: 4 }, { from: 4, to: 5 },
      { from: 6, to: 7 }, { from: 7, to: 8 },
      // Vertical lines
      { from: 0, to: 3 }, { from: 3, to: 6 },
      { from: 1, to: 4 }, { from: 4, to: 7 },
      { from: 2, to: 5 }, { from: 5, to: 8 },
      // Diagonal lines
      { from: 0, to: 4 }, { from: 4, to: 8 },
      { from: 2, to: 4 }, { from: 4, to: 6 }
    ];
    
    return linesToDraw.map((line, index) => {
      const from = positions[line.from];
      const to = positions[line.to];
      
      return (
        <line 
          key={index}
          x1={from.x} 
          y1={from.y} 
          x2={to.x} 
          y2={to.y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    });
  };
  
  // Render the game pieces
  const renderPieces = () => {
    return board.map((piece, position) => {
      if (piece === null) return null;
      
      const pos = positions[position];
      const isSelected = position === selectedPiece;
      
      return (
        <motion.circle
          key={`piece-${position}`}
          cx={pos.x}
          cy={pos.y}
          r="18"
          fill={piece === 'black' ? '#1e293b' : '#f8fafc'}
          stroke={isSelected ? "#3b82f6" : (piece === 'black' ? '#0f172a' : '#cbd5e1')}
          strokeWidth="3"
          initial={false}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePieceSelect(position)}
          className="cursor-pointer"
          filter={isSelected ? "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))" : "drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.15))"}
        />
      );
    });
  };
  
  // Render empty positions (for placement clicks)
  const renderPositions = () => {
    return positions.map((pos, index) => (
      <motion.circle
        key={`pos-${index}`}
        cx={pos.x}
        cy={pos.y}
        r="15"
        fill="transparent"
        stroke={board[index] === null ? "#cbd5e1" : "transparent"}
        strokeWidth="1"
        strokeDasharray={board[index] === null && selectedPiece !== null && isValidMove(selectedPiece, index) ? "3,3" : "0"}
        whileHover={board[index] === null ? { scale: 1.2, fill: "rgba(203, 213, 225, 0.2)" } : {}}
        onClick={() => handlePieceSelect(index)}
        className="cursor-pointer"
      />
    ));
  };
  
  // Render unplaced pieces
  const renderUnplacedPieces = () => {
    const unplacedPieces = [];
    
    // Black pieces to place
    for (let i = 0; i < blackPieces; i++) {
      unplacedPieces.push(
        <motion.circle
          key={`unplaced-black-${i}`}
          cx={350 + i * 40}
          cy={100}
          r="18"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="3"
          filter="drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.15))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      );
    }
    
    // White pieces to place
    for (let i = 0; i < whitePieces; i++) {
      unplacedPieces.push(
        <motion.circle
          key={`unplaced-white-${i}`}
          cx={350 + i * 40}
          cy={200}
          r="18"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="3"
          filter="drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.15))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      );
    }
    
    return unplacedPieces;
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100" dir={language === 'kurdish' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md flex justify-between items-center mb-4 px-4">
        <h1 className={`text-4xl font-bold text-indigo-800 tracking-tight ${language === 'kurdish' ? 'font-kurdish' : ''}`}>
          {t.title}
        </h1>
        <button 
          onClick={toggleLanguage}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md font-medium"
        >
          {language === 'english' ? 'کوردی' : 'English'}
        </button>
      </div>
      
      <div className="mb-6 bg-white p-4 rounded-xl shadow-md w-[550px] text-center">
        {!winner && (
          <div className="flex items-center justify-center gap-4">
            <div className={`w-8 h-8 rounded-full ${currentPlayer === 'black' ? 'bg-black' : 'bg-white border-2 border-gray-300'}`}></div>
            <div className={`text-xl font-medium ${language === 'kurdish' ? 'font-kurdish' : ''}`}>
              <span className="text-gray-700">
                {t.turn.replace('{player}', currentPlayer === 'black' ? 
                  t.blackPlayer : t.whitePlayer)}
              </span>
            </div>
          </div>
        )}
        <div className={`mt-2 text-lg font-medium text-indigo-600 ${language === 'kurdish' ? 'font-kurdish' : ''}`}>
          {phase === 'placement' ? t.placementPhase : t.movementPhase}
        </div>
      </div>
      
      <div className="relative bg-white rounded-2xl shadow-xl p-6 mb-8">
        <svg width="500" height="300" viewBox="0 0 500 300">
          {/* Game board background */}
          <rect x="20" y="20" width="260" height="260" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" rx="10" />
          
          {/* Game lines */}
          {renderLines()}
          
          {/* Empty positions */}
          {renderPositions()}
          
          {/* Placed pieces */}
          {renderPieces()}
          
          {/* Unplaced pieces */}
        
          {renderUnplacedPieces()}
          
          {/* Labels */}
          {/* <text x="350" y="80" className="text-sm font-medium" fill="#475569">
            {t.blackPieces}
          </text>
          <text x="350" y="180" className="text-sm font-medium" fill="#475569">
            {t.whitePieces}
          </text> */}
        </svg>
      </div>
      
      <div className="space-y-6 max-w-md">
        <button 
          onClick={resetGame}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md font-medium ${language === 'kurdish' ? 'font-kurdish' : ''}`}
        >
          {t.newGame}
        </button>
        
        <div className={`bg-white p-4 rounded-xl shadow-md text-gray-700 ${language === 'kurdish' ? 'font-kurdish' : ''}`}>
          <h3 className="font-bold text-lg mb-2 text-indigo-800">{t.gameRules}</h3>
          <ul className="space-y-1 list-disc list-inside">
            {t.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
          {phase === 'movement' && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg text-blue-700 font-medium">
              {t.movementTip}
            </div>
          )}
        </div>
      </div>
      
      {/* Win Popup */}
      {winner && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full m-4 text-center ${language === 'kurdish' ? 'font-kurdish' : ''}`}
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className={winner === 'black' ? 'text-black' : 'text-gray-500'}>
                {winner === 'black' ? t.blackPlayer : t.whitePlayer}
              </span> {t.wins}
            </h2>
            <div className="mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full ${winner === 'black' ? 'bg-black' : 'bg-white border-4 border-gray-300'}`}></div>
            </div>
            <button 
              onClick={resetGame}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              {t.playAgain}
            </button>
          </motion.div>
        </div>
      )}
      
      {/* Add CSS for Kurdish font */}
      <style jsx global>{`
        @font-face {
          font-family: 'Kurdish';
          src: url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
          font-weight: normal;
          font-style: normal;
        }
        
        .font-kurdish {
          font-family: 'Amiri', 'Arial', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default ThreeMensMorris;