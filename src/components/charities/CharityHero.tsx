"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/language/LanguageContext';
import CharitySlider from './CharitySlider';
import CharityPicker from '@/components/charities/CharityPicker'

export default function CharityHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-950 pt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight text-center">
              {language === 'ar' ? (
                <>
                  الإنفاق في سبيل الله
                  <span className="block text-indigo-600 dark:text-indigo-400">
                    استثمار في الآخرة
                  </span>
                </>
              ) : (
                <>
                  Spending for the sake of Allah
                  <span className="block text-indigo-600 dark:text-indigo-400">
                    An Investment in the Hereafter
                  </span>
                </>
              )}
            </h1>

            <CharitySlider />
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] w-full">
              <Image
                src="/gemini_children.png"
                alt={language === 'ar' ? 'أطفال يحتاجون للمساعدة' : 'Children in need of help'}
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Charity Slider Section */}
        <div className="mt-4">
          <CharityPicker />
        </div>
      </div>
    </div >
  );
}
