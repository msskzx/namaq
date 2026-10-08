'use client';

import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faScroll } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import HadithBody, { sceneColours } from '@/components/hadith/HadithBody';
import HadithModeToggle, { type HadithMode } from '@/components/hadith/HadithModeToggle';
import { useLanguage } from '@/components/language/LanguageContext';
import type { PersonHadith } from '@/lib/modelUnitPeople';

const roleText = {
  isnad: { en: 'In the isnad', ar: 'في الإسناد' },
  speaks: { en: 'Speaks', ar: 'يتكلم' },
  mentioned: { en: 'Mentioned', ar: 'مذكور' },
} as const;

export default function ProfileHadith({ slug, hadith }: { slug: string; hadith: PersonHadith[] }) {
  const ar = useLanguage().language === 'ar';
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<HadithMode>('bubbles');
  const current = hadith[Math.min(page, hadith.length) - 1];
  const reports = useMemo(
    () => current?.view.reports.filter((r) => r.voice !== 'AUTHOR') ?? [],
    [current],
  );
  if (!current) return null;
  const place = [current.book, current.kitab, current.bab].filter(Boolean).join(' — ');

  return (
    <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
      <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faScroll} className="w-7 h-7 text-amber-500 me-2" />
        {ar ? 'الأحاديث' : 'Hadith'}
      </h2>
      <HadithModeToggle mode={mode} onChange={setMode} />
      <p dir="rtl" className="mb-2 text-xl leading-loose text-gray-700 dark:text-gray-300">
        {place}
      </p>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {current.roles.map((role) => (
          <Badge key={role} size="sm" color="amber" text={roleText[role][ar ? 'ar' : 'en']} />
        ))}
        <Button size="sm" variant="outline" href={`/hadith/${current.unit}`}>
          <FontAwesomeIcon icon={faBookOpen} />
          {current.title}
        </Button>
      </div>
      {reports.map((report) => (
        <div key={report.id}>
          <HadithBody
            report={report}
            view={current.view}
            mode={mode}
            colours={sceneColours(report.scenes)}
            highlight={slug}
          />
        </div>
      ))}
      <Pagination
        page={page}
        pageCount={hadith.length}
        onChange={setPage}
        showSelect
        pageLabels={hadith.map((h) => [h.book, h.kitab].filter(Boolean).join(' — '))}
      />
    </div>
  );
}
