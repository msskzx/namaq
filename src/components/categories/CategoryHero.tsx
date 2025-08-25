"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function CategoryHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl text-gray-900 dark:text-white leading-tight">
          {language === 'ar' ? (
            <>
              استكشف&nbsp;
              <span className="text-amber-400">
                فئات المعرفة
              </span>&nbsp;
              الإسلامية
            </>
          ) : (
            <>
              Explore Islamic
              <span className="block text-amber-400">
                Knowledge Categories
              </span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {language === 'ar' ? (
            'اكتشف مجموعة واسعة من الفئات التي تغطي مختلف جوانب المعرفة الإسلامية، من التاريخ والفقه إلى العلوم والآداب.'
          ) : (
            'Discover a wide range of categories covering various aspects of Islamic knowledge, from history and jurisprudence to sciences and literature.'
          )}
        </p>
      </div>
    </div>
  );
}
