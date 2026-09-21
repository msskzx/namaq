"use client";

import React, { useEffect, useState } from 'react';
import type { Ayah } from "@/types/quran";
import Pagination from '@/components/common/Pagination';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';

interface AyahCardProps {
  ayah: Ayah;
}

export function AyahCard({ ayah }: AyahCardProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="bg-black border border-white/10 rounded-lg p-4 mb-4">
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
  pageSize?: number;
}

export function AyatGroup({ ayat, pageSize = 5 }: AyatGroupProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [page, setPage] = useState(1);

  const count = ayat?.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / pageSize));

  // A shorter list can leave the reader on a page that no longer exists, for
  // instance when the profile's verses arrive after an empty first render.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  if (!ayat || ayat.length === 0) {
    return null;
  }

  const first = (page - 1) * pageSize;
  const shown = ayat.slice(first, first + pageSize);

  return (
    <div className="bg-black border border-white/10 rounded-lg p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        {t.quranicVersesAboutPeople}
      </h2>
      <div className="space-y-4">
        {shown.map((ayah) => (
          <AyahCard key={ayah.id} ayah={ayah} />
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} showSelect />
    </div>
  );
}

