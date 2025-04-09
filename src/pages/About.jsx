import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import profileImage from "../assets/img/about.png";

// Flying Ball component
const FlyingBall = ({dur}) => {
  return (
    <motion.div
      className="flying-ball"
      initial={{
        x: -100,
        y: -100,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: [0, 200, 0, -200, 0],
        y: [0, -200, 100, 100, 0],
        opacity: [0, 0.8, 0.5, 0.8, 0.5],
        scale: [0, 1.5, 1, 1.5, 1],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "linear-gradient(45deg, #3498db, #1abc9c)",
        position: "absolute",
        top: "20%",
        left: "20%",
        zIndex: 1,
        filter: "blur(2px)",
        boxShadow: "0 0 20px rgba(52, 152, 219, 0.5)",
      }}
    />
  );
};

// Secondary Flying Ball with different animation path
const SecondaryFlyingBall = ({dur}) => {
  return (
    <motion.div
      className="flying-ball-secondary"
      initial={{
        x: 100,
        y: 100,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: [0, -150, 150, 50, 0],
        y: [0, 150, -100, -150, 0],
        opacity: [0, 0.6, 0.4, 0.6, 0.3],
        scale: [0, 1, 0.8, 1.2, 0.7],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        background: "linear-gradient(45deg, #e74c3c, #f39c12)",
        position: "absolute",
        bottom: "15%",
        right: "15%",
        zIndex: 1,
        filter: "blur(1.5px)",
        boxShadow: "0 0 15px rgba(231, 76, 60, 0.4)",
      }}
    />
  );
};

// Gradient background component
const GradientBackground = () => {
  return (
    <motion.div
      className="gradient-background"
      animate={{
        background: [
          "linear-gradient(120deg, rgba(240,240,250,0.9) 0%, rgba(230,240,250,0.85) 100%)",
          "linear-gradient(120deg, rgba(235,245,255,0.9) 0%, rgba(225,235,245,0.85) 100%)",
          "linear-gradient(120deg, rgba(240,248,255,0.9) 0%, rgba(230,240,250,0.85) 100%)",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        borderRadius: "16px",
      }}
    />
  );
};

const AboutPage = ({ onLanguageChange }) => {
  const [language, setLanguage] = useState("kurdish");
  const navigate = useNavigate();

  // Profile data for both languages
  const profileData = {
    kurdish: {
      title: "about",
      content: `دروستکردنی ئەم ماڵپەڕی پۆرتاڵییە بۆ یارییەکان گەشتێکی سەرنجڕاکێشە، ئامانج لەم پڕۆژەیە دابینکردنی کەشێکی زیندوی چێژ بەخشەکە یاریزانەکان لە هەرتەمەنێک دابن بتوانن چێژوەرگرن لە کۆمەڵێک یاری جۆراوجۆر.

من بە وردی هەڵبژاردنێکم کۆکردەوە کە جێگەی ئارەزوو و ئاستی لێهاتوویی جۆراوجۆر بێت، دڵنیا بووم لەوەی هەموو کەسێک بتوانێت کاتی خۆش پێکەوە بەسەر ببەن. ئەم پۆرتاڵە چەند یارییەک لە خۆ دەگرێت ؛ ناوەندێکە بۆ بەسەربردن و دۆزینەوەی ئامانجی یاریەکە و پەیوەندی ڕاستەوخۆ لەگەڵ هاوڕێیانت بە شێوەی offline.

لە کۆتاییدا هیوادارم ئەم پلاتفۆرمە ئیلهامبەخش بێت بۆ خۆشی و بەشداریکردن، خەڵک لە ڕێگەی هێزی یاریکردنەوە کۆبکاتەوە.`,
      profileAlt: "وێنەی پرۆفایل",
      back: "گەڕانەوە",
    },
    english: {
      title: "About",
      content: `Creating this gaming portal website has been a fascinating journey. The goal of this project is to provide a vibrant, enjoyable environment where gamers of all ages can enjoy a variety of different games.

I've carefully curated a selection that accommodates various interests and skill levels, ensuring that everyone can have a great time together. This portal includes multiple games; it's a hub for entertainment, discovering game objectives, and direct interaction with your friends in offline mode.

Finally, I hope this platform inspires fun and participation, bringing people together through the power of gaming.`,
      profileAlt: "Profile Image",
      back: "Back",
    },
  };

  const toggleLanguage = () => {
    const newLanguage = language === "kurdish" ? "english" : "kurdish";
    setLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const currentLang = profileData[language];
  const isKurdish = language === "kurdish";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
<motion.div
    className="fixed w-screen h-screen inset-0 bg-gradient-to-b from-blue-700 via-purple-800 to-purple-900 text-white overflow-auto"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
    style={{
      fontFamily: isKurdish
        ? '"Rabar_013", Arial, sans-serif'
        : '"Roboto", Arial, sans-serif',
      direction: isKurdish ? "rtl" : "ltr",
      margin: 0,
      padding: "2rem",
      position: "relative",
    }}
  >
      {/* Add gradient background */}
      <GradientBackground />

      {/* Add flying balls */}
      <FlyingBall 

        dur={15}
      />
      <FlyingBall 

        dur={10}
      />
      <SecondaryFlyingBall 

        dur={12}
      />
      <SecondaryFlyingBall
      dur={8}
       />
      <SecondaryFlyingBall
      dur={6}
       />

      <motion.div
        className=" "
        variants={itemVariants}
        style={{
          display: "flex",
          justifyContent: isKurdish ? "space-between" : "space-between",
          flexDirection: isKurdish ? "row-reverse" : "row",
          alignItems: "center",
          marginBottom: "2rem",
          position: "relative", // To appear above the background
          zIndex: 2,
        }}
      >
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05, x: isKurdish ? 5 : -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "#000",
            border: "1px solid #3498db",
            borderRadius: "8px",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
            backdropFilter: "blur(5px)",
          }}
        >
          {isKurdish ? `→ ${currentLang.back}` : `← ${currentLang.back}`}
        </motion.button>

        {/* <motion.button
          onClick={toggleLanguage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "linear-gradient(135deg, #3498db, #2980b9)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.2rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            boxShadow: "0 4px 6px rgba(52, 152, 219, 0.2)",
          }}
        >
          {isKurdish ? "English" : "کوردی"}
        </motion.button> */}
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: "flex",
          flexDirection: isKurdish ? "row-reverse" : "row",
          alignItems: "center",
          gap: "3rem",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          variants={fadeIn}
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center items-center"
          style={{
            flex: "0 0 320px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            aspectRatio: "1",
            position: "relative",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            className="profile-image-container"
            initial={{ scale: 1.2, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
              backgroundImage: `url(${profileImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Add glow effect around the image */}
            <motion.div
              className="image-glow"
              animate={{ 
                boxShadow: [
                  "0 0 15px rgba(52, 152, 219, 0.3)",
                  "0 0 25px rgba(52, 152, 219, 0.5)",
                  "0 0 15px rgba(52, 152, 219, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                inset: "10px",
                borderRadius: "12px",
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="  border-2 border-white"
          style={{
            flex: "1 1 600px",
            textAlign: isKurdish ? "right" : "left",
            padding: "2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.h1
          className=" p-2 text-white font-bold  text-center"

            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: "2.5rem",
              marginBottom: "1.5rem",
              fontWeight: "700",
              WebkitBackgroundClip: "text",
            }}
          >
            {currentLang.title}
          </motion.h1>

          <motion.div

          className=" p-2  text-white font-bold  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              lineHeight: "1.9",
              fontSize: "1.1rem",
              whiteSpace: "pre-line",
            }}
          >
            {currentLang.content}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Add layout change animation when language changes
const AnimatedAboutPage = () => {
  const [key, setKey] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("kurdish");

  // Update the key when language changes to trigger animation
  const handleLanguageChange = (newLanguage) => {
    setKey((prevKey) => prevKey + 1);
    setCurrentLanguage(newLanguage);
  };

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: currentLanguage === "kurdish" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AboutPage onLanguageChange={handleLanguageChange} />
    </motion.div>
  );
};

export default AnimatedAboutPage;