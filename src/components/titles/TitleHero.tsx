"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function TitleHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl text-gray-900 dark:text-white leading-tight">
          {language === 'ar' ? (
            <>
              اكتشف&nbsp;
              <span className="text-indigo-600 dark:text-indigo-400">
                ألقاب الصحابة
              </span>&nbsp;
              والتابعين
            </>
          ) : (
            <>
              Discover the
              <span className="block text-indigo-600 dark:text-indigo-400">
                Titles of Companions
              </span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {language === 'ar' ? (
            'اكتشف الألقاب والكنى التي أُطلقت على الشخصيات الإسلامية البارزة عبر التاريخ، وتعرف على معانيها وأصولها.'
          ) : (
            'Explore the titles and nicknames given to prominent Islamic figures throughout history, and learn about their meanings and origins.'
          )}
        </p>
      </div>
    </div>
  );
}
