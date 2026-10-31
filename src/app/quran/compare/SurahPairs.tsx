'use client';

// docs/plans/quran-similar-ayat.md
import React, { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ArrowDown01, ArrowDownWideNarrow } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import { announceNavigation } from '@/components/quran/RangeFilter';
import { num } from '@/lib/quran/arabicNumber';
import type { SurahGroup } from '@/lib/quran/surahPairs';
import { matchesSurah } from '@/lib/quran/surahSearch';
import { FIELD, NOTE } from '../panel';
import { pairHref, surahHref, type CompareTab } from './modeHref';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

type Query = Record<string, string>;

const ROW = 'w-full flex items-baseline gap-2 px-2 py-1 text-start rounded hover:bg-[color-mix(in_srgb,var(--home-accent)_10%,transparent)] aria-[current=true]:bg-[color-mix(in_srgb,var(--home-accent)_16%,transparent)] aria-[current=true]:font-semibold';
const COUNT = 'text-[var(--home-accent)] tabular-nums';

export function SurahPairs({ groups, names, tab, query, surah, within = false, a, b }: { groups: SurahGroup[]; names: Record<number, string>; tab: CompareTab; query: Query; surah: number | null; within?: boolean; a: number; b: number }) {
  const mode = tab === 'themes' ? 'themes' : 'text';
  const router = useNavigatingRouter();
  const [byNumber, setByNumber] = useState(false);
  const [search, setSearch] = useState('');
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && search) box.scrollTop = 0;
    else if (box && row) box.scrollTop = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - box.clientHeight / 3;
  }, [surah, within, a, b, mode, search]);
  const go = (href: string) => {
    announceNavigation();
    router.push(href, { scroll: false });
  };
  const sorted = (byNumber ? groups : [...groups].sort((p, q) => q.total - p.total || p.surah - q.surah)).filter(g => matchesSurah({ number: g.surah, name: names[g.surah] ?? '' }, search));
  const open = (s: number) => (surah === null ? s === a || s === b : s === surah);
  const unit = mode === 'themes' ? 'موضوع مشترك' : 'آية متشابهة';

  return (
    <>
      <p className={NOTE}>{`كل سورة بعدد ما يجمعها بغيرها (${unit}). افتح سورة لترى ما يقابلها، واختر واحدة لمقارنتهما.`}</p>
      <Segmented label="ترتيب السور" options={[
        { key: 'count', label: mode === 'themes' ? 'الأكثر مواضيع' : 'الأكثر تشابهًا', icon: <ArrowDownWideNarrow size={16} aria-hidden />, current: !byNumber, onClick: () => setByNumber(false) },
        { key: 'number', label: 'ترتيب المصحف', icon: <ArrowDown01 size={16} aria-hidden />, current: byNumber, onClick: () => setByNumber(true) },
      ]} />
      <label className="relative">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute start-2.5 top-1/2 -translate-y-1/2 size-3 text-[var(--home-muted)]" />
        <input type="search" aria-label="ابحث عن سورة" placeholder="ابحث عن سورة بالاسم أو الرقم" value={search} onChange={e => setSearch(e.target.value)} className={`${FIELD} w-full ps-8`} />
      </label>
      {sorted.length === 0 ? <p className={NOTE}>{groups.length === 0 ? 'لا سور في هذا النطاق.' : 'لا سورة بهذا الاسم.'}</p> : (
        <ul ref={list} className="flex flex-col gap-2 max-h-[min(75vh,48rem)] overflow-y-auto">
          {sorted.map(g => (
            <li key={g.surah}>
              <details key={`${mode}:${surah}:${within}:${a}:${b}`} open={open(g.surah)} className="group rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] open:border-[var(--home-accent)]">
                <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className={`${NOTE} w-7 shrink-0 tabular-nums`}>{num(g.surah)}</span>
                  <span className="flex-1">{names[g.surah]}</span>
                  <span className={COUNT}>{num(g.total)}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="size-3 text-[var(--home-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <ul className="border-t border-[var(--home-rule)] p-1">
                  {g.total > 0 && mode === 'text' && (
                    <li>
                      <button type="button" className={ROW} aria-current={surah === g.surah && !within} onClick={() => go(surahHref(g.surah, query))}>
                        <span className="flex-1">كل المواضع</span>
                        <span className={COUNT}>{num(g.total)}</span>
                      </button>
                    </li>
                  )}
                  {g.self > 0 && mode === 'text' && (
                    <li>
                      <button type="button" className={ROW} aria-current={surah === g.surah && within} onClick={() => go(surahHref(g.surah, query, true))}>
                        <span className="flex-1">داخل السورة</span>
                        <span className={COUNT}>{num(g.self)}</span>
                      </button>
                    </li>
                  )}
                  {g.total === 0 && <li className={`${NOTE} px-2 py-1`}>{mode === 'themes' ? 'لا مواضيع مشتركة مع سورة أخرى.' : 'لا آيات متشابهة.'}</li>}
                  {g.partners.map(p => (
                    <li key={p.other}>
                      <button type="button" className={ROW} aria-current={surah === null && ((g.surah === a && p.other === b) || (g.surah === b && p.other === a))}
                        onClick={() => go(pairHref(tab, g.surah, p.other, query))}>
                        <span className="flex-1">{`و${names[p.other]}`}</span>
                        <span className={COUNT}>{num(p.count)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
