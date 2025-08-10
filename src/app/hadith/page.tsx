"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';

export default function HadithPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900">
            <FontAwesomeIcon icon={faQuoteRight} className="text-amber-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-amber-400">
            {t.motivation.hadith.title}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <p className="text-center text-gray-600 dark:text-gray-200 mb-6">
            {t.motivation.hadith.desc}
          </p>
          
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500">
              {t.hadithComingSoon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 