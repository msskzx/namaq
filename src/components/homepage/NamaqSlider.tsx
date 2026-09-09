"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';

const words = [
  'نَمَق',
  'يَنمُق',
  'نَمْقًا',
  'نامِق',
  'مَنْموق',
  'نَمَّقَ',
  'ينمِّق',
  'تنميقًا',
  'مُنمِّق',
  'نَمْق',
  'نَمَق',
];

export default function NamaqSlider() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const goRight = () => setCurrent((prev) => (prev === 0 ? words.length - 1 : prev - 1));
  const goLeft = () => setCurrent((prev) => (prev === words.length - 1 ? 0 : prev + 1));

  // Auto-advance every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (language === 'ar') {
        goLeft();
      } else {
        goRight();
      }
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div className="w-full flex flex-col items-center mb-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full h-full border-l-4 border-r-4 border-rose-800">
      <div className="relative w-full max-w-xs mx-auto">
        <Button
          size="icon"
          onClick={language == 'ar' ? goLeft : goRight}
          aria-label={language === 'ar' ? 'التالي' : 'Previous'}
          className="absolute top-1/2 z-10 -translate-y-1/2"
          style={{ left: '-2.5rem' }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
        </Button>
        <div className="bg-transparent px-8 py-8 flex flex-col items-center justify-center min-w-[220px] min-h-[120px] transition-all duration-300">
          <span className="text-3xl sm:text-4xl md:text-5xl font-arabicDisplay text-amber-400">
            {words[current]}
          </span>
        </div>
        <Button
          size="icon"
          onClick={language == 'ar' ? goRight : goLeft}
          aria-label={language === 'ar' ? 'السابق' : 'Next'}
          className="absolute top-1/2 z-10 -translate-y-1/2"
          style={{ right: '-2.5rem' }}
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {words.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-amber-400' : 'bg-gray-700'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
