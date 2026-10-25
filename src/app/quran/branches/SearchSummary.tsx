'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { counted, num } from '@/lib/quran/arabicNumber';
import type { Opening } from '@/lib/quran/branches';
const NOTE = 'text-sm text-[var(--home-muted)]';

export default function SearchSummary({ query, count, complete }: { query: string; count: number; complete: { phrase: Opening; href: string }[] }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return (
    <div className="flex flex-col gap-1">
      <p className={NOTE}>{count === 0
        ? (ar ? `لا مجموعة تطابق «${query}».` : `No entry matches «${query}».`)
        : (ar ? `${counted(count, ['مجموعة', 'مجموعتان', 'مجموعات'])} تطابق «${query}»` : `${count} ${count === 1 ? 'entry matches' : 'entries match'} «${query}»`)}</p>
      {complete.map(({ phrase, href }) => <Link key={`${phrase.id}:${phrase.partition ?? ''}`} href={href} className="text-sm text-[var(--home-accent)] hover:underline self-start">
        {ar ? 'الشجرة كاملة: ' : 'Complete tree: '}
        <span className="font-arabic" dir="rtl">{`${phrase.text} (${ar ? num(phrase.count) : phrase.count})`}</span>
      </Link>)}
    </div>
  );
}
