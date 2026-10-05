'use client';

import React from 'react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function HadithIndex({ units }: { units: { id: string; book: string }[] }) {
  const ar = useLanguage().language === 'ar';
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl mb-2 text-gray-900 dark:text-gray-200">{ar ? 'الأحاديث (تجريبي)' : 'Hadith (experimental)'}</h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {ar
          ? 'بيانات اختبار مدقَّقة يدويًا، وليست مصدرًا.'
          : 'Hand-checked test fixtures, not a source.'}
      </p>
      <ul className="flex flex-col gap-2">
        {units.map((u) => (
          <li key={u.id}>
            <Button variant="outline" href={`/hadith/${u.id}`}>
              <FontAwesomeIcon icon={faBookOpen} />
              {u.book}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
