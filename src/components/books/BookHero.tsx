"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BookHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="space-y-6">
          <h1 className="text-4xl text-gray-900 dark:text-white leading-tight text-center">
            {language === 'ar' ? (
              <>
                اكتشف&nbsp;
                <span className="text-indigo-600 dark:text-indigo-400">
                  الكتب الإسلامية
                </span>&nbsp;
                القيمة
              </>
            ) : (
              <>
                Discover Valuable
                <span className="block text-indigo-600 dark:text-indigo-400">
                  Islamic Books
                </span>
              </>
            )}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 text-center leading-relaxed">
            {language === 'ar' ? (
              'استكشف مجموعة واسعة من الكتب الإسلامية التي تغطي التاريخ والفقه والعلوم والآداب الإسلامية.'
            ) : (
              'Explore a vast collection of Islamic books covering history, jurisprudence, sciences, and Islamic literature.'
            )}
          </p>
        </div>

        {/* Right side - Image */}
        <div className="relative">
          <div className="relative h-96 lg:h-[500px] w-full">
            <Image
              src="/gemini_books.png"
              alt={language === 'ar' ? 'كتب إسلامية' : 'Islamic Books'}
              fill
              className="object-cover rounded-2xl shadow-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
