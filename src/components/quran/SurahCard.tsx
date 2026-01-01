"use client";

import React from 'react';
import { Surah } from '@/types/quran';
import { useLanguage } from '../language/LanguageContext';

interface SurahCardProps {
  surah: Surah;
}

export default function SurahCard({ surah }: SurahCardProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-2 text-amber-400">
        {language === 'ar' ? surah.name : surah.nameTransliterated || surah.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {surah.numberOfAyat} {language === 'ar' ? 'آية' : 'Ayahs'}
      </p>
    </div>
  );
}

