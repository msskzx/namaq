'use client';

// docs/plans/quran-repetition-merge.md
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import type { LemmaCounts } from '@/lib/quran/lemmas';
import { normalizeWord } from '@/lib/quran/normalize';
import { NOTE, PANEL } from './RepetitionView';

export const CHART_TOP = 10;
export const SUGGESTIONS = 8;
export const SEARCH = 'w-full rounded border border-amber-400 bg-transparent py-2 ps-9 pe-3 text-gray-900 dark:text-gray-100';
export const LINK = 'text-amber-700 dark:text-amber-300 underline';
const BAR = 'bg-[#50808e]';

type Ranked = { word: string; count: number; root: string; rank: number; key: string };

export default function WordCounts({ lemmas }: Pick<LemmaCounts, 'lemmas'>) {
  const ranked = useMemo<Ranked[]>(() => lemmas.map(([word, count, root], i) => ({ word, count, root, rank: i + 1, key: normalizeWord(word) })), [lemmas]);
  const top = () => ranked.slice(0, CHART_TOP).map(r => r.rank);
  const [chosen, setChosen] = useState<number[]>(top);
  const [query, setQuery] = useState('');
  const bars = ranked.filter(r => chosen.includes(r.rank));
  const max = Math.max(1, ...bars.map(b => b.count));
  const needle = normalizeWord(query.trim());
  const suggestions = needle ? ranked.filter(r => r.key.includes(needle) && !chosen.includes(r.rank)).slice(0, SUGGESTIONS) : [];
  const add = (rank: number) => { setChosen([...chosen, rank]); setQuery(''); };

  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">عدد مرات ورود كل كلمة</h2>
      <p className={`${NOTE} mb-3`}>
        تُعدّ الكلمة بمدخلها المعجمي من المدوّنة القرآنية العربية، فـ«والله» و«لله» تحت «ٱللَّه». <Link href="/attributions#quranic-arabic-corpus" className={LINK}>طريقة العدّ ومصدره في صفحة العزو</Link>.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Button size="sm" onClick={() => setChosen([])} disabled={chosen.length === 0}>
          <FontAwesomeIcon icon={faXmark} />
          إفراغ الرسم
        </Button>
        <Button size="sm" onClick={() => setChosen(top())}>
          <FontAwesomeIcon icon={faRotateLeft} />
          {`أكثر ${num(CHART_TOP)} كلمات ورودًا`}
        </Button>
      </div>
      <label className="relative block">
        <span className="sr-only">أضف كلمة إلى الرسم</span>
        <FontAwesomeIcon icon={faPlus} className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="أضف كلمة إلى الرسم"
          onKeyDown={e => { if (e.key === 'Enter' && suggestions[0]) add(suggestions[0].rank); }} className={SEARCH} />
      </label>
      {needle && (
        <ul aria-label="كلمات مقترحة" className="mt-1 flex flex-col rounded border border-gray-200 dark:border-white/10">
          {suggestions.length === 0 ? <li className={`${NOTE} px-2 py-1`}>لا كلمة تطابق البحث.</li> : suggestions.map(r => (
            <li key={r.rank}>
              <button type="button" onClick={() => add(r.rank)} className="w-full flex items-baseline gap-2 px-2 py-1 text-start hover:bg-amber-100 dark:hover:bg-white/10">
                <span className="text-lg font-arabic">{r.word}</span>
                <span className={`${NOTE} flex-1`}>{r.root}</span>
                <span className="text-amber-700 dark:text-amber-300">{num(r.count)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {bars.length === 0 ? <p className={`${NOTE} mt-3`}>الرسم فارغ. ابحث عن كلمة لإضافتها.</p> : (
        <ol aria-label="عدد مرات ورود الكلمات المختارة" className="mt-3 flex flex-col gap-0.5">
          {bars.map(b => (
            <li key={b.rank} className="grid grid-cols-[6rem_1fr_3.5rem_auto] sm:grid-cols-[8rem_1fr_4rem_auto] items-center gap-2" title={`${b.word}: ${num(b.count)}`}>
              <span className="text-lg font-arabic truncate">{b.word}</span>
              <span className={`h-5 rounded-e ${BAR}`} style={{ width: `${(b.count / max) * 100}%` }} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{num(b.count)}</span>
              <Button size="icon" variant="outline" aria-label={`أزل «${b.word}» من الرسم`} onClick={() => setChosen(chosen.filter(rank => rank !== b.rank))}>
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
