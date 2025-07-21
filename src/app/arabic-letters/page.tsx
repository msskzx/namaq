"use client";

import { useLanguage } from "@/components/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FactCard from '@/components/FactCard';
import StatsCard from '@/components/StatsCard';
import { faChevronLeft, faChevronRight, faBookOpen, faArrowRightArrowLeft, faGlobe, faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { arabicLetters } from "./arabicLettersData";

export default function ArabicLetters() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextLetter = () => {
    setCurrentIndex((prev) => (prev + 1) % arabicLetters.length);
  };

  const prevLetter = () => {
    setCurrentIndex((prev) => (prev - 1 + arabicLetters.length) % arabicLetters.length);
  };

  const currentLetter = arabicLetters[currentIndex];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="font-arabicDisplay text-amber-400 text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 drop-shadow-lg tracking-wide">
            {language === 'ar' ? 'الحروف العربية' : 'Arabic Letters'}
          </h1>
          <p className="font-arabic text-gray-200 text-lg sm:text-2xl mb-4">
            {language === 'ar' 
              ? 'اللغة العربية لغة عريقة ضاربة في أعماق التاريخ، حملت عبر حروفها الثمانية والعشرين تراث أمة كاملة وعلومها وآدابها. صمدت العربية أمام تحديات الزمن، وانتشرت في بقاع الأرض، وبقيت لغة القرآن الكريم والعلوم والفكر. حروفها ليست مجرد رموز، بل مفاتيح لفهم حضارة عظيمة، وستظل العربية حية نابضة في قلوب الملايين لأجيال قادمة.'
              : 'The Arabic language is an ancient tongue with deep historical roots, carrying through its 28 letters the heritage, knowledge, and literature of an entire civilization. Arabic has withstood the tests of time, spreading across continents and remaining the language of the Holy Quran, science, and thought. Its letters are not just symbols, but keys to understanding a great civilization, and Arabic will continue to thrive in the hearts of millions for generations to come.'
            }
          </p>
        </header>

        {/* Trivia Section */}
        <div className="mb-8 mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex flex-row gap-6 mb-6 overflow-x-auto pb-2">
            <FactCard icon={faGlobe} text={language === 'ar' ? 'العربية من أقدم اللغات السامية وأكثرها انتشاراً.' : 'Arabic is one of the oldest and most widely spoken Semitic languages.'} dir={language === 'ar' ? 'rtl' : 'ltr'} />
            <FactCard icon={faArrowRightArrowLeft} text={language === 'ar' ? 'العربية تُكتب من اليمين إلى اليسار.' : 'Arabic is written from right to left.'} dir={language === 'ar' ? 'rtl' : 'ltr'} />
            <FactCard icon={faFeatherPointed} text={language === 'ar' ? 'الحروف العربية تتغير أشكالها حسب موقعها في الكلمة.' : 'Arabic letters change shape depending on their position in a word.'} dir={language === 'ar' ? 'rtl' : 'ltr'} />
          </div>
          {/* Statistics Cards with Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6">
            {/* Speakers Card */}
            <StatsCard
              icon={faGlobe}
              value={400}
              suffix="M+"
              label={language === 'ar' ? 'متحدثون' : 'Speakers'}
              desc={language === 'ar' ? 'أكثر من 400 مليون متحدث حول العالم.' : 'Over 400 million speakers worldwide.'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            {/* Words Card */}
            <StatsCard
              icon={faBookOpen}
              value={12}
              suffix="M+"
              label={language === 'ar' ? 'عدد الكلمات' : 'Words'}
              desc={language === 'ar' ? 'تحتوي العربية على أكثر من 12 مليون كلمة.' : 'Arabic has over 12 million words.'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            {/* Letters Card */}
            <StatsCard
              icon={faFeatherPointed}
              value={28}
              suffix={language === 'ar' ? '' : ''}
              label={language === 'ar' ? 'عدد الحروف' : 'Number of Letters'}
              desc={language === 'ar' ? 'الأبجدية العربية تتكون من ٢٨ حرفاً.' : 'The Arabic alphabet consists of 28 letters.'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Arabic Letters Slider */}
        <div className="mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-amber-400">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <button
                onClick={prevLetter}
                className="p-2 sm:p-3 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="text-center">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {currentIndex + 1} / {arabicLetters.length}
                </span>
              </div>
              
              <button
                onClick={nextLetter}
                className="p-2 sm:p-3 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Letter Display */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-indigo-500 dark:text-amber-400 mb-3 sm:mb-4" dir="rtl">
                {currentLetter.letter}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-400 dark:text-amber-400 mb-2 font-arabicDisplay">
                {currentLetter.name}
              </h2>
              <p className="text-base sm:text-lg text-gray-300 dark:text-gray-200">
                {currentLetter.pronunciation}
              </p>
            </div>

            {/* Examples */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-amber-400 mb-3 sm:mb-4 text-center">
                {language === 'ar' ? 'أمثلة' : 'Examples'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {currentLetter.examples.map((example: string, index: number) => (
                  <div key={index} className="bg-indigo-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 text-center border border-indigo-100 dark:border-indigo-800">
                    <p className="text-lg sm:text-xl font-medium text-indigo-700 dark:text-amber-300" dir="rtl">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full bg-gray-800 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-amber-400 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / arabicLetters.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm sm:text-base text-gray-400 dark:text-gray-300 mt-2">
                {language === 'ar' 
                  ? `الحرف ${currentIndex + 1} من ${arabicLetters.length}`
                  : `Letter ${currentIndex + 1} of ${arabicLetters.length}`
                }
              </p>
            </div>

            {/* Navigation Tips */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-indigo-300">
                {language === 'ar' 
                  ? 'استخدم الأسهم للتنقل بين الحروف'
                  : 'Use the arrows to navigate between letters'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 