import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Card images
import card1 from "../../assets/img/memoryGame/donut.png";
import card2 from "../../assets/img/memoryGame/drink.png";
import card3 from "../../assets/img/memoryGame/fried-chicken.png";
import card4 from "../../assets/img/memoryGame/rice.png";
import card5 from "../../assets/img/memoryGame/salad.png";
import card6 from "../../assets/img/memoryGame/paneer.png";
import food_card_cover from "../../assets/img/memoryGame/memory-loss.png";

// Card component with Framer Motion animations
const Card = ({ card, handleChoice, flipped, disabled, foodCardCover }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="relative aspect-square cursor-pointer" onClick={handleClick}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Card Front (Back of card) */}
        <motion.div 
          className="absolute w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center backface-hidden shadow-lg"
        >
          <img src={foodCardCover} alt="card back" className="w-4/5 h-4/5 object-contain" />
        </motion.div>
        
        {/* Card Back (Front of card showing image) */}
        <motion.div 
          className="absolute w-full h-full rounded-xl bg-white flex items-center justify-center backface-hidden shadow-lg"
          style={{ rotateY: "180deg" }}
        >
          <img src={card.src} alt="card front" className="w-4/5 h-4/5 object-contain" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Main difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: {
    cardCount: 8, // 4 pairs
    timeLimit: 30,
    gridCols: "grid-cols-3 sm:grid-cols-4"
  },
  medium: {
    cardCount: 12, // 6 pairs
    timeLimit: 45,
    gridCols: "grid-cols-3 sm:grid-cols-4"
  },
  hard: {
    cardCount: 16, // 8 pairs - would need 2 more card types
    timeLimit: 60,
    gridCols: "grid-cols-4"
  }
};

// All available cards
const ALL_CARDS = [
  { src: card1, matched: false },
  { src: card2, matched: false },
  { src: card3, matched: false },
  { src: card4, matched: false },
  { src: card5, matched: false },
  { src: card6, matched: false },
  // Add more card types here for hard mode
];

function MemoryGame() {
  const { t, i18n } = useTranslation();
  
  // Language state
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("memoryGameLanguage") || "en";
  });
  
  // Game state
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [cardsMatched, setCardsMatched] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameEndReason, setGameEndReason] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [preview, setPreview] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("memoryGameHighScore") || 0
  );
  const [isPaused, setIsPaused] = useState(false);

  // Prepare and shuffle cards based on difficulty
  const shuffleCards = () => {
    const cardCount = DIFFICULTY_SETTINGS[difficulty].cardCount / 2;
    const selectedCards = ALL_CARDS.slice(0, cardCount);
    
    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timeLimit);
    setCardsMatched(0);
    setTimeSpent(0);
    setDisabled(true);
    setPreview(true);
    setGameEnded(false);
    setGameEndReason("");
    setShowResults(false);
    setScore(0);
    setIsPaused(false);

    // Show preview of all cards for 2 seconds
    setTimeout(() => {
      setDisabled(false);
      setPreview(false);
    }, 2000);
  };

  // Handle card selection
  const handleChoice = (card) => {
    if (!disabled && !gameEnded && !isPaused) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  // Check for matches when two cards are selected
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      
      if (choiceOne.src === choiceTwo.src) {
        // Match found
        setCardsMatched(prev => prev + 1);
        setScore(prev => prev + 100 + Math.floor(timeLeft * 2)); // Higher score for faster matches
        
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        
        resetTurn();
      } else {
        // No match
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check for game completion
  useEffect(() => {
    const totalPairs = cards.length / 2;
    
    if (cardsMatched === totalPairs && cardsMatched > 0) {
      endGame("You matched all cards!");
      
      // Check for high score
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("memoryGameHighScore", score);
      }
    }
  }, [cardsMatched, cards.length, score, highScore]);

  // Timer logic
  useEffect(() => {
    let interval;
    
    if (timeLeft > 0 && !showResults && !preview && !gameEnded && gameStarted && !isPaused) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameEnded && gameStarted) {
      endGame("Time's up!");
    }
    
    return () => clearInterval(interval);
  }, [timeLeft, showResults, preview, gameEnded, gameStarted, isPaused]);

  // End game with specified reason
  const endGame = (reason) => {
    setGameEnded(true);
    setGameEndReason(reason);
    setShowResults(true);
  };

  // Reset turn after checking for match
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prev => prev + 1);
    setDisabled(false);
  };

  // Start a new game
  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setTimeout(() => shuffleCards(), 100);
  };

  // Rematch with same difficulty
  const handleRematch = () => {
    shuffleCards();
    setShowResults(false);
  };

  // Return to start screen
  const handleQuit = () => {
    setShowResults(false);
    setGameStarted(false);
  };

  // Toggle pause game
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("memoryGameLanguage", lang);
  };
  
  // Set initial language and document direction
  useEffect(() => {
    i18n.changeLanguage(language);
    
    // Set document direction based on language
    if (language === 'ku') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ku');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }, [language]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen w-full flex justify-center items-center flex-col overflow-hidden ">
      {!gameStarted ? (
        // Start screen with difficulty selection
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-center text-purple-600 mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {t('gameTitle')}
          </motion.h1>
          
          <p className="text-gray-700 mb-8 text-center">{t('gameDescription')}</p>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <motion.button
                className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => changeLanguage('en')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                English
              </motion.button>
              <motion.button
                className={`px-3 py-1 rounded-md ${language === 'ku' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => changeLanguage('ku')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
              >
                کوردی
              </motion.button>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-800">{t('selectDifficulty')}:</h2>
            
            <div className="grid grid-cols-3 gap-3">
              <motion.button 
                className="py-3 rounded-lg text-center border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                onClick={() => startGame("easy")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('easy')}
              </motion.button>
              
              <motion.button 
                className="py-3 rounded-lg text-center border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                onClick={() => startGame("medium")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('medium')}
              </motion.button>
              
              <motion.button 
                className="py-3 rounded-lg text-center border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                onClick={() => startGame("hard")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hard')}
              </motion.button>
            </div>
          </div>
          
          <div className="text-center text-gray-700">
            <p className="font-semibold">{t('highScore')}: {highScore}</p>
          </div>
        </motion.div>
      ) : (
        // Game screen
        <div className="w-full max-w-3xl mx-auto px-4 ">
          {/* Game header */}
          <motion.div 
            className="bg-white bg-opacity-90 rounded-xl shadow-lg p-4 mb-6 flex flex-wrap justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 text-purple-800 font-medium py-1 px-3 rounded-full">
                {t('score')}: {score}
              </div>
              <div className="bg-blue-100 text-blue-800 font-medium py-1 px-3 rounded-full">
                {t('turns')}: {turns}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.div 
                className={`font-medium py-1 px-3 rounded-full ${
                  timeLeft < 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}
                animate={{ 
                  scale: timeLeft < 10 && timeLeft > 0 ? [1, 1.1, 1] : 1 
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: timeLeft < 10 ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                {t('time')}: {formatTime(timeLeft)}
              </motion.div>
              
              <motion.button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
                onClick={togglePause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPaused ? "▶" : "❚❚"}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Pause overlay */}
          <AnimatePresence>
            {isPaused && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white rounded-lg p-6 shadow-lg text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <h2 className="text-2xl font-bold mb-4">{t('gamePaused')}</h2>
                  <motion.button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
                    onClick={togglePause}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('resumeGame')}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Game board */}
          <motion.div 
            className={`container mx-auto grid ${DIFFICULTY_SETTINGS[difficulty].gridCols} gap-3 mb-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.05 }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Card
                  card={card}
                  handleChoice={handleChoice}
                  flipped={preview || card === choiceOne || card === choiceTwo || card.matched || gameEnded}
                  disabled={disabled || gameEnded || isPaused}
                  foodCardCover={food_card_cover}
                />
                
                {/* Match animation */}
                {card.matched && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <div className="w-full h-full bg-purple-500 bg-opacity-20 rounded-xl" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {/* Hint or preview text */}
          <AnimatePresence>
            {preview && (
              <motion.div 
                className="bg-white bg-opacity-80 text-center p-2 rounded-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {t('memorizeCards')}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quit button */}
          <div className="text-center">
            <motion.button
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow"
              onClick={handleQuit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('quitGame')}
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Results modal */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <motion.div 
                className="text-center mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-2 text-purple-600">
                  {t(gameEndReason.includes("matched") ? 'allCardsMatched' : 'timeUp')}
                </h2>
                <p className="text-gray-600">
                  {gameEndReason.includes("matched") ? t('greatJob') : t('betterLuckNextTime')}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-gray-50 rounded-xl p-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <p className="text-gray-500 text-sm">{t('score')}</p>
                    <p className="text-2xl font-bold text-purple-600">{score}</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <p className="text-gray-500 text-sm">{t('highScore')}</p>
                    <p className="text-2xl font-bold text-blue-600">{highScore}</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <p className="text-gray-500 text-sm">{t('turns')}</p>
                    <p className="text-2xl font-bold">{turns}</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    <p className="text-gray-500 text-sm">{t('timeSpent')}</p>
                    <p className="text-2xl font-bold">{timeSpent}s</p>
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="flex flex-col space-y-3">
                <motion.button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  onClick={handleRematch}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {t('playAgain')}
                </motion.button>
                
                <motion.button
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg border border-gray-300 transition-colors"
                  onClick={handleQuit}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {t('backToMenu')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MemoryGame;