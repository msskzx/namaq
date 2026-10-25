'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { surahMatch } from '@/lib/quran/surahSearch';
import { useLanguage } from '@/components/language/LanguageContext';
import { FIELD, NOTE } from '../panel';

const ROW = 'flex items-baseline gap-2 rounded px-2 py-1 hover:bg-[color-mix(in_srgb,var(--home-accent)_10%,transparent)] aria-[current=page]:bg-[color-mix(in_srgb,var(--home-accent)_16%,transparent)] aria-[current=page]:font-semibold';

export default function SurahPane({ counts, total, names, surah, juz, view }: { counts: Record<number, number>; total: number; names: Record<number, string>; surah?: number; juz: JuzRange | null; view: BranchesView }) {
  const [search, setSearch] = useState('');
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (box && row && !search) box.scrollTop = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - box.clientHeight / 3;
  }, [surah, search]);
  const { language } = useLanguage();
  const ar = language === 'ar';
  const label = ar ? 'ابحث عن سورة' : 'Find a surah';
  const href = (next?: number) => branchesHref('', juz ?? undefined, { ...view, page: 1, surah: next });
  const shown = Object.keys(names).map(Number).sort((a, b) => a - b).filter(n => surahMatch(search, n, names[n]) !== null);
  return (
    <>
      <p className={NOTE}>{ar ? 'كل سورة بعدد أشجارها. اختر سورة لترى الأشجار التي فيها آية منها.' : 'Each surah with its number of trees. Pick one to see the trees with an ayah from it.'}</p>
      <label className="relative">
        <Search size={14} aria-hidden className="absolute start-2.5 top-1/2 -translate-y-1/2 text-[var(--home-muted)]" />
        <input type="search" aria-label={label} placeholder={ar ? 'ابحث عن سورة بالاسم أو الرقم' : 'Find a surah by name or number'} value={search} onChange={e => setSearch(e.target.value)} className={`${FIELD} w-full ps-8`} />
      </label>
      <ul ref={list} className="flex flex-col max-h-[min(75vh,48rem)] overflow-y-auto">
        {!search && <li className="border-b border-[var(--home-rule)] pb-1 mb-1">
          <Link href={href()} aria-current={!surah ? 'page' : undefined} className={ROW}><span className="flex-1">{ar ? 'كل السور' : 'All surahs'}</span><span className="text-[var(--home-accent)] tabular-nums">{num(total)}</span></Link>
        </li>}
        {shown.map(n => <li key={n}>
          {counts[n] ? <Link href={href(n)} aria-current={surah === n ? 'page' : undefined} className={ROW}>
            <span className={`${NOTE} w-7 shrink-0 tabular-nums`}>{num(n)}</span>
            <span className="flex-1">{names[n]}</span>
            <span className="text-[var(--home-accent)] tabular-nums">{num(counts[n])}</span>
          </Link> : <span className={`${ROW} text-[var(--home-muted)]`}>
            <span className="w-7 shrink-0 tabular-nums">{num(n)}</span>
            <span className="flex-1">{names[n]}</span>
            <span className="tabular-nums">{num(0)}</span>
          </span>}
        </li>)}
        {shown.length === 0 && <li className={NOTE}>{ar ? 'لا سورة بهذا الاسم.' : 'No surah by that name.'}</li>}
      </ul>
    </>
  );
}
