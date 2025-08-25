"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function ArticleHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl text-gray-900 dark:text-white leading-tight">
          {language === 'ar' ? (
            <>
              اكتشف&nbsp;
              <span className="text-amber-400">
                المقالات
              </span>&nbsp;
              والمعرفة
            </>
          ) : (
            <>
              Discover Interactive
              <span className="block text-amber-400">
                Articles & Knowledge
              </span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {language === 'ar' ? (
            'استكشف مجموعة واسعة من المقالات والمرئية التي تغطي مواضيع متنوعة في التاريخ الإسلامي والعلوم والثقافة.'
          ) : (
            'Explore a diverse collection of interactive and visual articles covering various topics in Islamic history, sciences, and culture.'
          )}
        </p>
      </div>
    </div>
  );
}
