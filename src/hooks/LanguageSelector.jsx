import React from "react";
import { motion } from "framer-motion";
// import useSound from "use-sound";

const LanguageSelector = ({ onSelectLanguage }) => {
  // const [playClick] = useSound("/sounds/click.mp3", { volume: 0.3 });

  const handleSelectLanguage = (language) => {
    // playClick();
    onSelectLanguage(language);
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-lg tracking-tight"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Hangman Game
      </motion.h1>

      <motion.div
        className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-800 to-indigo-900 rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-sm bg-opacity-90 border border-opacity-20 border-indigo-500"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
          Select Language
        </h2>
        <p className="mb-8 text-center text-gray-300">
          Choose your preferred language to play the game
        </p>
        <div className="flex flex-col gap-4">
          <motion.button
            onClick={() => handleSelectLanguage("english")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-4 rounded-xl font-bold text-lg shadow-lg text-white flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            English
          </motion.button>
          <motion.button
            onClick={() => handleSelectLanguage("kurdish")}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-4 rounded-xl font-bold text-lg shadow-lg text-white flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            کوردی سۆرانی
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mt-auto text-sm text-center text-gray-400 pt-4 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
      </motion.div>
    </motion.div>
  );
};

export default LanguageSelector;
