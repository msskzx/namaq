"use client";

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function CharityCategoryHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl text-gray-900 dark:text-white leading-tight">
          {language === 'ar' ? (
            <>
              تصفح&nbsp;
              <span className="text-green-600 dark:text-green-400">
                فئات الجمعيات
              </span>&nbsp;
              الخيرية
            </>
          ) : (
            <>
              Browse
              <span className="block text-green-600 dark:text-green-400">
                Charity Categories
              </span>
            </>
          )}
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {language === 'ar' ? (
            'اكتشف مختلف فئات الجمعيات الخيرية والمنظمات الإنسانية، واختر المجال الذي تريد دعمه في خدمة الإنسانية.'
          ) : (
            'Discover different categories of charitable organizations and humanitarian groups, and choose the field you want to support in serving humanity.'
          )}
        </p>
      </div>
    </div>
  );
}
