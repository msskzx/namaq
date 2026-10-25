'use client';

import React from 'react';
import { Layers3, ListOrdered, Waves } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import RangeFilter from '@/components/quran/RangeFilter';
import { num } from '@/lib/quran/arabicNumber';
import { RANGE_KEYS, RANGE_MAX, rangeParams, type CompareRange, type RangeUnit } from '@/lib/quran/compareRange';
import type { JuzRange } from '@/lib/quran/juz';
import { tabHref, type CompareTab } from './modeHref';

type Query = Record<string, string>;

const TABS: { tab: CompareTab; label: string; icon: React.ReactNode }[] = [
  { tab: 'similar', label: 'المتشابه', icon: <Waves size={16} aria-hidden /> },
  { tab: 'ayat', label: 'آية بآية', icon: <ListOrdered size={16} aria-hidden /> },
  { tab: 'themes', label: 'المواضيع', icon: <Layers3 size={16} aria-hidden /> },
];

const LABELS: Record<RangeUnit, { from: string; to: string; all: string; form: string; name: string }> = {
  juz: { from: 'من الجزء', to: 'إلى الجزء', all: 'كل الأجزاء', form: 'نطاق الأجزاء', name: 'الأجزاء' },
  surah: { from: 'من السورة', to: 'إلى السورة', all: 'كل السور', form: 'نطاق السور', name: 'السور' },
};

export function rangeHref(query: Query, range: CompareRange) {
  const params = new URLSearchParams([...Object.entries(query).filter(([key]) => !(RANGE_KEYS as readonly string[]).includes(key)), ...Object.entries(rangeParams(range))]);
  const search = params.toString();
  return search ? `/quran/compare?${search}` : '/quran/compare';
}

export default function CompareControls({ tab, query, range, summary }: { tab: CompareTab | null; query: Query; range: CompareRange; summary: string }) {
  const { unit } = range;
  const labels = LABELS[unit];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper-deep)] p-3">
      <Segmented label="طريقة المقارنة" options={TABS.map(t => ({ key: t.tab, label: t.label, icon: t.icon, current: t.tab === tab, href: tabHref(t.tab, query) }))} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-[var(--home-muted)]">النطاق</span>
        <Segmented label="النطاق بالأجزاء أو بالسور" options={(['juz', 'surah'] as const).map(u => ({ key: u, label: u === 'juz' ? 'بالأجزاء' : 'بالسور', current: u === unit, href: rangeHref(query, { unit: u, range: null }) }))} />
        <RangeFilter key={unit} range={range.range} max={RANGE_MAX[unit]} names={[`${unit}From`, `${unit}To`]} href={(next?: JuzRange) => rangeHref(query, { unit, range: next ?? null })}
          labels={{ ...labels, invalid: shown => `أدخل رقمين من ١ إلى ${num(RANGE_MAX[unit])}، على أن تكون البداية قبل النهاية أو مساوية لها. النتائج المعروضة ما زالت لـ${labels.name} ${num(shown.from)}–${num(shown.to)}.` }} />
      </div>
      <p role="status" className="text-sm text-[var(--home-muted)] lg:ms-auto">{summary}</p>
    </div>
  );
}
