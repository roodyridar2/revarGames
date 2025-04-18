import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  HelpCircle,
} from "lucide-react"; // Using lucide-react for icons

// --- Game Data (Sorani Kurdish) ---
const allQuestions = [
  {
    id: 1,
    question: "پایتەختی هەرێمی کوردستان چیە؟",
    options: ["هەولێر", "سلێمانی", "دهۆک", "کەرکوک"],
    correctAnswer: "هەولێر",
  },
  {
    id: 2,
    question: "کام شاعیر ناسراوە بە 'پیرەمێرد'؟",
    options: ["نالی", "مەحوی", "تۆفیق وەهبی", "حاجی قادری کۆیی"],
    correctAnswer: "تۆفیق وەهبی",
  },
  {
    id: 3,
    question: "گەورەترین دەریاچە لە کوردستان کامەیە؟",
    options: ["دوکان", "دەربەندیخان", "وان", "ورمێ"],
    correctAnswer: "وان",
  }, // Lake Van

  {
    id: 5,
    question: "کام شار بە 'شاری ڕۆشنبیری' ناسراوە لە باشووری کوردستان؟",
    options: ["هەولێر", "سلێمانی", "دهۆک", "هەڵەبجە"],
    correctAnswer: "سلێمانی",
  }, // Sulaimani as "City of Culture"
  {
    id: 6,
    question: "چیا بەرزترین لووتکەی کوردستان چیە؟",
    options: ["هەڵگورد", "پیرەمەگروون", "قەندیل", "هەورامان"],
    correctAnswer: "هەڵگورد",
  }, // Mt. Halgurd (often cited as highest peak fully within KRG) - Note: Ararat/Aragats sometimes considered part of greater Kurdistan geography.
  {
    id: 7,
    question: "کام ڕووبار بە نێو شاری بەغدادا تێدەپەڕێت؟",
    options: ["دیجلە", "فورات", "زێی بچووک", "سیراون"],
    correctAnswer: "دیجلە",
  }, // Tigris River
  {
    id: 8,
    question: "'مەم و زین' بەرهەمی کام نووسەری کلاسیکی کوردە؟",
    options: ["ئەحمەدی خانی", "نالی", "مەلای جزیری", "فەقێی تەیرا"],
    correctAnswer: "ئەحمەدی خانی",
  }, // Ehmede Xani
  {
    id: 9,
    question: "کۆماری کوردستان لە مهاباد چ ساڵێک دامەزرا؟",
    options: ["١٩٤٦", "١٩٢٠", "١٩٧٩", "١٩٩١"],
    correctAnswer: "١٩٤٦",
  }, // Republic of Kurdistan (Mahabad)
  {
    id: 10,
    question: "کام زانکۆ کۆنترین زانکۆی هەرێمی کوردستانە؟",
    options: [
      "زانکۆی سلێمانی",
      "زانکۆی سەلاحەدین",
      "زانکۆی دهۆک",
      "زانکۆی هەولێری پزیشکی",
    ],
    correctAnswer: "زانکۆی سلێمانی",
  }, // University of Sulaimani

  {
    id: 11,
    question: "سەرۆکی کۆماری کوردستان لە مهاباد کێ بوو؟",
    options: [
      "قازی محەممەد",
      "مەلا مستەفا بارزانی",
      "شێخ سەعیدی پیران",
      "سمکۆی شکاک",
    ],
    correctAnswer: "قازی محەممەد",
  }, // Qazi Muhammad
  {
    id: 12,
    question: "جەژنی سەرەکی نەتەوەیی کورد کامەیە؟",
    options: ["ڕەمەزان", "قوربان", "نەورۆز", "سەری ساڵی زایینی"],
    correctAnswer: "نەورۆز",
  }, // Newroz
  {
    id: 13,
    question: "دامەزرێنەری پارتی دیموکراتی کوردستان کێ بوو؟",
    options: [
      "مەلا مستەفا بارزانی",
      "جەلال تاڵەبانی",
      "نەوشیروان مستەفا",
      "مەسعود بارزانی",
    ],
    correctAnswer: "مەلا مستەفا بارزانی",
  }, // Mullah Mustafa Barzani (KDP Founder)
  {
    id: 14,
    question: "گەورەترین شاری باکووری کوردستان (تورکیا) کامەیە؟",
    options: ["ئامەد (دیاربەکر)", "وان", "ماردین", "ئورفا"],
    correctAnswer: "ئامەد (دیاربەکر)",
  }, // Amed (Diyarbakir)
  {
    id: 15,
    question: "شاعیری گەورەی نوێخوازی کورد 'گۆران' ناوی چی بوو؟",
    options: [
      "عەبدوڵڵا سلێمان",
      "ئیبراهیم ئەحمەد",
      "شێرکۆ بێکەس",
      "لەتیف هەڵمەت",
    ],
    correctAnswer: "عەبدوڵڵا سلێمان",
  }, // Goran (Abdulla Suleiman)
  {
    id: 16,
    question:
      "کام پەیماننامە بەشێکی گەورەی کوردستانی دابەشکرد دوای جەنگی جیهانی یەکەم؟",
    options: ["لۆزان", "سیڤەر", "سایکس-پیکۆ", "ڤێرسای"],
    correctAnswer: "لۆزان",
  }, // Treaty of Lausanne (formalized borders dividing Kurdistan)
  {
    id: 17,
    question: "پیرۆزترین پەرستگای ئێزیدییەکان لە کوێیە؟",
    options: ["لالش", "شنگال", "دهۆک", "شێخان"],
    correctAnswer: "لالش",
  }, // Lalish Temple
  {
    id: 18,
    question: "کام شۆڕشگێڕی کورد سەرکردایەتی شۆڕشی شێخ سەعیدی کرد؟",
    options: [
      "شێخ سەعیدی پیران",
      "سەید ڕەزا",
      "ئیحسان نووری پاشا",
      "قازی محەممەد",
    ],
    correctAnswer: "شێخ سەعیدی پیران",
  }, // Sheikh Said Piran
  {
    id: 19,
    question: "کام ڕووبار سنووری نێوان ڕۆژاوا و باکووری کوردستان پێکدەهێنێت؟",
    options: ["دیجلە", "فورات", "خابوور", "زێی گەورە"],
    correctAnswer: "دیجلە",
  }, // Tigris (forms part of the border)
  {
    id: 20,
    question: "جلوبەرگی نەتەوەیی پیاوانی کورد پێی دەوترێت چی؟",
    options: ["ڕانک و چۆغە", "کراس و فەقیانە", "شەرواڵ و کورتەک", "هەموویان"],
    correctAnswer: "هەموویان",
  }, // All are parts of Kurdish men's traditional clothing
  {
    id: 21,
    question: "گەورەترین شاری ڕۆژهەڵاتی کوردستان (ئێران) کامەیە؟",
    options: ["کرماشان", "سنە", "ورمێ", "مهاباد"],
    correctAnswer: "کرماشان",
  }, // Kermanshah
  {
    id: 22,
    question:
      "کام شاعیر بە 'شاعیری نیشتمانپەروەر' ناسراوە و خاوەنی 'دیوانی نالی'یە؟",
    options: ["نالی", "مەحوی", "حەمدی", "سالم"],
    correctAnswer: "نالی",
  }, // Nali
  {
    id: 23,
    question: "شۆڕشی ئەیلول لە چ ساڵێکدا دەستیپێکرد؟",
    options: ["١٩٦١", "١٩٧٥", "١٩٤٦", "١٩٨٠"],
    correctAnswer: "١٩٦١",
  }, // September Revolution (Aylul)
  {
    id: 24,
    question: "کام ئامێری مۆسیقای کوردی باوە لە هەڵپەڕکێدا؟",
    options: ["دەهۆڵ و زوڕنا", "تەموور", "کەمانچە", "بلوێر"],
    correctAnswer: "دەهۆڵ و زوڕنا",
  }, // Dohol and Zurna (common for Halparke dance)
  {
    id: 25,
    question: "هێرشی کیمیایی بۆ سەر هەڵەبجە لە چ ساڵێکدا ڕوویدا؟",
    options: ["١٩٨٨", "١٩٨٣", "١٩٩١", "١٩٨٠"],
    correctAnswer: "١٩٨٨",
  }, // Halabja chemical attack
  {
    id: 26,
    question: "کام زاراوەی کوردی بە ئەلفوبێی لاتینی (هاوار) دەنووسرێت؟",
    options: ["کرمانجی", "سۆرانی", "هەورامی", "زازاکی"],
    correctAnswer: "کرمانجی",
  }, // Kurmanji (uses Latin script)
  {
    id: 27,
    question: "کێ یەکەم سەرۆکی هەرێمی کوردستان بوو؟",
    options: [
      "مەسعود بارزانی",
      "جەلال تاڵەبانی",
      "نێچیرڤان بارزانی",
      "کۆسرەت ڕەسول",
    ],
    correctAnswer: "مەسعود بارزانی",
  }, // Masoud Barzani (first *President* of KRG, post-2005 constitution)
  {
    id: 28,
    question: "شاری سلێمانی لەلایەن کێوە بنیاتنرا؟",
    options: [
      "ئیبراهیم پاشای بابان",
      "مەحمود پاشای بابان",
      "سلێمان پاشای بابان",
      "ئەحمەد پاشای بابان",
    ],
    correctAnswer: "ئیبراهیم پاشای بابان",
  }, // Ibrahim Pasha Baban
  {
    id: 29,
    question: "زنجیرە چیای سەرەکی کە بە کوردستاندا تێدەپەڕێت چیە؟",
    options: ["زاگرۆس", "ئەلبروز", "هیمالایا", "ئەڵپ"],
    correctAnswer: "زاگرۆس",
  }, // Zagros Mountains
// Jalal Talabani (Mam Jalal)
  {
    id: 31,
    question: "'شەرەفنامە' کە مێژووی کورد دەگێڕێتەوە، لەلایەن کێ نووسراوە؟",
    options: [
      "شەرەفخانی بەدلیسی",
      "ئەحمەدی خانی",
      "مەلای جزیری",
      "عەلی حەریری",
    ],
    correctAnswer: "شەرەفخانی بەدلیسی",
  }, // Sharafkhan Bidlisi
  {
    id: 32,
    question: "کام شار ناوەندی پارێزگای دهۆکە؟",
    options: ["دهۆک", "زاخۆ", "ئامێدی", "ئاکرێ"],
    correctAnswer: "دهۆک",
  }, // Duhok city
  {
    id: 33,
    question: "یەکەم ڕۆژنامەی کوردی بە ناوی 'کوردستان' لە کوێ دەرچوو؟",
    options: ["قاهیرە", "ئەستەنبوڵ", "تبلیس", "بەغداد"],
    correctAnswer: "قاهیرە",
  }, // Cairo (Kurdistan newspaper)
  {
    id: 34,
    question: "کام شاعیری کلاسیکی کورد بە 'مەحوی' ناسراوە؟",
    options: [
      "مەلا محەمەد کوڕی مەلا عوسمانی باڵخی",
      "مەلا خضری ئەحمەدی شاهۆیی",
      "عەبدولڕەحمان بەگی بابان",
      "تاهیر بەگی جاف",
    ],
    correctAnswer: "مەلا محەمەد کوڕی مەلا عوسمانی باڵخی",
  }, // Mahwi's full name

  {
    id: 36,
    question: "کام یەک لەمانە زاراوەیەکی سەرەکی زمانی کوردی نییە؟",
    options: ["لوڕی", "کرمانجی", "سۆرانی", "زازاکی"],
    correctAnswer: "لوڕی",
  }, // Luri is related but often considered a separate language group.
  {
    id: 37,
    question: "کێ سەرکردایەتی شۆڕشی سمکۆی شکاکی کرد؟",
    options: [
      "سمکۆی شکاک",
      "قازی محەممەد",
      "شێخ مەحموودی حەفید",
      "ئیحسان نووری پاشا",
    ],
    correctAnswer: "سمکۆی شکاک",
  }, // Simko Shikak
  {
    id: 38,
    question: "قەڵای هەولێر لە لیستی کەلەپووری جیهانی کام ڕێکخراودایە؟",
    options: [
      "یونسکۆ",
      "نەتەوە یەکگرتووەکان",
      "یەکێتی ئەوروپا",
      "کۆمکاری عەرەبی",
    ],
    correctAnswer: "یونسکۆ",
  }, // UNESCO World Heritage Site
  {
    id: 39,
    question:
      "کام فیلمساز و ئەکتەری کورد خەڵاتی 'پاڵمە دۆر'ی لە فێستیڤاڵی کان بردەوە؟",
    options: [
      "یەڵماز گونەی",
      "بەهمەن قوبادی",
      "هونەر سەلیم",
      "شەوکەت ئەمین کورکی",
    ],
    correctAnswer: "یەڵماز گونەی",
  }, // Yılmaz Güney (for Yol)

  {
    id: 41,
    question: "'هەژار' نازناوی کام نووسەر و وەرگێڕی کورد بوو؟",
    options: [
      "عەبدولڕەحمان شەرەفکەندی",
      "محەمەد قازی",
      "ئیبراهیم ئەحمەد",
      "پیرەمێرد",
    ],
    correctAnswer: "عەبدولڕەحمان شەرەفکەندی",
  }, // Hejar (Abdurrahman Sharafkandi)

  {
    id: 43,
    question: "شاڵاوی ئەنفال لەلایەن ڕژێمی بەعسەوە لە چ ساڵانێکدا ئەنجامدرا؟",
    options: ["١٩٨٦-١٩٨٩", "١٩٨٠-١٩٨٨", "١٩٩٠-١٩٩١", "١٩٧٥-١٩٧٩"],
    correctAnswer: "١٩٨٦-١٩٨٩",
  }, // Anfal Campaign years (primarily 1988)

  {
    id: 45,
    question: "یەکەمین حکومەتی کوردی لە باشووری کوردستان لەلایەن کێوە دامەزرا؟",
    options: [
      "شێخ مەحموودی حەفید",
      "مەلا مستەفا بارزانی",
      "قازی محەممەد",
      "سمکۆی شکاک",
    ],
    correctAnswer: "شێخ مەحموودی حەفید",
  }, // Sheikh Mahmud Barzanji (Kingdom of Kurdistan)

  {
    id: 47,
    question: "گەورەترین ئایین لە نێو کورددا کامەیە؟",
    options: ["ئیسلام (سوننە)", "ئێزیدی", "یارسان (کاکەیی)", "شیعە"],
    correctAnswer: "ئیسلام (سوننە)",
  }, // Islam (Sunni) is the majority religion

  {
    id: 49,
    question:
      "کام چیای ستراتیجی ناوچەی سنووری نێوان باشوور و ڕۆژهەڵات و باکوورە؟",
    options: ["قەندیل", "هەڵگورد", "پیرەمەگروون", "سەفین"],
    correctAnswer: "قەندیل",
  }, // Mount Qandil

  {
    id: 51,
    question: "ناوی کۆنی شاری هەولێر چی بووە؟",
    options: ["ئەربائیلۆ/ئەربێلا", "کەرکوک", "نەینەوا", "ئاشور"],
    correctAnswer: "ئەربائیلۆ/ئەربێلا",
  }, // Arbela / Arbailu
  {
    id: 52,
    question: "کام ناوچەی کوردستان بە کشتوکاڵی گەنم بەناوبانگە؟",
    options: ["دەشتی هەولێر", "دەشتی شارەزوور", "دەشتی گەرمیان", "هەموویان"],
    correctAnswer: "هەموویان",
  }, // All are significant agricultural plains
  {
    id: 53,
    question: "سەما و هەڵپەڕکێی کوردی بە گشتی پێی دەوترێت چی؟",
    options: ["هەڵپەڕکێ", "دیبکە", "چۆپی", "گۆڤەند"],
    correctAnswer: "هەڵپەڕکێ",
  }, // Halparke (Govend also used, especially in North)
  {
    id: 54,
    question: "کام سەرکردەی کورد سەرکردایەتی شۆڕشی دەرسیمی کرد؟",
    options: ["سەید ڕەزا", "شێخ سەعید", "ئیحسان نووری پاشا", "قازی محەممەد"],
    correctAnswer: "سەید ڕەزا",
  }, // Seyid Riza (Dersim Rebellion)
  {
    id: 55,
    question: "پەیماننامەی سایکس-پیکۆ لە چ ساڵێکدا بوو؟",
    options: ["١٩١٦", "١٩٢٠", "١٩٢٣", "١٩١٤"],
    correctAnswer: "١٩١٦",
  }, // Sykes-Picot Agreement
  {
    id: 56,
    question: "کام نووسەر و ڕۆماننووسی کورد خاوەنی ڕۆمانی 'شار'ە؟",
    options: ["حسێن عارف", "بەختیار عەلی", "شێرزاد حەسەن", "عەتا نەهایی"],
    correctAnswer: "حسێن عارف",
  }, // Hussein Arif (Shar novel)
  {
    id: 57,
    question: "کام شارۆچکە بە 'پایتەختی میرنشینی سۆران' ناسراوە؟",
    options: ["ڕەواندز", "هەریر", "شەقڵاوە", "کۆیە"],
    correctAnswer: "ڕەواندز",
  }, // Rawandiz (capital of Soran Emirate)
  {
    id: 58,
    question: "کام ئاین زیاتر لە ناوچەی هەورامان و کرماشان باوە؟",
    options: ["یارسان (کاکەیی)", "ئێزیدی", "مەسیحی", "جوو"],
    correctAnswer: "یارسان (کاکەیی)",
  }, // Yarsanism (Ahl-e Haqq / Kaka'i)
  {
    id: 59,
    question: "زمانی کوردی سەر بە کام خێزانی زمانەوانییە؟",
    options: ["هیندوئەوروپی (لقى ئێرانی)", "سامی", "ئۆراڵی", "تورکی"],
    correctAnswer: "هیندوئەوروپی (لقى ئێرانی)",
  }, // Indo-European (Iranian branch)
  {
    id: 60,
    question: "کام شاعیر ناسراوە بە 'مەلای جزیری'؟",
    options: ["شێخ ئەحمەد جزیری", "ئەحمەدی خانی", "فەقێی تەیرا", "عەلی حەریری"],
    correctAnswer: "شێخ ئەحمەد جزیری",
  }, // Melayê Cizîrî
  {
    id: 61,
    question: "شاری 'کۆبانی' دەکەوێتە کام پارچەی کوردستان؟",
    options: ["ڕۆژاوا", "باکوور", "باشوور", "ڕۆژهەڵات"],
    correctAnswer: "ڕۆژاوا",
  }, // Kobani (in Rojava / Northern Syria)
  {
    id: 62,
    question: "بەرزی قەڵای هەولێر لە ئاستی دەوروبەری چەندە؟",
    options: [
      "نزیکەی ٢٥-٣٢ مەتر",
      "نزیکەی ١٠ مەتر",
      "نزیکەی ٥٠ مەتر",
      "نزیکەی ١٠٠ مەتر",
    ],
    correctAnswer: "نزیکەی ٢٥-٣٢ مەتر",
  }, // Erbil Citadel height

  {
    id: 64,
    question:
      "کام یەک لە خواردنە کوردییەکان بریتییە لە گەڵای مێو یان سەلق پێچراو؟",
    options: ["دۆڵمە/یاپراخ", "کفتە", "قەیسی", "بریانی"],
    correctAnswer: "دۆڵمە/یاپراخ",
  }, // Dolma / Yaprakh
  {
    id: 65,
    question:
      "کام کەسایەتیی ئایینی و نیشتمانی کورد سەرکردایەتیی 'کۆمەڵەی ژیانەوەی کوردستان' (ژێ کاف)ی کرد؟",
    options: ["قازی محەممەد", "مەلا مستەفا بارزانی", "شێخ مەحموود", "پیرەمێرد"],
    correctAnswer: "قازی محەممەد",
  }, // Qazi Muhammad (leader of Komala J.K. before founding KDP-I)
  {
    id: 66,
    question: "کام زانکۆ لە شاری دهۆک هەڵکەوتووە؟",
    options: ["زانکۆی دهۆک", "زانکۆی نەورۆز", "زانکۆی زاخۆ", "هەموویان"],
    correctAnswer: "هەموویان",
  }, // University of Duhok, Nawroz University, University of Zakho are all in Duhok Governorate region.
  {
    id: 67,
    question: "ڕووباری 'سیراون' لە کوێوە سەرچاوە دەگرێت و دەڕژێتە کوێ؟",
    options: [
      "ڕۆژهەڵاتی کوردستان (ئێران) / ڕووباری دیجلە",
      "باکووری کوردستان (تورکیا) / دەریای ڕەش",
      "باشووری کوردستان / زێی بچووک",
      "چیای قەرەداغ / دەریاچەی دوکان",
    ],
    correctAnswer: "ڕۆژهەڵاتی کوردستان (ئێران) / ڕووباری دیجلە",
  }, // Sirwan River (becomes Diyala in Iraq, flows into Tigris)

  {
    id: 69,
    question: "میرنشینی بابان لە کام ناوچەی کوردستان بوو؟",
    options: ["سلێمانی و شارەزوور", "هەولێر و سۆران", "بادینان", "موکریان"],
    correctAnswer: "سلێمانی و شارەزوور",
  }, // Baban Emirate
  {
    id: 70,
    question: "کام شار بە 'شاری قەڵا و منارە' ناسراوە؟",
    options: ["هەولێر", "کەرکوک", "ئامەد", "ماردین"],
    correctAnswer: "هەولێر",
  }, // Erbil (known for its Citadel and Minaret)
  {
    id: 71,
    question:
      "ناوی فەرماندەی 'هێزی پێشمەرگەی کوردستان' لە کۆماری مهاباد کێ بوو؟",
    options: [
      "مەلا مستەفا بارزانی",
      "قازی محەممەد",
      "عیزەت عەبدولعەزیز",
      "محەمەد حوسێن سەیفی قازی",
    ],
    correctAnswer: "مەلا مستەفا بارزانی",
  }, // Mullah Mustafa Barzani (was commander of the Peshmerga force)
  {
    id: 72,
    question:
      "کام شێوەزاری کوردی زیاتر لە ناوچەکانی کرماشان و ئیلام قسەی پێدەکرێت؟",
    options: [
      "کوردیی باشووری (کەڵهوڕی، فەیلی، لەکی)",
      "سۆرانی",
      "هەورامی",
      "کرمانجی",
    ],
    correctAnswer: "کوردیی باشووری (کەڵهوڕی، فەیلی، لەکی)",
  }, // Southern Kurdish dialects
  {
    id: 73,
    question: "شاری 'زاخۆ' دەکەوێتە سەر کام ڕووبار؟",
    options: ["خابوور", "دیجلە", "زێی گەورە", "هیزل"],
    correctAnswer: "خابوور",
  }, // Khabur River (flows through Zakho)
  {
    id: 74,
    question:
      "کام نووسەر و فەیلەسوفی کورد بەرهەمی 'دواهەمین هەناری دونیا'ی نووسیوە؟",
    options: [
      "بەختیار عەلی",
      "شێرزاد حەسەن",
      "فەرهاد پیرباڵ",
      "مەریوان وریا قانع",
    ],
    correctAnswer: "بەختیار عەلی",
  }, // Bakhtyar Ali (The World's Last Pomegranate)
  {
    id: 75,
    question: "کامە لەم شارانە پایتەختی میرنشینی ئەردەڵان بووە؟",
    options: ["سنە", "کرماشان", "مەریوان", "سەقز"],
    correctAnswer: "سنە",
  }, // Sanandaj (Sena) was the capital of the Ardalan Emirate
  {
    id: 76,
    question:
      "کام ئاژەڵ وەک سیمبولێکی بەرگری و خۆڕاگری لە چیاکانی کوردستان سەیر دەکرێت؟",
    options: ["گورگ", "پڵنگ", "هەڵۆ", "کەو"],
    correctAnswer: "هەڵۆ",
  }, // Eagle (often seen as a symbol)
  {
    id: 77,
    question:
      "شەڕی چاڵدێران لە نێوان کێ و کێدا بوو و کاریگەری لەسەر کوردستان هەبوو؟",
    options: [
      "عوسمانی و سەفەوی",
      "عوسمانی و مەملوک",
      "سەفەوی و ئاق قۆیونلو",
      "عوسمانی و بیزەنتی",
    ],
    correctAnswer: "عوسمانی و سەفەوی",
  }, // Battle of Chaldiran (Ottoman vs Safavid, impacted Kurdish areas)
  {
    id: 78,
    question: "کام شێوەزاری کوردی لەلایەن ئێزدییەکانەوە بە زۆری قسەی پێدەکرێت؟",
    options: ["کرمانجی", "سۆرانی", "هەورامی", "زازاکی"],
    correctAnswer: "کرمانجی",
  }, // Kurmanji (spoken by most Yezidis)
  {
    id: 79,
    question: "کام کەسایەتی مێژوویی کورد بە 'سەلاحەدینی ئەیوبی' ناسراوە؟",
    options: [
      "سەڵاحەدین یوسف کوڕی ئەیوب",
      "نورەدین زەنگی",
      "عیمادەدین زەنگی",
      "ئەسەدەدین شێرکۆ",
    ],
    correctAnswer: "سەڵاحەدین یوسف کوڕی ئەیوب",
  }, // Saladin (Salah ad-Din Yusuf ibn Ayyub)
  {
    id: 80,
    question: "کام ناوچەی باشووری کوردستان بە بوونی تاڤگەی بەناوبانگ ناسراوە؟",
    options: [
      "ڕەواندز (بێخاڵ، گەلی عەلی بەگ)",
      "ئامێدی (سیپە)",
      "پێنجوێن",
      "هەڵەبجە (ئەحمەدئاوا)",
    ],
    correctAnswer: "ڕەواندز (بێخاڵ، گەلی عەلی بەگ)",
  }, // Rawandiz area (Bekhal, Gali Ali Beg waterfalls)
  {
    id: 81,
    question: "کتێبی 'مێژووی ئەردەڵان' لەلایەن کێ نووسراوە؟",
    options: [
      "میرزا عەلی ئەکبەر کوردستانی",
      "شەرەفخانی بەدلیسی",
      "مەستوورە ئەردەڵان",
      "ئایەتوڵڵا مەردۆخ",
    ],
    correctAnswer: "مەستوورە ئەردەڵان",
  }, // Mastura Ardalan (wrote history, also a poet)

  {
    id: 83,
    question: "شاری 'وان' دەکەوێتە کەناری کام دەریاچە؟",
    options: [
      "دەریاچەی وان",
      "دەریاچەی ورمێ",
      "دەریاچەی دوکان",
      "دەریاچەی حەمرین",
    ],
    correctAnswer: "دەریاچەی وان",
  }, // Van city on Lake Van
  {
    id: 84,
    question: "کام زانا و نووسەری کورد بە 'ئیبن خەلەکان' ناسراوە؟",
    options: ["شەمسەددین ئەحمەد", "فەخرەدین ڕازی", "ئەبولفیدا", "ئیبن ئەسیر"],
    correctAnswer: "شەمسەددین ئەحمەد",
  }, // Ibn Khallikan (Shams ad-Din Ahmad)
  {
    id: 85,
    question:
      "ئەشکەوتی 'شانەدەر' کە پاشماوەی مرۆڤی نیاندەرتاڵی تێدا دۆزراوەتەوە، دەکەوێتە کوێ؟",
    options: [
      "چیای برادۆست (هەرێمی کوردستان)",
      "چیای قەرەداغ",
      "چیای هەورامان",
      "نزیک شاری مهاباد",
    ],
    correctAnswer: "چیای برادۆست (هەرێمی کوردستان)",
  }, // Shanidar Cave location


  {
    id: 88,
    question: "کام شاعیر و نووسەری کورد ناسراوە بە 'فەقێی تەیرا'؟",
    options: ["محەمەد تەیرانی", "مەلای جزیری", "ئەحمەدی خانی", "عەلی حەریری"],
    correctAnswer: "محەمەد تەیرانی",
  }, // Feqiyê Teyran
  {
    id: 89,
    question: "ڕاپەڕینی گەلی کوردستان دژ بە ڕژێمی بەعس لە چ ساڵێکدا بوو؟",
    options: ["١٩٩١", "١٩٨٨", "٢٠٠٣", "١٩٧٩"],
    correctAnswer: "١٩٩١",
  }, // 1991 Uprising (Raperîn)
  {
    id: 90,
    question: "کامە لەم شارانە بە 'پایتەختی میرنشینی بادینان' ناسراوە؟",
    options: ["ئامێدی", "دهۆک", "زاخۆ", "ئاکرێ"],
    correctAnswer: "ئامێدی",
  }, // Amedi (capital of Bahdinan Emirate)
  {
    id: 91,
    question: "کام ڕەنگی ئاڵای کوردستان سیمبولی سروشت و ئاوەدانییە؟",
    options: ["سەوز", "سوور", "سپی", "زەرد"],
    correctAnswer: "سەوز",
  }, // Green color in Kurdish flag

  {
    id: 93,
    question: "دەریاچەی 'زرێبار' دەکەوێتە نزیک کام شاری ڕۆژهەڵاتی کوردستان؟",
    options: ["مەریوان", "سنە", "سەقز", "بانە"],
    correctAnswer: "مەریوان",
  }, // Lake Zrebar (near Mariwan)
  {
    id: 94,
    question: "کام شاعیری کلاسیکی کورد بە 'مەولەوی' ناسراوە؟",
    options: [
      "سەید عەبدولڕەحیمی تاوگۆزی",
      "مەلا عەبدولکەریمی مودەڕیس",
      "نالی",
      "مەحوی",
    ],
    correctAnswer: "سەید عەبدولڕەحیمی تاوگۆزی",
  }, // Mawlawi Tawagozi
  {
    id: 95,
    question: "کامە لەم چیایانە بەشێکە لە زنجیرەچیای هەورامان؟",
    options: ["شاھۆ", "قەندیل", "سەفین", "ئەزمەڕ"],
    correctAnswer: "شاھۆ",
  }, // Shaho mountain (part of Hawraman range)
  {
    id: 96,
    question:
      "کام نووسەر و شاعیری کورد یەکەمین ئەلفوبێی کوردی لاتینی (ئەلفبێی ھاوار)ی دانا؟",
    options: [
      "جەلادەت عالی بەدرخان",
      "قەناتی کوردۆ",
      "عەرەب شەمۆ",
      "تۆفیق وەهبی",
    ],
    correctAnswer: "جەلادەت عالی بەدرخان",
  }, // Celadet Bedirxan (Hawar alphabet)
  {
    id: 97,
    question: "کام شارە دەکەوێتە باشووریترین خاڵی هەرێمی کوردستان؟",
    options: ["کفری", "کەلار", "خانەقین", "چەمچەماڵ"],
    correctAnswer: "کفری",
  }, // Kifri (one of the southernmost towns in KRG controlled areas, though status debated)
  {
    id: 98,
    question: "خۆرەکەی ناوەڕاستی ئاڵای کوردستان چەند تیشکی هەیە؟",
    options: ["٢١", "١٨", "٢٤", "١٦"],
    correctAnswer: "٢١",
  }, // 21 rays on the sun emblem (symbolizing Newroz, March 21st)
  {
    id: 99,
    question: "کام ڕۆژنامە یان گۆڤار لەلایەن 'پیرەمێرد'ەوە دەردەچوو؟",
    options: ["ژیان/ژین", "بانگی کوردستان", "هاوار", "کوردستان"],
    correctAnswer: "ژیان/ژین",
  }, // Jiyan/Jin newspaper/magazine by Piremerd
  {
    id: 100,
    question: "کام میرنشینی کوردی لە ناوچەی موکریان حوکمی کردووە؟",
    options: [
      "میرنشینی موکریان (مهاباد)",
      "میرنشینی سۆران",
      "میرنشینی بابان",
      "میرنشینی ئەردەڵان",
    ],
    correctAnswer: "میرنشینی موکریان (مهاباد)",
  }, // Mukriyan Emirate
  // Add more questions here if needed
];

// --- Helper Function ---
function shuffleArray(array) {
  const newArray = [...array]; // Create a shallow copy to avoid mutating the original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const questionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
};

const feedbackVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

// --- React Component ---
function QAGameEnhanced() {
  const [gamePhase, setGamePhase] = useState("setup"); // 'setup', 'playing', 'finished'
  const [numQuestionsToPlay, setNumQuestionsToPlay] = useState(5);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Memoize the current question object
  const currentQuestion = useMemo(() => {
    return currentQuizQuestions[currentQuestionIndex];
  }, [currentQuizQuestions, currentQuestionIndex]);

  // *** ADDED: Memoize shuffled options for the current question ***
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return []; // Handle initial state or transitions
    // Shuffle a copy of the options array
    return shuffleArray([...currentQuestion.options]);
  }, [currentQuestion]); // Recalculate only when the currentQuestion changes

  const totalAvailableQuestions = allQuestions.length;
  const questionOptions = [5, 10, 20, totalAvailableQuestions]; // Options for number of questions

  // --- Game Logic Handlers ---
  const handleStartGame = (num) => {
    const numberOfQuestions = Math.min(num, totalAvailableQuestions);
    setNumQuestionsToPlay(numberOfQuestions);
    const shuffledQuestions = shuffleArray(allQuestions);
    setCurrentQuizQuestions(shuffledQuestions.slice(0, numberOfQuestions));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setGamePhase("playing");
  };

  const handleAnswerClick = (option) => {
    if (showFeedback) return;

    // Use currentQuestion (not dependent on shuffled order) to check correctness
    const correct = option === currentQuestion.correctAnswer;
    setSelectedAnswer(option);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(false);
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < currentQuizQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setGamePhase("finished");
      }
    }, 250);
  };

  const handleRestart = () => {
    setGamePhase("setup");
    setCurrentQuizQuestions([]);
  };

  // --- Styling Helper for Buttons ---
  const getButtonClass = (option) => {
    let baseClass = `
            w-full text-right font-semibold py-3 px-5 rounded-lg border
            transition-all duration-300 ease-in-out focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-transparent
            flex items-center justify-between group
        `;

    if (!showFeedback) {
      return `${baseClass} bg-white/60 hover:bg-white/90 border-slate-300 text-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`;
    }

    const isSelected = option === selectedAnswer;
    // Use currentQuestion here as well to find the correct answer
    const isTheCorrectAnswer = option === currentQuestion.correctAnswer;

    if (isSelected) {
      return isCorrect
        ? `${baseClass} bg-emerald-500/80 border-emerald-600 text-white shadow-lg ring-2 ring-emerald-300 scale-[1.01]`
        : `${baseClass} bg-red-500/80 border-red-600 text-white shadow-lg ring-2 ring-red-300 scale-[1.01]`;
    } else if (isTheCorrectAnswer) {
      // Highlight the correct answer if the selected one was wrong
      return `${baseClass} bg-emerald-100/70 border-emerald-300 text-emerald-900 cursor-not-allowed opacity-80`;
    } else {
      // Other non-selected, non-correct answers
      return `${baseClass} bg-slate-200/50 border-slate-300 text-slate-500 cursor-not-allowed opacity-60`;
    }
  };

  // --- Render Logic ---

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center p-4 font-['Noto Sans Arabic']"
    >
      <AnimatePresence mode="wait">
        {/* --- Setup Phase --- */}
        {gamePhase === "setup" && (
          <motion.div
            key="setup"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
          >
            <motion.div variants={itemVariants}>
              <HelpCircle
                className="w-16 h-16 mx-auto mb-5 text-indigo-500"
                strokeWidth={1.5}
              />
              <h2 className="text-3xl font-bold mb-6 text-slate-800">
                یاری پرسیار و وەڵام
              </h2>
              <p className="text-lg mb-8 text-slate-600">چەند پرسیارت دەوێت؟</p>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              {questionOptions.map(
                (num) =>
                  totalAvailableQuestions >=
                    (num === totalAvailableQuestions ? 1 : num) && (
                    <button
                      key={num}
                      onClick={() => handleStartGame(num)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent transform hover:scale-105 active:scale-95"
                    >
                      {num === totalAvailableQuestions
                        ? `هەمووی (${totalAvailableQuestions})`
                        : `${num} پرسیار`}
                    </button>
                  )
              )}
            </motion.div>
          </motion.div>
        )}

        {/* --- Playing Phase --- */}
        {gamePhase === "playing" &&
          currentQuestion && ( // Ensure currentQuestion exists
            <motion.div
              key="playing"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/75 backdrop-blur-lg p-6 md:p-10 rounded-2xl shadow-2xl max-w-2xl w-full text-right"
            >
              {/* Header Info & Progress Bar */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex justify-between items-center mb-3 text-sm font-medium text-slate-600">
                  <span>
                    پرسیاری {currentQuestionIndex + 1} / {numQuestionsToPlay}
                  </span>
                  <span className="font-semibold text-indigo-700">
                    خاڵ: {score}
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-2.5 rounded-full"
                    initial={{
                      width: `${
                        (currentQuestionIndex / numQuestionsToPlay) * 100
                      }%`,
                    }}
                    animate={{
                      width: `${
                        ((currentQuestionIndex + 1) / numQuestionsToPlay) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

              {/* Question Section */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  variants={questionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mb-6 min-h-[80px]"
                >
                  <h2 className="text-xl md:text-2xl font-bold my-4 text-slate-900 leading-relaxed text-left">
                    {currentQuestion.question}
                  </h2>
                </motion.div>
              </AnimatePresence>

              {/* *** UPDATED: Answer Options using shuffledOptions *** */}
              <motion.div
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                initial="hidden"
                animate="visible"
                className="space-y-3 mb-6"
              >
                {/* Map over the shuffled options */}
                {shuffledOptions.map((option) => (
                  <motion.button
                    // Use option string as key assuming options are unique within a question
                    key={option}
                    variants={itemVariants}
                    onClick={() => handleAnswerClick(option)}
                    disabled={showFeedback}
                    className={getButtonClass(option)} // Logic inside getButtonClass remains the same
                    whileHover={
                      !showFeedback
                        ? {
                            scale: 1.03,
                            transition: { type: "spring", stiffness: 300 },
                          }
                        : {}
                    }
                    whileTap={!showFeedback ? { scale: 0.97 } : {}}
                  >
                    <span>{option}</span>
                    {/* Feedback Icons - logic remains the same */}
                    {showFeedback &&
                      selectedAnswer === option &&
                      (isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      ))}
                    {/* Show correct checkmark on the actual correct answer if the wrong one was selected */}
                    {showFeedback &&
                      selectedAnswer !== option &&
                      option === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-700" />
                      )}
                  </motion.button>
                ))}
              </motion.div>

              {/* Feedback and Next Button */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    variants={feedbackVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-6 p-4 rounded-lg text-center border origin-top overflow-hidden"
                    style={
                      isCorrect
                        ? {
                            borderColor: "rgba(16, 185, 129, 0.4)",
                            backgroundColor: "rgba(209, 250, 229, 0.6)",
                          }
                        : {
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            backgroundColor: "rgba(254, 226, 226, 0.6)",
                          }
                    }
                  >
                    {isCorrect ? (
                      <p className="text-lg font-semibold text-emerald-700 mb-3 flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6 inline-block" />{" "}
                        وەڵامەکەت ڕاستە!
                      </p>
                    ) : (
                      <p className="text-lg font-semibold text-red-700 mb-3">
                        <XCircle className="w-6 h-6 inline-block mr-2" />{" "}
                        بەداخەوە هەڵەیە.
                        {/* Display the correct answer clearly */}
                        <span className="block text-base font-normal mt-1 text-slate-600">
                          وەڵامی ڕاست:{" "}
                          <span className="font-bold">
                            {currentQuestion.correctAnswer}
                          </span>
                        </span>
                      </p>
                    )}
                    <motion.button
                      onClick={handleNextQuestion}
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 active:scale-95"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                    >
                      {currentQuestionIndex === currentQuizQuestions.length - 1
                        ? "بینینی ئەنجام"
                        : "پرسیاری دواتر"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        {/* --- Finished Phase --- */}
        {gamePhase === "finished" && (
          <motion.div
            key="finished"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
          >
            <motion.div variants={itemVariants}>
              <CheckCircle
                className="w-16 h-16 mx-auto mb-4 text-emerald-500"
                strokeWidth={1.5}
              />
              <h2 className="text-3xl font-bold mb-4 text-slate-800">
                کۆتایی یاری!
              </h2>
              <p className="text-xl mb-8 text-slate-600">
                ئەنجامی کۆتایی:{" "}
                <span className="font-bold text-indigo-600 text-2xl">
                  {score}
                </span>{" "}
                / {numQuestionsToPlay}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                دووبارە یاری بکە
              </button>
              {/* Optional: Button to restart with same number of questions (commented out) */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QAGameEnhanced;
