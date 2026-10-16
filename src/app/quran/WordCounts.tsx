'use client';

// docs/plans/quran-repetition-merge.md
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { num } from '@/lib/quran/arabicNumber';
import type { LemmaCounts } from '@/lib/quran/lemmas';
import { normalizeWord } from '@/lib/quran/normalize';
import { NOTE, PANEL } from './RepetitionView';

export const WORDS_PAGE = 60;
export const CHART_TOP = 10;
const SUGGESTIONS = 8;
const SEARCH = 'w-full rounded border border-amber-400 bg-transparent py-2 ps-9 pe-3 text-gray-900 dark:text-gray-100';
const LINK = 'text-amber-700 dark:text-amber-300 underline';

type Ranked = { word: string; count: number; root: string; rank: number; key: string };

function WordChart({ ranked }: { ranked: Ranked[] }) {
  const top = () => ranked.slice(0, CHART_TOP).map(r => r.rank);
  const [chosen, setChosen] = useState<number[]>(top);
  const [query, setQuery] = useState('');
  const bars = ranked.filter(r => chosen.includes(r.rank));
  const max = Math.max(1, ...bars.map(b => b.count));
  const needle = normalizeWord(query.trim());
  const suggestions = needle ? ranked.filter(r => r.key.includes(needle) && !chosen.includes(r.rank)).slice(0, SUGGESTIONS) : [];
  const add = (rank: number) => { setChosen([...chosen, rank]); setQuery(''); };

  return (
    <div className="mb-6">
      <h3 className="text-xl mb-2">رسم الكلمات المختارة</h3>
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
              <span className="h-5 rounded-e bg-amber-400 dark:bg-amber-500" style={{ width: `${(b.count / max) * 100}%` }} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{num(b.count)}</span>
              <Button size="icon" variant="outline" aria-label={`أزل «${b.word}» من الرسم`} onClick={() => setChosen(chosen.filter(rank => rank !== b.rank))}>
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function WordCounts({ lemmas, unlemmatized }: LemmaCounts) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const ranked = useMemo<Ranked[]>(() => lemmas.map(([word, count, root], i) => ({ word, count, root, rank: i + 1, key: normalizeWord(word) })), [lemmas]);
  const total = useMemo(() => lemmas.reduce((n, [, count]) => n + count, 0), [lemmas]);
  const needle = normalizeWord(query.trim());
  const found = needle ? ranked.filter(r => r.key.includes(needle)) : ranked;
  const pages = Math.max(1, Math.ceil(found.length / WORDS_PAGE));
  const from = (page - 1) * WORDS_PAGE;
  const shown = found.slice(from, from + WORDS_PAGE);

  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">عدد مرات ورود كل كلمة</h2>
      <p className={`${NOTE} mb-2`}>
        تُعدّ الكلمة بمدخلها المعجمي كما حلّلتها المدوّنة القرآنية العربية (Quranic Arabic Corpus، الإصدار ٠٫٤)، فـ«والله» و«بالله» و«لله» كلها تحت «ٱللَّه»،
        ويُعدّ كل جزء من الكلمة له مدخل على حدة، فـ«مما» مرة لـ«مِن» ومرة لـ«مَا». التحليل من المدوّنة لا منّا، ولم يراجعه أحد من أهل العلم.
        {` لا مدخل في المدوّنة لـ${num(unlemmatized)} كلمة: الضمائر المنفصلة، وحروف الجر المتصلة بضمير مثل «لهم»، والحروف المقطّعة. `}
        المصدر: <a href="https://corpus.quran.com" className={LINK}>corpus.quran.com</a>، على نص <a href="https://tanzil.net" className={LINK}>Tanzil</a>.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge size="sm" color="gray" text={`${num(total)} موضعًا`} />
        <Badge size="sm" color="gray" text={`${num(lemmas.length)} مدخلًا`} />
      </div>
      <WordChart ranked={ranked} />
      <h3 className="text-xl mb-2">جدول الكلمات</h3>
      <label className="relative block mb-3">
        <span className="sr-only">ابحث عن كلمة</span>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="ابحث عن كلمة، بالتشكيل أو دونه" className={SEARCH} />
      </label>
      {found.length === 0 ? <p className={NOTE}>لا كلمة تطابق البحث.</p> : (
        <ol aria-label="جدول الكلمات" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4">
          {shown.map(r => (
            <li key={r.rank} className="flex items-baseline gap-2 px-2 py-1 border-b border-gray-200 dark:border-white/10">
              <span className={`${NOTE} w-10 shrink-0`}>{num(r.rank)}</span>
              <span className="text-lg font-arabic">{r.word}</span>
              <span className={`${NOTE} flex-1 text-xs`}>{r.root}</span>
              <span className="text-amber-700 dark:text-amber-300">{num(r.count)}</span>
            </li>
          ))}
        </ol>
      )}
      <Pagination page={page} pageCount={pages} onChange={setPage} summary={`${num(from + 1)}–${num(from + shown.length)} من ${num(found.length)}`} />
    </section>
  );
}
