'use client';

import React from 'react';
import { Columns2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { curatedComparisons, curatedComparisonHref } from '@/lib/quran/curatedComparisons';

export default function CuratedCompare({ selectedId, unavailable, children }: { selectedId: string; unavailable?: boolean; children: React.ReactNode }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4 text-[var(--home-ink)]">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl text-[var(--home-accent)]">{ar ? 'مقارنة المقاطع' : 'Passage comparisons'}</h1>
        <p className="text-sm text-[var(--home-muted)]">{ar ? 'اقرأ المقاطع المختارة كاملة، مع تمييز المطابقات اللفظية. لا تدل المطابقة اللفظية وحدها على تقابل أحداث القصة.' : 'Read the selected passages in full with lexical matches marked. A lexical match alone does not establish that narrative events correspond.'}</p>
      </header>
      {unavailable && <p role="status">{ar ? 'المقارنة المطلوبة غير متاحة. اختر مقارنة من القائمة.' : 'This comparison is unavailable. Choose a comparison from the list.'}</p>}
      <nav aria-label={ar ? 'المقاطع المختارة' : 'Curated passages'} className="flex flex-wrap gap-2">
        {curatedComparisons.map(preset => <Button key={preset.id} href={curatedComparisonHref(preset)} variant="neutral" active={preset.id === selectedId} aria-current={preset.id === selectedId ? 'page' : undefined} className="max-w-full flex-wrap">
          <Columns2 size={16} aria-hidden />
          {preset.name[language]}
          <span dir="ltr" className="text-xs">{preset.a.surah}:{preset.a.from}–{preset.a.to} / {preset.b.surah}:{preset.b.from}–{preset.b.to}</span>
        </Button>)}
      </nav>
      {children}
    </div>
  );
}
