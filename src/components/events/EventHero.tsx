"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/language/LanguageContext';

export default function EventHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="space-y-6">
          <h1 className="text-4xl text-gray-900 dark:text-white leading-tight text-center">
            {language === 'ar' ? (
              <>
                استكشف&nbsp;
                <span className="text-indigo-600 dark:text-indigo-400">
                  الأحداث التاريخية
                </span>&nbsp;
                في الإسلام
              </>
            ) : (
              <>
                Explore Historical
                <span className="block text-indigo-600 dark:text-indigo-400">
                  Events in Islam
                </span>
              </>
            )}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 text-center leading-relaxed">
            {language === 'ar' ? (
              'اكتشف الأحداث المهمة التي شكلت التاريخ الإسلامي، من الهجرة النبوية إلى المعارك الحاسمة واللحظات التاريخية العظيمة.'
            ) : (
              'Discover the pivotal events that shaped Islamic history, from the Prophetic Migration to decisive battles and great historical moments.'
            )}
          </p>
        </div>

        {/* Right side - Image */}
        <div className="relative">
          <div className="relative h-96 lg:h-[500px] w-full">
            <Image
              src="/gemini_scholar.png"
              alt={language === 'ar' ? 'عالم إسلامي' : 'Islamic Scholar'}
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
