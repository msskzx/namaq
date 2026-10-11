import React from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';

type Props = { surahs: { number: number; name: string; numberOfAyat: number; page: number | null }[] };

export default function SurahIndex({ surahs }: Props) {
  return (
    <div dir="rtl" lang="ar" className="max-w-3xl mx-auto p-4 text-gray-900 dark:text-gray-200">
      <h1 className="text-3xl mb-2">قراءة القرآن</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">اختر سورة من السور الـ{num(surahs.length)}. النص برواية حفص.</p>
      <ol className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {surahs.map((surah) => (
          <li key={surah.number}>
            <Link
              href={`/quran/read/${surah.page ?? 1}`}
              className="flex justify-between rounded border border-amber-400 px-3 py-2 hover:bg-amber-50 dark:hover:bg-gray-800"
            >
              <span>{num(surah.number)}. {surah.name}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{num(surah.numberOfAyat)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
