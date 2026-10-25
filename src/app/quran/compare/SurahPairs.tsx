'use client';

// docs/plans/quran-similar-ayat.md
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown01, ArrowDownWideNarrow, ChevronDown, Lightbulb, Search, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import { num } from '@/lib/quran/arabicNumber';
import type { SurahGroup } from '@/lib/quran/surahPairs';
import { surahMatch } from '@/lib/quran/surahSearch';
import { FIELD, NOTE, PANEL } from '../panel';
import { modeHref } from './modeHref';

type Mode = 'text' | 'themes';

function Switch({ off, on, checked, onChange, offIcon: OffIcon, onIcon: OnIcon }: { off: string; on: string; checked: boolean; onChange: (on: boolean) => void; offIcon: LucideIcon; onIcon: LucideIcon }) {
  const label = (active: boolean) => 'cursor-pointer ' + (active ? 'font-semibold text-[var(--home-accent)]' : 'text-[var(--home-muted)]');
  return (
    <div className="flex items-center gap-2 text-sm">
      <button type="button" tabIndex={-1} aria-hidden className={label(!checked)} onClick={() => onChange(false)}>{off}</button>
      <Toggle label={on} checked={checked} onChange={onChange}
        offIcon={<OffIcon size={14} aria-hidden />} onIcon={<OnIcon size={14} aria-hidden />} />
      <button type="button" tabIndex={-1} aria-hidden className={label(checked)} onClick={() => onChange(true)}>{on}</button>
    </div>
  );
}

const ROW = 'w-full flex items-baseline gap-2 px-2 py-1 text-start rounded hover:bg-[var(--home-paper-deep)] aria-[current=true]:bg-[var(--home-paper-deep)] aria-[current=true]:font-semibold';
const COUNT = 'text-[var(--home-muted)] tabular-nums';

export function SurahPairs({ groups, names, mode, surah, a, b }: { groups: SurahGroup[]; names: Record<number, string>; mode: Mode; surah: number | null; a: number; b: number }) {
  const ar = useLanguage().language === 'ar';
  const router = useRouter();
  const [byNumber, setByNumber] = useState(false);
  const [query, setQuery] = useState('');
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && query) box.scrollTop = 0;
    else if (box && row) box.scrollTop = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - box.clientHeight / 3;
  }, [surah, a, b, mode, query]);
  const go = (href: string) => router.push(href, { scroll: false });
  const sorted = (byNumber ? groups : [...groups].sort((p, q) => q.total - p.total || p.surah - q.surah)).filter(g => surahMatch(query, g.surah, names[g.surah] ?? '') !== null);
  const open = (s: number) => (surah === null ? s === a || s === b : s === surah);
  const unit = mode === 'themes' ? (ar ? 'موضوع مشترك' : 'shared topic') : (ar ? 'آية متشابهة' : 'similar ayah');

  return (
    <section dir={ar ? 'rtl' : 'ltr'} className={`${PANEL} flex flex-col gap-3`}>
      <h2 className="text-xl">{mode === 'themes' ? (ar ? 'السور بالمواضيع المشتركة' : 'Surahs by shared topics') : (ar ? 'السور بالآيات المتشابهة' : 'Surahs by similar ayat')}</h2>
      <p className={NOTE}>{ar ? `كل سورة بعدد ما يجمعها بغيرها (${unit}). افتح سورة لترى ما يقابلها، واختر واحدة لمقارنتهما.` : `Counts show each surah’s ${unit} matches. Open a surah and choose a partner to compare.`}</p>
      {mode === 'text' && (
        <Button size="sm" href="/quran/compare?a=55&af=46&at=61&b=55&bf=62&bt=77" className="w-fit">
          <Lightbulb size={16} aria-hidden />
          {ar ? 'مثال: الرحمن ٤٦–٦١ مقابل ٦٢–٧٧' : 'Example: Al-Rahman 46–61 and 62–77'}
        </Button>
      )}
      <Switch off={ar ? (mode === 'themes' ? 'الأكثر مواضيع مشتركة أولًا' : 'الأكثر آيات متشابهة أولًا') : 'Most matches first'} on={ar ? 'بترتيب المصحف' : 'Mushaf order'} checked={byNumber} onChange={setByNumber} offIcon={ArrowDownWideNarrow} onIcon={ArrowDown01} />
      <label className="relative">
        <Search size={14} aria-hidden className="absolute start-2.5 top-1/2 -translate-y-1/2 size-3 text-[var(--home-muted)]" />
        <input type="search" aria-label={ar ? 'ابحث عن سورة' : 'Find a surah'} placeholder={ar ? 'ابحث عن سورة بالاسم أو الرقم' : 'Search by surah name or number'} value={query} onChange={e => setQuery(e.target.value)} className={`${FIELD} w-full ps-8`} />
      </label>
      {sorted.length === 0 ? <p className={NOTE}>{groups.length === 0 ? (ar ? 'لا سور.' : 'No surahs.') : (ar ? 'لا سورة بهذا الاسم.' : 'No surah matches this name.')}</p> : (
        <ul ref={list} className="flex flex-col gap-2 max-h-[min(75vh,48rem)] overflow-y-auto">
          {sorted.map(g => (
            <li key={g.surah}>
              <details key={`${mode}:${surah}:${a}:${b}`} open={open(g.surah)} className="group border-b border-[var(--home-rule)]">
                <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className={`${NOTE} w-7 shrink-0 tabular-nums`}>{ar ? num(g.surah) : g.surah}</span>
                  <span className="flex-1">{names[g.surah]}</span>
                  <span className={COUNT}>{ar ? num(g.total) : g.total}</span>
                  <ChevronDown size={14} aria-hidden className="size-3 text-[var(--home-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <ul className="border-t border-[var(--home-rule)] p-1">
                  {g.self > 0 && mode === 'text' && (
                    <li>
                      <button type="button" className={ROW} aria-current={surah === g.surah} onClick={() => go(`/quran/compare?s=${g.surah}`)}>
                        <span className="flex-1">{ar ? 'داخل السورة' : 'Within this surah'}</span>
                        <span className={COUNT}>{ar ? num(g.self) : g.self}</span>
                      </button>
                    </li>
                  )}
                  {g.total === 0 && <li className={`${NOTE} px-2 py-1`}>{mode === 'themes' ? (ar ? 'لا مواضيع مشتركة مع سورة أخرى.' : 'No shared topics with another surah.') : (ar ? 'لا آيات متشابهة.' : 'No similar ayat.')}</li>}
                  {g.partners.map(p => (
                    <li key={p.other}>
                      <button type="button" className={ROW} aria-current={surah === null && ((g.surah === a && p.other === b) || (g.surah === b && p.other === a))}
                        onClick={() => go(modeHref(mode, { a: String(g.surah), b: String(p.other) }))}>
                        <span className="flex-1">{ar ? `و${names[p.other]}` : names[p.other]}</span>
                        <span className={COUNT}>{ar ? num(p.count) : p.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
