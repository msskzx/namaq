"use client";

import React from 'react';
import Image from 'next/image';

export default function ArabicHero() {
  return (
    <div className="bg-white dark:bg-gray-950" dir="rtl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl text-blue-600 dark:text-blue-400 tracking-tight arabic-text">
              اللغة العربية
            </h1>

            <div className="space-y-4">
              <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 arabic-text">
                لغة عالمية يتحدث بها أكثر من
              </p>
              <p className="text-6xl md:text-7xl text-blue-600 dark:text-blue-400 arabic-text">
                422 مليون
              </p>
              <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 arabic-text">
                شخص حول العالم
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-lg text-gray-700 dark:text-gray-300 arabic-text leading-relaxed">
              اكتشف جمال وأصالة اللغة العربية، لغة القرآن الكريم والتراث الإسلامي العريق
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative">
          <div className="relative h-96 lg:h-[500px] w-full">
            <Image
              src="/mariam_arabic_language.png"
              alt="Arabic Language"
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
