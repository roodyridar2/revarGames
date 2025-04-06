import React, { useState, useEffect, useCallback } from 'react';

const RecipeAssembly = () => {
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'ku' for Kurdish Sorani

  // Translations for interface text
  const translations = {
    en: {
      title: 'Kurdish Heritage Quest',
      subtitle: 'Culinary Traditions',
      score: 'Score',
      recipe: 'Recipe',
      cookingInstructions: 'Cooking Instructions',
      selectIngredients: 'Select all the necessary ingredients for making',
      chooseCarefully: 'Choose carefully! Each incorrect attempt will cost you points.',
      selectedIngredients: 'Selected Ingredients',
      noIngredientsSelected: 'No ingredients selected yet',
      availableIngredients: 'Available Ingredients',
      reset: 'Reset',
      checkIngredients: 'Check Ingredients',
      nextRecipe: 'Next Recipe',
      about: 'About',
      moreRecipes: 'More Recipes',
      contact: 'Contact',
      explore: 'Explore and celebrate Kurdish Sorani culture',
      excellent: 'Excellent! You selected all the correct ingredients!',
      missing: 'Sorry, you\'re missing:',
      extra: 'Sorry, you added extra ingredients:',
      continueExploring: 'Continue exploring Kurdish cuisine',
      learnMore: 'Learn more about this dish'
    },
    ku: {
      title: 'گەڕانی میراتی کوردی',
      subtitle: 'نەریتەکانی خواردن',
      score: 'خاڵ',
      recipe: 'چێشت',
      cookingInstructions: 'ڕێنمایی چێشتلێنان',
      selectIngredients: 'هەموو پێکهاتەکانی پێویست هەڵبژێرە بۆ دروستکردنی',
      chooseCarefully: 'بە وریاییەوە هەڵبژێرە! هەر هەوڵێکی هەڵە خاڵەکانت کەم دەکاتەوە.',
      selectedIngredients: 'پێکهاتە هەڵبژێردراوەکان',
      noIngredientsSelected: 'هیچ پێکهاتەیەک هەڵنەبژێردراوە',
      availableIngredients: 'پێکهاتە بەردەستەکان',
      reset: 'دووبارە ڕێکخستنەوە',
      checkIngredients: 'پشکنینی پێکهاتەکان',
      nextRecipe: 'چێشتی داهاتوو',
      about: 'دەربارە',
      moreRecipes: 'چێشتی زیاتر',
      contact: 'پەیوەندی',
      explore: 'گەڕان و پیرۆزکردنی کەلتووری کوردی سۆرانی',
      excellent: 'زۆر باشە! تۆ هەموو پێکهاتە دروستەکانت هەڵبژارد!',
      missing: 'ببورە، ئەمانەت کەمە:',
      extra: 'ببورە، پێکهاتەی زیادەت زیاد کردووە:',
      continueExploring: 'بەردەوام بە لە گەڕان بەدوای چێشتی کوردیدا',
      learnMore: 'زیاتر بزانە دەربارەی ئەم چێشتە'
    }
  };

  const recipes = [
    {
      name: {
        en: 'Dolma (دۆڵمە)',
        ku: 'دۆڵمە (Dolma)'
      },
      description: {
        en: 'Stuffed vegetables with rice and herbs',
        ku: 'سەوزە پڕکراو بە برنج و گیا بۆنخۆشەکان'
      },
      ingredients: ['گەڵای مێو (vine leaves)', 'برنج (rice)', 'گۆشتی ورد (minced meat)', 'پیاز (onion)', 'ڕەیحان (basil)'],
      extraIngredients: ['تەماتە (tomato)', 'سیر (garlic)', 'لیمۆ (lemon)', 'ئاو (water)'],
      emoji: '🍀',
      details: {
        en: 'Dolma is a family of stuffed dishes common in Mediterranean cuisine made with vegetables such as tomatoes, peppers, onions, zucchini, or leafy vegetables like cabbage or vine leaves.',
        ku: 'دۆڵمە خێزانێکی خواردنی پڕکراوە کە لە چێشتی مەدیتەرانەدا باوە و بە سەوزەوات وەک تەماتە، بیبەر، پیاز، کۆسە، یان سەوزە گەڵادارەکان وەک کەلەرم یان گەڵای مێو دروست دەکرێت.'
      }
    },
    {
      name: {
        en: 'Biryani (بریانی)',
        ku: 'بریانی (Biryani)'
      },
      description: {
        en: 'Festive rice dish with meat and spices',
        ku: 'خواردنی برنجی بۆنەکان لەگەڵ گۆشت و بەهارات'
      },
      ingredients: ['برنج (rice)', 'گۆشتی مریشک (chicken)', 'مێوژ (raisins)', 'داروچینی (cinnamon)', 'بەهارات (spices)'],
      extraIngredients: ['هێلکە (egg)', 'خەیار (cucumber)', 'ئاو (water)', 'سماق (sumac)'],
      emoji: '🍚',
      details: {
        en: 'Biryani is a mixed rice dish originating among the Muslims of the Indian subcontinent. It is made with Indian spices, rice, and meat usually that of chicken, goat, lamb, or fish.',
        ku: 'بریانی خواردنێکی برنجی تێکەڵە کە لە نێو موسڵمانەکانی نیمچە کیشوەری هیندەوە سەرچاوە دەگرێت. بە بەهاراتی هیندی، برنج و گۆشت دروست دەکرێت کە زۆر جار مریشک، بزن، بەران یان ماسی بەکاردێت.'
      }
    },
    {
      name: {
        en: 'Yaprax (یاپراخ)',
        ku: 'یاپراخ (Yaprax)'
      },
      description: {
        en: 'Stuffed vine leaves with rice and vegetables',
        ku: 'گەڵای مێو پڕکراو بە برنج و سەوزە'
      },
      ingredients: ['گەڵای مێو (vine leaves)', 'برنج (rice)', 'تەماتە (tomato)', 'لیمۆ (lemon)', 'پیاز (onion)'],
      extraIngredients: ['پەنیر (cheese)', 'ماست (yogurt)', 'گۆشت (meat)', 'فستق (pistachio)'],
      emoji: '🍃',
      details: {
        en: 'Yaprax is a traditional Kurdish dish made of vine leaves stuffed with rice, vegetables, and sometimes meat. It\'s often served with yogurt and is especially popular during festive occasions.',
        ku: 'یاپراخ خواردنێکی نەریتی کوردییە کە لە گەڵای مێو پڕکراو بە برنج، سەوزەوات و هەندێک جار گۆشت دروست دەکرێت. زۆر جار لەگەڵ ماست پێشکەش دەکرێت و بەتایبەتی لە بۆنە خۆشەکاندا بەناوبانگە.'
      }
    }
  ];

  // Reset ingredients when recipe changes
  useEffect(() => {
    resetIngredients();
  }, [currentRecipe]);

  // Toggle between English and Kurdish Sorani
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ku' : 'en');
  };

  // Get translation text
  const t = (key) => translations[language][key] || key;

  // Reset ingredient selection
  const resetIngredients = useCallback(() => {
    setSelectedIngredients([]);
    setIsCorrect(false);
    setFeedback('');
    
    // Combine correct and extra ingredients and shuffle
    const allIngredients = [
      ...recipes[currentRecipe].ingredients,
      ...recipes[currentRecipe].extraIngredients
    ].sort(() => Math.random() - 0.5);
    
    setAvailableIngredients(allIngredients);
  }, [currentRecipe, recipes]);

  // Handle ingredient selection/deselection
  const handleIngredientSelect = useCallback((ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(item => item !== ingredient) 
        : [...prev, ingredient]
    );
  }, []);

  // Check if recipe ingredients are correct
  const checkRecipe = useCallback(() => {
    const currentRecipeIngredients = new Set(recipes[currentRecipe].ingredients);
    const selectedIngredientsSet = new Set(selectedIngredients);
    
    // Check if all required ingredients are selected (and only them)
    const isSelectionCorrect = 
      selectedIngredients.length === currentRecipeIngredients.size && 
      selectedIngredients.every(ingredient => currentRecipeIngredients.has(ingredient));
    
    if (isSelectionCorrect) {
      setFeedback(t('excellent'));
      setScore(prev => prev + 50);
      setIsCorrect(true);
    } else {
      const missingIngredients = [...currentRecipeIngredients].filter(
        ingredient => !selectedIngredientsSet.has(ingredient)
      );
      
      const extraIngredients = selectedIngredients.filter(
        ingredient => !currentRecipeIngredients.has(ingredient)
      );
      
      if (missingIngredients.length > 0) {
        setFeedback(`${t('missing')} ${missingIngredients.join(', ')}`);
      } else {
        setFeedback(`${t('extra')} ${extraIngredients.join(', ')}`);
      }
      
      setScore(prev => Math.max(0, prev - 10));
      setIsCorrect(false);
    }
  }, [currentRecipe, recipes, selectedIngredients, t]);

  // Move to next recipe
  const nextRecipe = useCallback(() => {
    if (currentRecipe < recipes.length - 1) {
      setCurrentRecipe(prev => prev + 1);
    } else {
      setCurrentRecipe(0);
    }
  }, [currentRecipe, recipes.length]);

  // Calculate progress
  const progress = ((currentRecipe) / recipes.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Header with Floating Navigation */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-rose-600 text-3xl mr-2">🏔️</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                {t('title')}
              </h1>
              <p className="text-xs text-slate-500" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                {t('subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-all"
            >
              {language === 'en' ? 'کوردی' : 'English'}
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-600">
              <span className="text-sm font-medium" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                {t('recipe')} {currentRecipe + 1}/{recipes.length}
              </span>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gradient-to-r from-rose-600 to-amber-600 text-white font-medium rounded-full px-4 py-1">
              <span className="text-xs mr-1" dir={language === 'ku' ? 'rtl' : 'ltr'}>{t('score')}:</span> 
              <span className="text-lg">{score}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6 md:hidden flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-sm font-medium" dir={language === 'ku' ? 'rtl' : 'ltr'}>
              {t('recipe')} {currentRecipe + 1}/{recipes.length}
            </span>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recipe Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          {/* Recipe Header */}
          <div className="relative bg-gradient-to-r from-rose-50 to-amber-50 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-sm border border-slate-100">
                {recipes[currentRecipe].emoji}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-1" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                  {recipes[currentRecipe].name[language]}
                </h2>
                <p className="text-slate-600" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                  {recipes[currentRecipe].description[language]}
                </p>
                <p className="text-xs text-slate-500 mt-2" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                  {recipes[currentRecipe].details[language]}
                </p>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-6">
            {/* Instructions */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-slate-100">
              <h3 className="text-lg font-medium text-slate-800 mb-2 flex items-center" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                <span className={`text-rose-600 ${language === 'ku' ? 'ml-2' : 'mr-2'}`}>📝</span>
                {t('cookingInstructions')}:
              </h3>
              <p className="text-slate-700" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                {t('selectIngredients')} {recipes[currentRecipe].name[language]}.
              </p>
              <p className="text-sm text-slate-500 mt-2" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                {t('chooseCarefully')}
              </p>
            </div>
            
            {/* Selected Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                <span className={`text-rose-600 ${language === 'ku' ? 'ml-2' : 'mr-2'}`}>🧺</span>
                {t('selectedIngredients')}:
              </h3>
              <div className={`min-h-20 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-2 ${language === 'ku' ? 'justify-end' : 'justify-start'}`}>
                {selectedIngredients.length > 0 ? (
                  selectedIngredients.map((ingredient, idx) => (
                    <span 
                      key={idx} 
                      className="inline-block bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all duration-200 shadow-sm"
                      onClick={() => handleIngredientSelect(ingredient)}
                      dir={language === 'ku' ? 'rtl' : 'ltr'}
                    >
                      {ingredient} <span className="text-rose-500 mx-1">×</span>
                    </span>
                  ))
                ) : (
                  <p className="w-full text-center text-slate-400 italic py-2" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                    {t('noIngredientsSelected')}
                  </p>
                )}
              </div>
            </div>
            
            {/* Available Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                <span className={`text-rose-600 ${language === 'ku' ? 'ml-2' : 'mr-2'}`}>🥕</span>
                {t('availableIngredients')}:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableIngredients.map((ingredient, idx) => (
                  <button
                    key={idx}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                    onClick={() => handleIngredientSelect(ingredient)}
                    dir={language === 'ku' ? 'rtl' : 'ltr'}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-xl mb-6 transition-all duration-300 ${
                isCorrect 
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                  : 'bg-rose-50 border border-rose-100 text-rose-700'
              }`}>
                <div className="flex items-center" dir={language === 'ku' ? 'rtl' : 'ltr'}>
                  <span className={`text-xl ${language === 'ku' ? 'ml-2' : 'mr-2'}`}>
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  {feedback}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <button 
                onClick={resetIngredients}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center"
                dir={language === 'ku' ? 'rtl' : 'ltr'}
              >
                <span className={language === 'ku' ? 'ml-1' : 'mr-1'}>↺</span> {t('reset')}
              </button>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={checkRecipe}
                  disabled={selectedIngredients.length === 0 || isCorrect}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    isCorrect || selectedIngredients.length === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm'
                  }`}
                  dir={language === 'ku' ? 'rtl' : 'ltr'}
                >
                  <span className={language === 'ku' ? 'ml-1' : 'mr-1'}>✓</span> {t('checkIngredients')}
                </button>
                
                <button 
                  onClick={nextRecipe}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-lg transition-colors shadow-sm flex items-center"
                  dir={language === 'ku' ? 'rtl' : 'ltr'}
                >
                  {language === 'ku' ? (
                    <>{t('nextRecipe')} <span className="mr-1">←</span></>
                  ) : (
                    <>{t('nextRecipe')} <span className="ml-1">→</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional information panel */}
        {isCorrect && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2" dir={language === 'ku' ? 'rtl' : 'ltr'}>
              {recipes[currentRecipe].name[language]}
            </h3>
            <p className="text-slate-600 mb-3" dir={language === 'ku' ? 'rtl' : 'ltr'}>
              {recipes[currentRecipe].details[language]}
            </p>
            <div className="flex justify-end">
              <button
                className="text-sm text-amber-600 hover:text-amber-700"
                dir={language === 'ku' ? 'rtl' : 'ltr'}
              >
                {t('learnMore')} {language === 'en' ? '→' : '←'}
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2" dir={language === 'ku' ? 'rtl' : 'ltr'}>
              <span className="text-2xl">🏔️</span>
              <p className="text-sm md:text-base">{t('title')}: {t('explore')}</p>
            </div>
            <div className="flex gap-6" dir={language === 'ku' ? 'rtl' : 'ltr'}>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">{t('about')}</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">{t('moreRecipes')}</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">{t('contact')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecipeAssembly;