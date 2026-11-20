'use client';

// docs/plans/quran-repetition-merge.md
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import { normalizeWord } from '@shared/quran/normalize';
import { NOTE, PANEL } from '../panel';
import { SUGGESTIONS } from './WordCounts';
import { SearchField } from '@/components/common/Field';
import Empty from '@/components/common/Empty';
import { QuranWord } from '@/components/quran/text/AyahFlow';

type Pair = [CountedSide, CountedSide];

function SideLabel({ side, className }: { side: CountedSide; className: string }) {
  return (
    <span className={`min-w-0 ${className}`}>
      <QuranWord className="block">{side.label}</QuranWord>
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
        الأزواج من اختيارنا، ولم يراجعها أحد من أهل العلم. يُعدّ كل طرف بمدخله المعجمي من المدوّنة القرآنية العربية، أو بصيغة واحدة منه حيث يُذكر ذلك تحته. العدّ للفظ لا للمعنى: «الجنة» تشمل جنات الدنيا، و«النار» كل نار. لكل زوج مقياسه، فالطول يقارن بين طرفي الزوج وحده.
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
      <p role="status" className={first ? 'flex flex-wrap items-center gap-2 mb-2 text-sm' : 'sr-only'}>
        {first && `الطرف الأول: ${first.label}. اختر مقابله.`}
        {first && (
          <Button size="sm" onClick={() => setFirst(null)}>
            <FontAwesomeIcon icon={faXmark} />
            إلغاء
          </Button>
        )}
      </p>
      <SearchField label={first ? 'اختر الكلمة المقابلة' : 'أضف زوجًا: اختر الكلمة الأولى'} placeholder={first ? 'اختر الكلمة المقابلة' : 'أضف زوجًا: اختر الكلمة الأولى'} value={query} onChangeText={setQuery}
        onKeyDown={e => { if (e.key === 'Enter' && suggestions[0]) pick(suggestions[0]); }} />
      {needle && (
        <ul aria-label="كلمات مقترحة" className="mt-1 flex flex-col rounded border border-[var(--home-rule)]">
          {suggestions.length === 0 ? <li className={`${NOTE} px-2 py-1`}>لا كلمة تطابق البحث.</li> : suggestions.map(r => (
            <li key={r.rank}>
              <button type="button" onClick={() => pick(r)} className="w-full flex items-baseline gap-2 px-2 py-1 text-start hover:bg-[var(--home-paper-deep)]">
                <QuranWord className="flex-1">{r.lemma}</QuranWord>
                <span className="text-[var(--home-muted)]">{num(r.count)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {pairs.length === 0 ? <Empty text="الرسم فارغ. ابحث عن كلمتين لإضافة زوج." /> : (
        <ol aria-label="أزواج الكلمات المتقابلة" className="mt-3 flex flex-col gap-2">
          {pairs.map(([a, b], i) => {
            const max = Math.max(1, a.count, b.count);
            return (
              <li key={i} title={`${a.label}: ${num(a.count)} · ${b.label}: ${num(b.count)}`}
                className="grid grid-cols-[2.5rem_1fr_1fr_2.5rem_auto] sm:grid-cols-[9rem_2.5rem_1fr_1fr_2.5rem_9rem_auto] items-center gap-x-1">
                <SideLabel side={a} className="col-span-2 row-start-1 sm:col-span-1" />
                <span className="row-start-2 sm:row-start-1 text-sm text-end text-[var(--home-muted)]">{num(a.count)}</span>
                <span className="row-start-2 sm:row-start-1 flex justify-end"><span className="h-5 rounded-s bg-[#50808e]" style={{ width: `${(a.count / max) * 100}%` }} /></span>
                <span className="row-start-2 sm:row-start-1 flex justify-start"><span className="h-5 rounded-e bg-[#DDD8C4] ring-1 ring-inset ring-black/15 dark:ring-0" style={{ width: `${(b.count / max) * 100}%` }} /></span>
                <span className="row-start-2 sm:row-start-1 text-sm text-start text-[var(--home-muted)]">{num(b.count)}</span>
                <SideLabel side={b} className="col-start-3 col-span-2 row-start-1 text-end sm:col-start-6 sm:col-span-1 sm:text-start" />
                <Button size="icon" className="col-start-5 row-start-1 row-span-2 sm:col-start-7 sm:row-span-1" variant="outline" aria-label={`أزل زوج «${a.label}» و«${b.label}»`} onClick={() => setPairs(pairs.filter((_, k) => k !== i))}>
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
