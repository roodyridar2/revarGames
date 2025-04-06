// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  gameTitle: 'Memory Match',
  gameDescription: 'Challenge your memory! Match all the cards before time runs out.',
  selectDifficulty: 'Select Difficulty',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  highScore: 'High Score',
  score: 'Score',
  turns: 'Turns',
  time: 'Time',
  timeSpent: 'Time Spent',
  gamePaused: 'Game Paused',
  resumeGame: 'Resume Game',
  quitGame: 'Quit Game',
  memorizeCards: 'Memorize the cards! They will flip in 2 seconds.',
  allCardsMatched: 'You matched all cards!',
  timeUp: 'Time\'s up!',
  greatJob: 'Great job!',
  betterLuckNextTime: 'Better luck next time!',
  playAgain: 'Play Again',
  backToMenu: 'Back to Menu'
};

// Kurdish Sorani translations
const kuTranslations = {
  gameTitle: 'یاری بیرەوەری',
  gameDescription: 'تاقیکردنەوەی بیرەوەریت! هەموو کارتەکان بدۆزەوە پێش تەواوبوونی کات.',
  selectDifficulty: 'ئاستی سەختی هەڵبژێرە',
  easy: 'ئاسان',
  medium: 'مامناوەند',
  hard: 'سەخت',
  highScore: 'بەرزترین نمرە',
  score: 'نمرە',
  turns: 'جولەکان',
  time: 'کات',
  timeSpent: 'کاتی بەکارهاتوو',
  gamePaused: 'یاری وەستێنراوە',
  resumeGame: 'درێژەدان بە یاری',
  quitGame: 'دەرچوون لە یاری',
  memorizeCards: 'کارتەکان لەبیر بکە! لە دوای ٢ چرکە دەگەڕێنەوە.',
  allCardsMatched: 'هەموو کارتەکانت دۆزیەوە!',
  timeUp: 'کات تەواوبوو!',
  greatJob: 'زۆر باشە!',
  betterLuckNextTime: 'جاری داهاتوو باشتر دەبیت!',
  playAgain: 'دووبارە یاری بکە',
  backToMenu: 'گەڕانەوە بۆ لیستە'
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ku: {
        translation: kuTranslations
      }
    },
    lng: localStorage.getItem('memoryGameLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;