"use client";

import { useLanguage } from "@/components/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface ArabicLetter {
  letter: string;
  name: string;
  examples: string[];
  pronunciation: string;
}

const arabicLetters: ArabicLetter[] = [
  {
    letter: 'ا',
    name: 'Alif',
    examples: ['أَبْ', 'أُمْ', 'أَخْ'],
    pronunciation: 'a'
  },
  {
    letter: 'ب',
    name: 'Baa',
    examples: ['بَيْتْ', 'بَحْرْ', 'بَلَدْ'],
    pronunciation: 'b'
  },
  {
    letter: 'ت',
    name: 'Taa',
    examples: ['تَاجْ', 'تُفَّاحْ', 'تَمْرْ'],
    pronunciation: 't'
  },
  {
    letter: 'ث',
    name: 'Thaa',
    examples: ['ثَوْبْ', 'ثَلْجْ', 'ثَمَرْ'],
    pronunciation: 'th'
  },
  {
    letter: 'ج',
    name: 'Jeem',
    examples: ['جَمَلْ', 'جَبَلْ', 'جَوْزْ'],
    pronunciation: 'j'
  },
  {
    letter: 'ح',
    name: 'Haa',
    examples: ['حَجَرْ', 'حَقْلْ', 'حُبْ'],
    pronunciation: 'h'
  },
  {
    letter: 'خ',
    name: 'Khaa',
    examples: ['خَيْرْ', 'خُبْزْ', 'خَشَبْ'],
    pronunciation: 'kh'
  },
  {
    letter: 'د',
    name: 'Dal',
    examples: ['دَرْسْ', 'دُبْ', 'دَمْ'],
    pronunciation: 'd'
  },
  {
    letter: 'ذ',
    name: 'Dhal',
    examples: ['ذَهَبْ', 'ذُبَابْ', 'ذَرَّةْ'],
    pronunciation: 'dh'
  },
  {
    letter: 'ر',
    name: 'Raa',
    examples: ['رَسُولْ', 'رَمَضَانْ', 'رَحْمَةْ'],
    pronunciation: 'r'
  },
  {
    letter: 'ز',
    name: 'Zay',
    examples: ['زَيْتُونْ', 'زَمَنْ', 'زَهْرْ'],
    pronunciation: 'z'
  },
  {
    letter: 'س',
    name: 'Seen',
    examples: ['سَمَاءْ', 'سُكَّرْ', 'سَبِيلْ'],
    pronunciation: 's'
  },
  {
    letter: 'ش',
    name: 'Sheen',
    examples: ['شَمْسْ', 'شَجَرْ', 'شَرْقْ'],
    pronunciation: 'sh'
  },
  {
    letter: 'ص',
    name: 'Saad',
    examples: ['صَلَاةْ', 'صَوْمْ', 'صِدْقْ'],
    pronunciation: 's'
  },
  {
    letter: 'ض',
    name: 'Daad',
    examples: ['ضَرْبْ', 'ضَوْءْ', 'ضَلَالْ'],
    pronunciation: 'd'
  },
  {
    letter: 'ط',
    name: 'Taa',
    examples: ['طَيْرْ', 'طَعَامْ', 'طَرِيقْ'],
    pronunciation: 't'
  },
  {
    letter: 'ظ',
    name: 'Dhaa',
    examples: ['ظَلْمْ', 'ظَهْرْ', 'ظُهُورْ'],
    pronunciation: 'dh'
  },
  {
    letter: 'ع',
    name: 'Ayn',
    examples: ['عِلْمْ', 'عَمَلْ', 'عَدْلْ'],
    pronunciation: 'a'
  },
  {
    letter: 'غ',
    name: 'Ghayn',
    examples: ['غَيْمْ', 'غَضَبْ', 'غُفْرَانْ'],
    pronunciation: 'gh'
  },
  {
    letter: 'ف',
    name: 'Faa',
    examples: ['فَجْرْ', 'فَرْضْ', 'فَضْلْ'],
    pronunciation: 'f'
  },
  {
    letter: 'ق',
    name: 'Qaaf',
    examples: ['قُرْآنْ', 'قَلْبْ', 'قُوَّةْ'],
    pronunciation: 'q'
  },
  {
    letter: 'ك',
    name: 'Kaaf',
    examples: ['كِتَابْ', 'كَلَامْ', 'كَرَمْ'],
    pronunciation: 'k'
  },
  {
    letter: 'ل',
    name: 'Laam',
    examples: ['لَيْلْ', 'لُغَةْ', 'لُقْمَةْ'],
    pronunciation: 'l'
  },
  {
    letter: 'م',
    name: 'Meem',
    examples: ['مَسْجِدْ', 'مُحَمَّدْ', 'مَلِكْ'],
    pronunciation: 'm'
  },
  {
    letter: 'ن',
    name: 'Noon',
    examples: ['نُورْ', 'نَبِيِّ', 'نَجْمْ'],
    pronunciation: 'n'
  },
  {
    letter: 'ه',
    name: 'Haa',
    examples: ['هَدْيْ', 'هُدًى', 'هَادِيْ'],
    pronunciation: 'h'
  },
  {
    letter: 'و',
    name: 'Waw',
    examples: ['وَقْتْ', 'وَجْهْ', 'وَحْدْ'],
    pronunciation: 'w'
  },
  {
    letter: 'ي',
    name: 'Yaa',
    examples: ['يَوْمْ', 'يَدْ', 'يَقِينْ'],
    pronunciation: 'y'
  }
];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            {language === 'ar' ? 'الحروف العربية' : 'Arabic Letters'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
            {language === 'ar' 
              ? 'تعلم الحروف الـ 28 من الأبجدية العربية مع النطق والأمثلة'
              : 'Learn the 28 letters of the Arabic alphabet with pronunciation and examples'
            }
          </p>
        </header>

        {/* Arabic Letters Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <button
                onClick={prevLetter}
                className="p-2 sm:p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
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
                className="p-2 sm:p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Letter Display */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-indigo-600 dark:text-indigo-400 mb-3 sm:mb-4" dir="rtl">
                {currentLetter.letter}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {currentLetter.name}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                {currentLetter.pronunciation}
              </p>
            </div>

            {/* Examples */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center">
                {language === 'ar' ? 'أمثلة' : 'Examples'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {currentLetter.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-xl font-medium text-gray-800 dark:text-white" dir="rtl">
                      {example}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-indigo-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / arabicLetters.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                {language === 'ar' 
                  ? `الحرف ${currentIndex + 1} من ${arabicLetters.length}`
                  : `Letter ${currentIndex + 1} of ${arabicLetters.length}`
                }
              </p>
            </div>

            {/* Navigation Tips */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
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