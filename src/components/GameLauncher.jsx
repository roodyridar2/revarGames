/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Game data array with enhanced colors and icons
const GAMES = [
  {
    id: "memory",
    title: "Memory Game",
    path: "/memory-game",
    description: "Test your recall skills",
    color: "from-pink-500 to-purple-600",
    isPopular: false,
    isNew: false,
    category: "Casual",
    releaseDate: "2023-06-15",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    id: "hangman",
    title: "Hangman",
    path: "/hangman",
    description: "Guess the hidden word",
    color: "from-amber-400 to-orange-600",
    isPopular: false,
    isNew: false,
    category: "Word",
    releaseDate: "2023-08-20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    path: "/ticTacToe",
    description: "Classic X and O game",
    color: "from-emerald-400 to-teal-600",
    isPopular: false,
    isNew: false,
    category: "Casual",
    releaseDate: "2023-08-20",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  {
    id: "ThreeMensMorris",
    title: "Three rocks and papers",
    path: "/ThreeMensMorris",
    description: "three rocks and papers",
    color: "from-red-400 to-red-600",
    isPopular: false,
    isNew: false,
    category: "Casual",
    releaseDate: "2023-08-21",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
];

const GameCard = ({ game, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced card with more vibrant animations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link
        to={game.path}
        className="block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-xl h-full"
          animate={{
            boxShadow: isHovered
              ? "0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -5px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Animated background with more vibrant gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${game.color}`}
            animate={{
              opacity: isHovered ? 1 : 0.9,
              backgroundPosition: isHovered ? "100% 0%" : "0% 0%",
              backgroundSize: isHovered ? "120% 120%" : "100% 100%",
            }}
            transition={{ duration: 0.6 }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Enhanced particle effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/30"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                  }}
                  animate={{
                    y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + Math.random() * 2,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </motion.div>
          )}

          <motion.div className="relative p-4 flex items-center h-full">
            {/* Enhanced Icon with glow effect */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              initial={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              animate={{
                backgroundColor: isHovered
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(255, 255, 255, 0.2)",
                boxShadow: isHovered
                  ? "0 0 15px 2px rgba(255, 255, 255, 0.3)"
                  : "none",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.7 }}
                className="w-6 h-6"
              >
                {game.icon}
              </motion.div>
            </motion.div>

            {/* Text with enhanced animations */}
            <div className="ml-4 flex-grow">
              <motion.h2
                className="text-base font-bold text-white leading-tight"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  x: isHovered ? 2 : 0,
                  textShadow: isHovered
                    ? "0 0 8px rgba(255, 255, 255, 0.5)"
                    : "none",
                }}
                transition={{ duration: 0.2 }}
              >
                {game.title}
              </motion.h2>

              <motion.p
                className="text-white text-xs"
                initial={{ opacity: 0.7 }}
                animate={{
                  opacity: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 1,
                }}
              >
                {game.description}
              </motion.p>
            </div>

            {/* Enhanced arrow animation */}
            <motion.div
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2 shrink-0"
              initial={{ opacity: 0, scale: 0, x: -5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                x: isHovered ? 0 : -5,
                boxShadow: isHovered
                  ? "0 0 10px 1px rgba(255, 255, 255, 0.2)"
                  : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{
                  x: isHovered ? [0, 2, 0] : 0,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const GameLauncher = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Get unique categories for filter
  const categories = ["All", ...new Set(GAMES.map((game) => game.category))];

  // Filter games based on search term and category
  const filteredGames = GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || game.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Create dynamic game categories
  const gameCategories = [
    {
      id: "new-releases",
      title: "New Releases",
      games: filteredGames.filter((game) => game.isNew),
    },
    {
      id: "popular",
      title: "Popular Games",
      games: filteredGames.filter((game) => game.isPopular),
    },
    {
      id: "Casual",
      title: "Casual Games",
      games: filteredGames.filter((game) => game.category === "Casual"),
    },
    {
      id: "arcade",
      title: "Arcade Games",
      games: filteredGames.filter((game) => game.category === "Arcade"),
    },
    {
      id: "word",
      title: "Word Games",
      games: filteredGames.filter((game) => game.category === "Word"),
    },
  ];

  // Only show categories that have games after filtering
  const visibleCategories = gameCategories.filter(
    (category) => category.games.length > 0
  );

  return (
    <motion.div
      // Add animation for background
      className="min-h-screen flex justify-center items-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-700 via-purple-800 to-purple-900"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        className="max-w-4xl w-full backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20 relative z-10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        {/* Enhanced header with more vibrant gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Portal Games
            </motion.span>
            <motion.span 
              className="text-sm md:text-base block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-fuchsia-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Choose your challenge
            </motion.span>
          </h1>

          {/* Search and Filter Controls */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6"
            initial={{ opacity: 0, width: "50%" }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Search input */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
              <div className="absolute right-3 top-2.5 text-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category filter */}
            <div className="relative w-full max-w-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400 appearance-none pr-10"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    style={{
                      backgroundColor: "#1f2937",
                      color: "white",
                    }}
                  >
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic game categories with enhanced styling */}
        <AnimatePresence>
          {visibleCategories.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {visibleCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                >
                  <motion.h3 
                    className="text-xs font-medium uppercase tracking-wider px-2 py-1 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-300 to-blue-300"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    <span className="inline-block w-2 h-2 bg-fuchsia-400 rounded-full mr-2"></span>
                    {category.title} ({category.games.length})
                  </motion.h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {category.games.map((game, gameIndex) => (
                      <GameCard key={game.id} game={game} index={gameIndex} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12 text-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No games found matching "{searchTerm}". Try another search term.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced progress indicator */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex space-x-2">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-blue-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{
                  scale: 1.5,
                  boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.p 
            className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-fuchsia-200 to-cyan-200"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            © 2025 Hevar Portals Games |{" "}
            <Link to="#" className="underline hover:text-white">
              About
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameLauncher;