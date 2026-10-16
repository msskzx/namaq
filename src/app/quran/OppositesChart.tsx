'use client';

// docs/plans/quran-repetition-merge.md
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import { normalizeWord } from '@/lib/quran/normalize';
import { NOTE, PANEL } from './RepetitionView';
import { LINK, SEARCH, SUGGESTIONS } from './WordCounts';

type Pair = [CountedSide, CountedSide];

function SideLabel({ side }: { side: CountedSide }) {
  return (
    <span className="min-w-0">
      <span className="block text-lg font-arabic">{side.label}</span>
      <span className={`${NOTE} block text-xs`}>{side.form ? `صيغة «${side.label}» وحدها من «${side.lemma}»` : `مدخل «${side.lemma}»`}</span>
    </span>
  );
}

export default function OppositesChart({ opposites, lemmas }: { opposites: Pair[]; lemmas: LemmaCount[] }) {
  const [pairs, setPairs] = useState<Pair[]>(opposites);
  const [first, setFirst] = useState<CountedSide | null>(null);
  const [query, setQuery] = useState('');
  const ranked = useMemo(() => lemmas.map(([lemma, count], i) => ({ lemma, count, rank: i, key: normalizeWord(lemma) })), [lemmas]);
  const needle = normalizeWord(query.trim());
  const suggestions = needle ? ranked.filter(r => r.key.includes(needle)).slice(0, SUGGESTIONS) : [];
  const pick = (r: (typeof ranked)[number]) => {
    const side: CountedSide = { label: r.lemma, lemma: r.lemma, form: false, count: r.count };
    if (first) {
      setPairs([...pairs, [first, side]]);
      setFirst(null);
    } else setFirst(side);
    setQuery('');
  };

  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">كلمات متقابلة</h2>
      <p className={`${NOTE} mb-3`}>
        الأزواج من اختيارنا، ولم يراجعها أحد من أهل العلم. يُعدّ كل طرف بمدخله المعجمي من المدوّنة القرآنية العربية، أو بصيغة واحدة منه حيث يُذكر ذلك تحته. العدّ للفظ لا للمعنى: «الجنة» تشمل جنات الدنيا، و«النار» كل نار. لكل زوج مقياسه، فالطول يقارن بين طرفي الزوج وحده.{' '}
        <Link href="/attributions#quranic-arabic-corpus" className={LINK}>طريقة العدّ ومصدره في صفحة العزو</Link>.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Button size="sm" onClick={() => setPairs([])} disabled={pairs.length === 0}>
          <FontAwesomeIcon icon={faXmark} />
          إفراغ الرسم
        </Button>
        <Button size="sm" onClick={() => setPairs(opposites)}>
          <FontAwesomeIcon icon={faRotateLeft} />
          أزواجنا
        </Button>
      </div>
      {first && (
        <p className="flex flex-wrap items-center gap-2 mb-2 text-sm" aria-live="polite">
          {`الطرف الأول: ${first.label}. اختر مقابله.`}
          <Button size="sm" onClick={() => setFirst(null)}>
            <FontAwesomeIcon icon={faXmark} />
            إلغاء
          </Button>
        </p>
      )}
      <label className="relative block">
        <span className="sr-only">{first ? 'اختر الكلمة المقابلة' : 'أضف زوجًا: اختر الكلمة الأولى'}</span>
        <FontAwesomeIcon icon={faPlus} className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={first ? 'اختر الكلمة المقابلة' : 'أضف زوجًا: اختر الكلمة الأولى'}
          onKeyDown={e => { if (e.key === 'Enter' && suggestions[0]) pick(suggestions[0]); }} className={SEARCH} />
      </label>
      {needle && (
        <ul aria-label="كلمات مقترحة" className="mt-1 flex flex-col rounded border border-gray-200 dark:border-white/10">
          {suggestions.length === 0 ? <li className={`${NOTE} px-2 py-1`}>لا كلمة تطابق البحث.</li> : suggestions.map(r => (
            <li key={r.rank}>
              <button type="button" onClick={() => pick(r)} className="w-full flex items-baseline gap-2 px-2 py-1 text-start hover:bg-gray-100 dark:hover:bg-white/10">
                <span className="flex-1 text-lg font-arabic">{r.lemma}</span>
                <span className="text-gray-700 dark:text-gray-300">{num(r.count)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {pairs.length === 0 ? <p className={`${NOTE} mt-3`}>الرسم فارغ. ابحث عن كلمتين لإضافة زوج.</p> : (
        <ol aria-label="أزواج الكلمات المتقابلة" className="mt-3 flex flex-col gap-2">
          {pairs.map(([a, b], i) => {
            const max = Math.max(1, a.count, b.count);
            return (
              <li key={i} title={`${a.label}: ${num(a.count)} · ${b.label}: ${num(b.count)}`}
                className="grid grid-cols-[minmax(4.5rem,auto)_2.5rem_1fr_1fr_2.5rem_minmax(4.5rem,auto)_auto] sm:grid-cols-[9rem_2.5rem_1fr_1fr_2.5rem_9rem_auto] items-center gap-x-1">
                <SideLabel side={a} />
                <span className="text-sm text-end text-gray-700 dark:text-gray-300">{num(a.count)}</span>
                <span className="flex justify-end"><span className="h-5 rounded-s bg-[#50808e]" style={{ width: `${(a.count / max) * 100}%` }} /></span>
                <span className="flex justify-start"><span className="h-5 rounded-e bg-[#DDD8C4] ring-1 ring-inset ring-black/15 dark:ring-0" style={{ width: `${(b.count / max) * 100}%` }} /></span>
                <span className="text-sm text-start text-gray-700 dark:text-gray-300">{num(b.count)}</span>
                <SideLabel side={b} />
                <Button size="icon" variant="outline" aria-label={`أزل زوج «${a.label}» و«${b.label}»`} onClick={() => setPairs(pairs.filter((_, k) => k !== i))}>
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
