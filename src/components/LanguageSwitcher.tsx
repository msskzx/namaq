"use client";

import React from 'react';
import { useLanguage } from './LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      style={{ minWidth: 64 }}
    >
      <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-gray-500" />
      <div className="flex items-center w-16 h-7 rounded-full bg-gray-300 dark:bg-gray-600 relative">
        <span
          className={`flex-1 text-xs font-bold text-center z-10 transition-colors ${language === 'ar' ? 'text-black dark:text-white' : 'text-gray-500'}`}
        >
          AR
        </span>
        <span
          className={`flex-1 text-xs font-bold text-center z-10 transition-colors ${language === 'en' ? 'text-black dark:text-white' : 'text-gray-500'}`}
        >
          EN
        </span>
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-200 w-1/2 h-5 rounded-full bg-indigo-400 ${language === 'ar' ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ zIndex: 1 }}
        />
      </div>
    </button>
  );
};

export default LanguageSwitcher; 