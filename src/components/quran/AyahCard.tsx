"use client";

import React from 'react';
import type { Ayah } from "@/types/quran";
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';

interface AyahCardProps {
  ayah: Ayah;
}

export function AyahCard({ ayah }: AyahCardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold">
            {ayah.number}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-right text-2xl mb-2 font-arabic" dir="rtl">
            {ayah.text}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {language === 'ar' ? ayah.surah.name : ayah.surah.nameTransliterated || ayah.surah.name} - {t.ayahs} {ayah.number}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AyatGroupProps {
  ayat: Ayah[];
}

export function AyatGroup({ ayat }: AyatGroupProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!ayat || ayat.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        {t.quranicVersesAboutPeople}
      </h2>
      <div className="space-y-4">
        {ayat.map((ayah) => (
          <AyahCard key={ayah.id} ayah={ayah} />
        ))}
      </div>
    </div>
  );
}

