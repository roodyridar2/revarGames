import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
// import useSound from "use-sound";
import LanguageSelector from "../../hooks/LanguageSelector";

const Hangmman = () => {
  const [language, setLanguage] = useState(null);

  if (language === null) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-900 to-gray-900 text-white p-4 font-sans">
        <LanguageSelector onSelectLanguage={setLanguage} />
      </div>
    );
  }

  return language === "english" ? (
    <EnglishHangman onLeave={() => setLanguage(null)} />
  ) : (
    <KurdishHangman onLeave={() => setLanguage(null)} />
  );
};

// Kurdish Hangman Game
const KurdishHangman = ({ onLeave }) => {
  // Game state
  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("initial"); // 'initial', 'category', 'playing', 'won', 'lost'
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [tracker, setTracker] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Sound effects
  //   const [playCorrect] = useSound("/sounds/correct.mp3", { volume: 0.5 });
  //   const [playWrong] = useSound("/sounds/wrong.mp3", { volume: 0.5 });
  //   const [playWin] = useSound("/sounds/win.mp3", { volume: 0.7 });
  //   const [playLose] = useSound("/sounds/lose.mp3", { volume: 0.7 });
  //   const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });
  //   const [playHint] = useSound("/sounds/hint.mp3", { volume: 0.5 });

  // Kurdish Sorani alphabet
  const kurdishAlphabet = [
    "ا",
    "ب",
    "پ",
    "ت",
    "ج",
    "چ",
    "ح",
    "خ",
    "د",
    "ر",
    "ڕ",
    "ز",
    "ژ",
    "س",
    "ش",
    "ع",
    "غ",
    "ف",
    "ڤ",
    "ق",
    "ک",
    "گ",
    "ل",
    "ڵ",
    "م",
    "ن",
    "ھ",
    "ە",
    "و",
    "ۆ",
    "ۊ",
    "ی",
    "ێ",
    "ئ",
  ];

  // Vocabulary by categories (Kurdish Sorani)
  const wordCategories = {
    animals: {
      name: "ئاژەڵەکان",
      words: [
        "مامز",
        "مریشک",
        "پشیلە",
        "مەڕ",
        "بزن",
        "کەر",
        "گورگ",
        "شێر",
        "فیل",
        "مار",
        "ئەسپ",
      ],
      emoji: "🦁",
    },
    fruits: {
      name: "میوەکان",
      words: [
        "سێو",
        "پرتەقاڵ",
        "مۆز",
        "ھەنار",
        "ترێ",
        "ھەنجیر",
        "توو",
        "خۆخ",
        "شلیک",
        "گێلاس",
        "قەیسی",
      ],
      emoji: "🍎",
    },
    cities: {
      name: "شارەکان",
      words: [
        "ھەولێر",
        "سلێمانی",
        "دھۆک",
        "کەرکوک",
        "ھەڵەبجە",
        "زاخۆ",
        "کۆیە",
        "ڕانیە",
        "چەمچەماڵ",
      ],
      emoji: "🏙️",
    },
    colors: {
      name: "ڕەنگەکان",
      words: [
        "سوور",
        "سەوز",
        "شین",
        "زەرد",
        "ڕەش",
        "سپی",
        "پرتەقاڵی",
        "مۆر",
        "پەمەیی",
        
      ],
      emoji: "🎨",
    },
  };

  // Max wrong guesses allowed
  const MAX_WRONG_GUESSES = 6;

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isTimerActive && timeLeft === 0) {
      setGameStatus("lost");
      //   playLose();

      // Record session with tracker for timeout
      if (tracker) {
        tracker
          .endSession(score)
          .then((response) => {
            console.log("Session recorded successfully", response);
          })
          .catch((error) => {
            console.error("Failed to record session", error);
          });
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, score, tracker]);

  // Initialize session tracker
  useEffect(() => {
    // Initialize the tracker once the SDK is loaded
    const initTracker = () => {
      if (window.GameSessionTracker) {
        const trackerInstance = new window.GameSessionTracker();
        setTracker(trackerInstance);
      }
    };

    // Check if SDK is already loaded
    if (window.GameSessionTracker) {
      initTracker();
    } else {
      // Wait for SDK to load
      window.addEventListener("game-session-tracker-loaded", initTracker);
    }

    return () => {
      window.removeEventListener("game-session-tracker-loaded", initTracker);
    };
  }, []);

  // Show categories
  const showCategories = () => {
    // playClick();
    setGameStatus("category");

    // Try to load saved high score
    try {
      const savedHighScore = localStorage.getItem("kurdishHangmanHighScore");
      console.log("Saved high score:", savedHighScore);
      if (savedHighScore) {
        // setHighScore(parseInt(savedHighScore, 10));
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  // Start game with selected category
  const startGame = (categoryKey = null) => {
    setTimeout(() => {
      // playClick();
      let categoryToUse = categoryKey;

      // Use random category if none is selected
      if (!categoryToUse) {
        const categories = Object.keys(wordCategories);
        categoryToUse =
          categories[Math.floor(Math.random() * categories.length)];
      }

      setSelectedCategory(categoryToUse);
      const wordList = wordCategories[categoryToUse].words;
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

      setCategory(wordCategories[categoryToUse].name);
      setWord(randomWord);
      setMaskedWord("_".repeat(randomWord.length));
      setGuessedLetters([]);
      setWrongGuesses(0);
      setGameStatus("playing");
      setShowHint(false);
      setHintsUsed(0);
      setTimeLeft(60);
      setIsTimerActive(true);
    }, 1000);
  };

  // Handle letter guess
  const handleGuess = (letter) => {
    if (gameStatus !== "playing" || guessedLetters.includes(letter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    // Check if the letter is in the word
    if (word.includes(letter)) {
      //   playCorrect();
      // Update masked word
      updateMaskedWord(newGuessedLetters);
    } else {
      //   playWrong();
      // Increment wrong guesses
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      // Check if game is lost
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus("lost");
        setIsTimerActive(false);
        // playLose();

        // Record session with tracker for lost game
        if (tracker) {
          tracker
            .endSession(score)
            .then((response) => {
              console.log("Session recorded successfully", response);
            })
            .catch((error) => {
              console.error("Failed to record session", error);
            });
        }
      }
    }
  };

  // Update masked word based on guessed letters
  const updateMaskedWord = useCallback(
    (guessed) => {
      let newMasked = "";
      let allLettersGuessed = true;

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (guessed.includes(char)) {
          newMasked += char;
        } else {
          newMasked += "_";
          allLettersGuessed = false;
        }
      }

      setMaskedWord(newMasked);

      // Check if game is won
      if (allLettersGuessed) {
        const newScore =
          score +
          word.length * 10 -
          wrongGuesses * 5 -
          hintsUsed * 15 +
          timeLeft;
        setScore(newScore);
        setGameStatus("won");
        setIsTimerActive(false);
        // playWin();

        // Trigger confetti
        // confetti({
        //   particleCount: 10,
        //   spread: 70,
        //   origin: { y: 0.6 },
        // });

        // Update high score if needed
        if (newScore > highScore) {
          // setHighScore(newScore);
          try {
            localStorage.setItem(
              "kurdishHangmanHighScore",
              newScore.toString()
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      }
    },
    [word, score, wrongGuesses, hintsUsed, timeLeft, highScore]
  );

  // Effect to set initial masked word
  useEffect(() => {
    if (word) {
      updateMaskedWord(guessedLetters);
    }
  }, [word, guessedLetters, updateMaskedWord]);

  // Get a hint - reveal a random letter
  const getHint = () => {
    // playHint();
    const unguessedLetters = word
      .split("")
      .filter((letter) => !guessedLetters.includes(letter));

    if (unguessedLetters.length > 0) {
      const randomLetter =
        unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      handleGuess(randomLetter);
      setHintsUsed(hintsUsed + 1);
      setShowHint(false);
    }
  };

  // Render hangman figure
  const renderHangman = () => {
    const parts = [
      <motion.circle
        key="head"
        cx="50"
        cy="30"
        r="10"
        fill="none"
        stroke="white"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="body"
        x1="50"
        y1="40"
        x2="50"
        y2="70"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="armLeft"
        x1="50"
        y1="50"
        x2="30"
        y2="40"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="armRight"
        x1="50"
        y1="50"
        x2="70"
        y2="40"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="legLeft"
        x1="50"
        y1="70"
        x2="30"
        y2="90"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="legRight"
        x1="50"
        y1="70"
        x2="70"
        y2="90"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
    ];

    return (
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="mx-auto mb-4"
      >
        {/* Gallows */}
        <line x1="10" y1="95" x2="90" y2="95" stroke="white" strokeWidth="2" />
        <line x1="30" y1="95" x2="30" y2="10" stroke="white" strokeWidth="2" />
        <line x1="30" y1="10" x2="50" y2="10" stroke="white" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="20" stroke="white" strokeWidth="2" />

        {/* Body parts - show based on wrong guesses */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-700 via-indigo-500 to-purple-600 text-white p-4 font-sans"
      dir="rtl"
    >
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            هانگمان
          </motion.h1>
          <motion.button
            onClick={onLeave}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 px-3 py-2 rounded-lg text-white shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            گەڕانەوە
          </motion.button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {gameStatus === "initial" ? (
              <motion.div
                key="initial"
                className="w-full max-w-md bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                  چۆن یاری دەکەیت
                </h2>
                <p className="mb-8 text-center text-gray-300">
                  وشەکە بدۆزەرەوە بە هەڵبژاردنی پیتەکان. ئاگادار بە، تەنها ٦
                  هەڵەت ڕێگەپێدراوە!
                </p>
                <div className="flex justify-center">
                  <motion.button
                    onClick={showCategories}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 rounded-xl font-bold text-lg shadow-lg text-white"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    دەستپێکردنی یاری
                  </motion.button>
                </div>
              </motion.div>
            ) : gameStatus === "category" ? (
              <motion.div
                key="category"
                className="w-full max-w-md bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                  هەڵبژاردنی بابەت
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {Object.keys(wordCategories).map((categoryKey, index) => (
                    <motion.button
                      key={categoryKey}
                      onClick={() => startGame(categoryKey)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-4 rounded-xl font-bold text-lg text-center shadow-lg flex items-center justify-center text-white"
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        y: -5,
                      }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <span className="mr-3 text-3xl">
                        {wordCategories[categoryKey].emoji}
                      </span>
                      {wordCategories[categoryKey].name}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center mt-6 pt-4 border-t border-opacity-20 border-indigo-300">
                  <motion.button
                    onClick={() => startGame()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl shadow-lg text-white font-medium"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    هەڵبژاردنی هەڕەمەکی
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                className="w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between mb-4">
                  {/* <motion.div
                    className="bg-gradient-to-r from-gray-800 to-indigo-900 px-4 py-2 rounded-xl shadow-md text-white border border-opacity-20 border-indigo-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-bold">خاڵ:</span> {score}
                  </motion.div> */}
                  {/* <motion.div
                    className="bg-gradient-to-r from-gray-800 to-indigo-900 px-4 py-2 rounded-xl shadow-md text-white border border-opacity-20 border-indigo-500"
                    whileHover={{ scale: 1.05 }}
                  > */}
                  {/* <span className="font-bold">بەرزترین خاڵ:</span> {highScore} */}
                  {/* </motion.div> */}
                </div>

                <motion.div
                  className="bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-6 mb-4 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm mb-2 text-center text-gray-300">
                      {/* <span className="font-bold">بابەت:</span> {category} */}
                    </p>
                    {gameStatus === "playing" && (
                      <div
                        className={`px-4 py-2 rounded-xl font-bold ${
                          timeLeft <= 10
                            ? "bg-red-600 animate-pulse text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {timeLeft}
                      </div>
                    )}
                  </div>

                  {renderHangman()}

                  <div className="flex justify-center mb-4">
                    <motion.p
                      className="text-3xl tracking-wider text-center font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {maskedWord.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          className="inline-block mx-1"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>

                  {gameStatus === "won" && (
                    <motion.div
                      className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg mb-4 text-center shadow-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <p className="font-bold text-xl">
                        🎉 پیرۆزبایی! تۆ بردتەوە! 🎉
                      </p>
                      <p>
                        وشەکە:{" "}
                        <span className="font-bold text-cyan-300">{word}</span>
                      </p>
                    </motion.div>
                  )}

                  {gameStatus === "lost" && (
                    <motion.div
                      className="bg-gradient-to-r from-rose-700 to-rose-600 p-4 rounded-lg mb-4 text-center shadow-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <p className="font-bold text-xl">
                        😢 بەداخەوە! کاتت تەواو بوو
                      </p>
                      <p>
                        وشەکە:{" "}
                        <span className="font-bold text-cyan-300">{word}</span>
                      </p>
                    </motion.div>
                  )}

                  {gameStatus !== "playing" && (
                    <div className="flex justify-center my-3 gap-3">
                      <motion.button
                        onClick={() => startGame(selectedCategory)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:from-emerald-800 active:to-emerald-700 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        دووبارە لەم بابەتە
                      </motion.button>
                      <motion.button
                        onClick={showCategories}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        گۆڕینی بابەت
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {gameStatus === "playing" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <motion.button
                        onClick={() => setShowHint(!showHint)}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 active:from-amber-800 active:to-amber-700 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={hintsUsed >= 2}
                      >
                        {hintsUsed >= 2 ? "یارمەتی نەماوە" : "وەرگرتنی یارمەتی"}
                      </motion.button>
                    </div>

                    {showHint && hintsUsed < 2 && (
                      <motion.div
                        className="bg-amber-700 p-3 rounded-lg mb-3 text-center shadow-md h-[0] opacity-0"
                        animate={{ opacity: 1, scale: 1, height: 100 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                      >
                        <p className="mb-2">ئایا دەتەوێت پیتێک ئاشکرا بکەیت؟</p>
                        <div className="flex justify-center gap-2">
                          <motion.button
                            onClick={getHint}
                            className="bg-green-600 hover:bg-green-700 active:bg-green-800 px-3 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            بەڵێ
                          </motion.button>
                          <motion.button
                            onClick={() => setShowHint(false)}
                            className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-3 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            نەخێر
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="bg-gradient-to-br from-indigo-800 to-blue-700 rounded-lg p-4 shadow-xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex flex-wrap justify-center gap-2">
                        {kurdishAlphabet.map((letter, index) => (
                          <motion.button
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            disabled={guessedLetters.includes(letter)}
                            className={`w-10 h-10 rounded-md text-lg font-medium flex items-center justify-center shadow-md 
                            ${
                              guessedLetters.includes(letter)
                                ? word.includes(letter)
                                  ? "bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-80"
                                  : "bg-gradient-to-r from-rose-700 to-rose-600 opacity-80"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700"
                            }`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.01, duration: 0.2 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {letter}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {showLeaderboard && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              لیستی بەرزترین نمرەکان
            </h2>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-indigo-800 bg-opacity-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">#{index + 1}</span>
                    <span className="font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">هیچ نمرەیەک نییە</p>
            )}
            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={() => setShowLeaderboard(false)}
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-6 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                داخستن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// English Hangman Game
const EnglishHangman = ({ onLeave }) => {
  // Game state
  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("initial"); // 'initial', 'category', 'playing', 'won', 'lost'
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [tracker, setTracker] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Sound effects
  //   const [playCorrect] = useSound("/sounds/correct.mp3", { volume: 0.5 });
  //   const [playWrong] = useSound("/sounds/wrong.mp3", { volume: 0.5 });
  //   const [playWin] = useSound("/sounds/win.mp3", { volume: 0.7 });
  //   const [playLose] = useSound("/sounds/lose.mp3", { volume: 0.7 });
  //   const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });
  //   const [playHint] = useSound("/sounds/hint.mp3", { volume: 0.5 });

  // English alphabet
  const englishAlphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  // Vocabulary by categories (English)
  const wordCategories = {
    animals: {
      name: "Animals",
      words: [
        "ELEPHANT",
        "TIGER",
        "GIRAFFE",
        "ZEBRA",
        "LION",
        "MONKEY",
        "DOLPHIN",
        "PENGUIN",
        "KANGAROO",
        "BEAR",
        "WOLF",
        "FOX",
      ],
      emoji: "🦁",
    },
    fruits: {
      name: "Fruits",
      words: [
        "APPLE",
        "ORANGE",
        "BANANA",
        "GRAPE",
        "STRAWBERRY",
        "PINEAPPLE",
        "WATERMELON",
        "MANGO",
        "PEACH",
        "CHERRY",
        "KIWI",
        "PEAR",
      ],
      emoji: "🍎",
    },
    cities: {
      name: "Cities",
      words: [
        "LONDON",
        "PARIS",
        "TOKYO",
        "NEWYORK",
        "BERLIN",
        "ROME",
        "MADRID",
        "SYDNEY",
        "MOSCOW",
        "DUBAI",
        "CAIRO",
        "TORONTO",
      ],
      emoji: "🏙️",
    },
    colors: {
      name: "Colors",
      words: [
        "RED",
        "BLUE",
        "GREEN",
        "YELLOW",
        "PURPLE",
        "ORANGE",
        "BLACK",
        "WHITE",
        "BROWN",
        "PINK",
        "GRAY",
        "TEAL",
      ],
      emoji: "🎨",
    },
  };

  // Max wrong guesses allowed
  const MAX_WRONG_GUESSES = 6;

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isTimerActive && timeLeft === 0) {
      setGameStatus("lost");
      //   playLose();

      // Record session with tracker for timeout
      if (tracker) {
        tracker
          .endSession(score)
          .then((response) => {
            console.log("Session recorded successfully", response);
          })
          .catch((error) => {
            console.error("Failed to record session", error);
          });
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, score, tracker]);

  // Initialize session tracker
  useEffect(() => {
    // Initialize the tracker once the SDK is loaded
    const initTracker = () => {
      if (window.GameSessionTracker) {
        const trackerInstance = new window.GameSessionTracker();
        setTracker(trackerInstance);
      }
    };

    // Check if SDK is already loaded
    if (window.GameSessionTracker) {
      initTracker();
    } else {
      // Wait for SDK to load
      window.addEventListener("game-session-tracker-loaded", initTracker);
    }

    return () => {
      window.removeEventListener("game-session-tracker-loaded", initTracker);
    };
  }, []);

  // Load SDK script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/sdk/game-session-tracker.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Show categories
  const showCategories = () => {
    // playClick();
    setGameStatus("category");

    // Try to load saved high score
    try {
      const savedHighScore = localStorage.getItem("englishHangmanHighScore");
      if (savedHighScore) {
        // setHighScore(parseInt(savedHighScore, 10));
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  // Start game with selected category
  const startGame = (categoryKey = null) => {
    setTimeout(() => {
      // playClick();
      let categoryToUse = categoryKey;

      // Use random category if none is selected
      if (!categoryToUse) {
        const categories = Object.keys(wordCategories);
        categoryToUse =
          categories[Math.floor(Math.random() * categories.length)];
      }

      setSelectedCategory(categoryToUse);
      const wordList = wordCategories[categoryToUse].words;
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

      setCategory(wordCategories[categoryToUse].name);
      setWord(randomWord);
      setMaskedWord("_".repeat(randomWord.length));
      setGuessedLetters([]);
      setWrongGuesses(0);
      setGameStatus("playing");
      setShowHint(false);
      setHintsUsed(0);
      setTimeLeft(60);
      setIsTimerActive(true);
    }, 1000);
  };

  // Handle letter guess
  const handleGuess = (letter) => {
    if (gameStatus !== "playing" || guessedLetters.includes(letter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    // Check if the letter is in the word
    if (word.includes(letter)) {
      //   playCorrect();
      // Update masked word
      updateMaskedWord(newGuessedLetters);
    } else {
      //   playWrong();
      // Increment wrong guesses
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      // Check if game is lost
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus("lost");
        setIsTimerActive(false);
        // playLose();

        // Record session with tracker for lost game
        if (tracker) {
          tracker
            .endSession(score)
            .then((response) => {
              console.log("Session recorded successfully", response);
            })
            .catch((error) => {
              console.error("Failed to record session", error);
            });
        }
      }
    }
  };

  // Update masked word based on guessed letters
  const updateMaskedWord = useCallback(
    (guessed) => {
      let newMasked = "";
      let allLettersGuessed = true;

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (guessed.includes(char)) {
          newMasked += char;
        } else {
          newMasked += "_";
          allLettersGuessed = false;
        }
      }

      setMaskedWord(newMasked);

      // Check if game is won
      if (allLettersGuessed) {
        const newScore =
          score +
          word.length * 10 -
          wrongGuesses * 5 -
          hintsUsed * 15 +
          timeLeft;
        setScore(newScore);
        setGameStatus("won");
        setIsTimerActive(false);
        // playWin();

        // Trigger confetti
        // confetti({
        //   particleCount: 10,
        //   spread: 70,
        //   origin: { y: 0.6 },
        // });

        // Record session with tracker
        if (tracker) {
          tracker
            .endSession(newScore)
            .then((response) => {
              console.log("Session recorded successfully", response);
            })
            .catch((error) => {
              console.error("Failed to record session", error);
            });
        }

        // Update high score if needed
        if (newScore > highScore) {
          // setHighScore(newScore);
          try {
            localStorage.setItem(
              "englishHangmanHighScore",
              newScore.toString()
            );
          } catch {
            // Ignore localStorage errors
          }
        }
      }
    },
    [word, score, wrongGuesses, hintsUsed, timeLeft, highScore, tracker]
  );

  // Effect to set initial masked word
  useEffect(() => {
    if (word) {
      updateMaskedWord(guessedLetters);
    }
  }, [word, guessedLetters, updateMaskedWord]);

  // Get a hint - reveal a random letter
  const getHint = () => {
    // playHint();
    const unguessedLetters = word
      .split("")
      .filter((letter) => !guessedLetters.includes(letter));

    if (unguessedLetters.length > 0) {
      const randomLetter =
        unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      handleGuess(randomLetter);
      setHintsUsed(hintsUsed + 1);
      setShowHint(false);
    }
  };

  // Render hangman figure
  const renderHangman = () => {
    const parts = [
      <motion.circle
        key="head"
        cx="50"
        cy="30"
        r="10"
        fill="none"
        stroke="white"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="body"
        x1="50"
        y1="40"
        x2="50"
        y2="70"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="armLeft"
        x1="50"
        y1="50"
        x2="30"
        y2="40"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="armRight"
        x1="50"
        y1="50"
        x2="70"
        y2="40"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="legLeft"
        x1="50"
        y1="70"
        x2="30"
        y2="90"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
      <motion.line
        key="legRight"
        x1="50"
        y1="70"
        x2="70"
        y2="90"
        stroke="white"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />,
    ];

    return (
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="mx-auto mb-4"
      >
        {/* Gallows */}
        <line x1="10" y1="95" x2="90" y2="95" stroke="white" strokeWidth="2" />
        <line x1="30" y1="95" x2="30" y2="10" stroke="white" strokeWidth="2" />
        <line x1="30" y1="10" x2="50" y2="10" stroke="white" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="20" stroke="white" strokeWidth="2" />

        {/* Body parts - show based on wrong guesses */}
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-700 via-indigo-500 to-purple-600 text-white p-4 font-sans">
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Hangman
          </motion.h1>
          <motion.button
            onClick={onLeave}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 px-3 py-2 rounded-lg text-white shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Leave Game
          </motion.button>
        </div>

        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {gameStatus === "initial" ? (
              <motion.div
                key="initial"
                className="w-full max-w-md bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                  How to Play
                </h2>
                <p className="mb-8 text-center text-gray-300">
                  Discover the word by selecting letters. Be careful, you only
                  have 6 mistakes allowed!
                </p>
                <div className="flex justify-center">
                  <motion.button
                    onClick={showCategories}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 rounded-xl font-bold text-lg shadow-lg text-white"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Game
                  </motion.button>
                </div>
              </motion.div>
            ) : gameStatus === "category" ? (
              <motion.div
                key="category"
                className="w-full max-w-md bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                  Select Category
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {Object.keys(wordCategories).map((categoryKey, index) => (
                    <motion.button
                      key={categoryKey}
                      onClick={() => startGame(categoryKey)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-4 rounded-xl font-bold text-lg text-center shadow-lg flex items-center justify-center text-white"
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        y: -5,
                      }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <span className="mr-3 text-3xl">
                        {wordCategories[categoryKey].emoji}
                      </span>
                      {wordCategories[categoryKey].name}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center mt-6 pt-4 border-t border-opacity-20 border-indigo-300">
                  <motion.button
                    onClick={() => startGame()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl shadow-lg text-white font-medium"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Random Selection
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                className="w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between mb-4">
                  {/* <motion.div
                    className="bg-gradient-to-r from-gray-800 to-indigo-900 px-4 py-2 rounded-xl shadow-md text-white border border-opacity-20 border-indigo-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-bold">Score:</span> {score}
                  </motion.div> */}
                  {/* <motion.div
                    className="bg-gradient-to-r from-gray-800 to-indigo-900 px-4 py-2 rounded-xl shadow-md text-white border border-opacity-20 border-indigo-500"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-bold">High Score:</span> {highScore}
                  </motion.div> */}
                </div>

                <motion.div
                  className="bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-6 mb-4 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm mb-2 text-center text-gray-300">
                      {/* <span className="font-bold">Category:</span> {category} */}
                    </p>
                    {gameStatus === "playing" && (
                      <div
                        className={`px-4 py-2 rounded-xl font-bold ${
                          timeLeft <= 10
                            ? "bg-red-600 animate-pulse text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {timeLeft}
                      </div>
                    )}
                  </div>

                  {renderHangman()}

                  <div className="flex justify-center mb-4">
                    <motion.p
                      className="text-3xl tracking-wider text-center font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {maskedWord.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          className="inline-block mx-1"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>

                  {gameStatus === "won" && (
                    <motion.div
                      className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 rounded-lg mb-4 text-center shadow-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <p className="font-bold text-xl">
                        🎉 Congratulations! You won! 🎉
                      </p>
                      <p>
                        The word was:{" "}
                        <span className="font-bold text-cyan-300">{word}</span>
                      </p>
                    </motion.div>
                  )}

                  {gameStatus === "lost" && (
                    <motion.div
                      className="bg-gradient-to-r from-rose-700 to-rose-600 p-4 rounded-lg mb-4 text-center shadow-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <p className="font-bold text-xl">
                        😢 Sorry! You ran out of time
                      </p>
                      <p>
                        The word was:{" "}
                        <span className="font-bold text-cyan-300">{word}</span>
                      </p>
                    </motion.div>
                  )}

                  {gameStatus !== "playing" && (
                    <div className="flex justify-center my-3 gap-3">
                      <motion.button
                        onClick={() => startGame(selectedCategory)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:from-emerald-800 active:to-emerald-700 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Play Again in this Category
                      </motion.button>
                      <motion.button
                        onClick={showCategories}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Change Category
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {gameStatus === "playing" && (
                  <>
                    <div className="flex justify-center mb-3">
                      <motion.button
                        onClick={() => setShowHint(!showHint)}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 active:from-amber-800 active:to-amber-700 px-4 py-2 rounded-lg font-bold shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={hintsUsed >= 2}
                      >
                        {hintsUsed >= 2 ? "No Hints Left" : "Get Hint"}
                      </motion.button>
                    </div>

                    {showHint && hintsUsed < 2 && (
                      <motion.div
                        className="bg-amber-700 p-3 rounded-lg mb-3 text-center shadow-md h-[0] opacity-0"
                        animate={{ opacity: 1, scale: 1, height: 100 }}
                        exit={{ opacity: 0, scale: 0.1 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                      >
                        <p className="mb-2">Do you want to reveal a letter?</p>
                        <div className="flex justify-center gap-2">
                          <motion.button
                            onClick={getHint}
                            className="bg-green-600 hover:bg-green-700 active:bg-green-800 px-3 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Yes
                          </motion.button>
                          <motion.button
                            onClick={() => setShowHint(false)}
                            className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-3 py-1 rounded"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            No
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="bg-gradient-to-br from-indigo-800 to-blue-700 rounded-lg p-4 shadow-xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex flex-wrap justify-center gap-2">
                        {englishAlphabet.map((letter, index) => (
                          <motion.button
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            disabled={guessedLetters.includes(letter)}
                            className={`w-10 h-10 rounded-md text-lg font-medium flex items-center justify-center shadow-md 
                            ${
                              guessedLetters.includes(letter)
                                ? word.includes(letter)
                                  ? "bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-80"
                                  : "bg-gradient-to-r from-rose-700 to-rose-600 opacity-80"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700"
                            }`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.01, duration: 0.2 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {letter}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {showLeaderboard && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-indigo-800 bg-opacity-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">#{index + 1}</span>
                    <span className="font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No scores available</p>
            )}
            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={() => setShowLeaderboard(false)}
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-6 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Hangmman;
