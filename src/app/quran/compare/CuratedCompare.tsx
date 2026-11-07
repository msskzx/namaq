'use client';

import React, { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ChevronDown, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import { NavActions } from '@/components/common/NavBar';
import { useLanguage } from '@/components/language/LanguageContext';
import { curatedComparisons, curatedComparisonHref, curatedSurahNames, curatedTitle } from '@/lib/quran/curatedComparisons';
import { num } from '@/lib/quran/arabicNumber';
import { normalizeWord } from '@/lib/quran/normalize';
import { FIELD } from '../panel';

export default function CuratedCompare({ selectedId, unavailable, children }: { selectedId: string; unavailable?: boolean; children: React.ReactNode }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const label = ar ? 'اختر مقارنة' : 'Choose comparison';
  const search = ar ? 'ابحث في المقارنات' : 'Search comparisons';
  const selected = curatedComparisons.find(preset => preset.id === selectedId);
  const refs = (preset: typeof curatedComparisons[number]) => `${preset.a.surah}:${preset.a.from}–${preset.a.to} / ${preset.b.surah}:${preset.b.from}–${preset.b.to}`;
  const sides = (preset: typeof curatedComparisons[number]) => [preset.a, preset.b].map(side => {
    const name = curatedSurahNames[side.surah]?.[language] ?? String(side.surah);
    return ar ? `${name} ${num(side.from)}–${num(side.to)}` : `${name} ${side.from}–${side.to}`;
  }).join(' · ');
  const normalize = (text: string) => normalizeWord(text).toLowerCase().replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
  const terms = normalize(query).trim().split(/\s+/);
  const found = curatedComparisons.filter(preset => terms.every(term => normalize(`${preset.name.ar} ${curatedTitle(preset, 'ar')} ${curatedTitle(preset, 'en')} ${refs(preset)} ${[preset.a, preset.b].map(side => `${curatedSurahNames[side.surah]?.ar} ${curatedSurahNames[side.surah]?.en}`).join(' ')}`).includes(term)));
  const close = () => panel.current?.hidePopover();
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-4 text-[var(--home-ink)]">
      <NavActions>
        <span className="flex min-w-0 max-w-[calc(100%-8rem)] justify-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
        <Button variant="neutral" aria-label={label} aria-describedby={`${id}-selected`} aria-expanded={open} aria-controls={id} aria-haspopup="dialog" onClick={() => {
          if (open) { close(); return; }
          setQuery('');
          panel.current?.showPopover();
          input.current?.focus();
        }} className="min-w-0 max-w-full">
          <ArrowLeftRight size={16} aria-hidden /><span id={`${id}-selected`} className="truncate">{selected ? curatedTitle(selected, ar ? 'ar' : 'en') : label}</span><ChevronDown size={14} aria-hidden />
        </Button>
        </span>
        <div ref={panel} id={id} popover="auto" role="dialog" aria-label={label} aria-hidden={!open} dir={ar ? 'rtl' : 'ltr'}
          onToggle={event => setOpen((event.nativeEvent as ToggleEvent).newState === 'open')}
          className="fixed m-0 w-[min(24rem,calc(100vw-var(--app-rail)-2*var(--home-gutter)))] overflow-y-auto rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 text-[var(--home-ink)] shadow-lg"
          style={{ inset: 'auto', insetBlockStart: 'calc(57px + env(safe-area-inset-top))', insetInlineStart: 'var(--app-rail, 0px)', insetInlineEnd: 0, marginInline: 'auto', maxHeight: 'calc(100dvh - 8rem)' }}>
          <div className="relative mb-2">
            <Search size={16} aria-hidden className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-[var(--home-muted)]" />
            <input ref={input} type="search" aria-label={search} placeholder={search} value={query} onChange={event => setQuery(event.target.value)}
              onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); panel.current?.querySelector<HTMLAnchorElement>('a')?.focus(); } }}
              className={`${FIELD} w-full ps-8`} />
          </div>
          <nav aria-label={ar ? 'المقاطع المختارة' : 'Curated passages'} className="flex flex-col">
            {found.map(preset => <Link key={preset.id} href={curatedComparisonHref(preset)} aria-current={preset.id === selectedId ? 'page' : undefined} onClick={close}
              className="flex flex-col gap-1 rounded px-3 py-2 text-start hover:bg-[var(--home-paper-deep)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)] aria-[current=page]:bg-[var(--home-paper-deep)]">
              <span>{curatedTitle(preset, ar ? 'ar' : 'en')}</span><span className="text-xs text-[var(--home-muted)]">{sides(preset)}</span>
            </Link>)}
            {found.length === 0 && <p role="status" className="p-3 text-sm text-[var(--home-muted)]">{ar ? 'لا توجد مقارنة بهذا البحث.' : 'No comparisons match this search.'}</p>}
          </nav>
        </div>
      </NavActions>
      {unavailable && <p role="status">{ar ? 'المقارنة المطلوبة غير متاحة. اختر مقارنة من القائمة.' : 'This comparison is unavailable. Choose a comparison from the list.'}</p>}
      {children}
    </div>
  );
}
