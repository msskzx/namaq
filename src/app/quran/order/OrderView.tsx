'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import type { Surah } from '@/lib/quran/curatedShifts';
import type { HopView } from '@/lib/quran/surahOrder';
import { Card } from '../shifts/ShiftsView';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

function Hop({ item: { hop, from, to, tail, head, words }, label }: { item: HopView; label: (s: Surah) => string }) {
  return (
    <details id={`hop-${hop.from}`} className={PANEL}>
      <summary className="cursor-pointer text-xl text-amber-600 dark:text-amber-400 flex flex-wrap items-center gap-3">
        <span>{label(from)}</span>
        <FontAwesomeIcon icon={faArrowDown} aria-label="يليها" />
        <span>{label(to)}</span>
      </summary>
      <p className="my-3">{hop.note}</p>
      {words.length > 0 && <p className={`${NOTE} mb-3`}>{`كلمات مشتركة: ${words.join('، ')}`}</p>}
      <div className="grid md:grid-cols-2 gap-x-4">
        <div>{tail.map(l => <Card key={l.ayah} surah={from} ayah={l.ayah} text={l.text} slots={l.slots} />)}</div>
        <div>{head.map(l => <Card key={l.ayah} surah={to} ayah={l.ayah} text={l.text} slots={l.slots} />)}</div>
      </div>
      {hop.src.length > 0 ? (
        <ul className={NOTE} aria-label="المصادر">
          {hop.src.map(s => (
            <li key={s.url}>
              <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p className={NOTE}>بلا مصدر</p>
      )}
    </details>
  );
}

export default function OrderView({ chips, hops }: { chips: Surah[]; hops: HopView[] }) {
  const [hidden, setHidden] = useState(false);
  const [shown, setShown] = useState<Set<number>>(new Set());
  const reveal = (n: number) => setShown(prev => new Set(prev).add(n));
  const label = (s: Surah) => (hidden && !shown.has(s.number) ? num(s.number) : `${num(s.number)} ${s.plain}`);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Button size="sm" active={hidden} aria-pressed={hidden} onClick={() => { setHidden(!hidden); setShown(new Set()); }}>
          <FontAwesomeIcon icon={hidden ? faEye : faEyeSlash} />
          اخفِ الأسماء
        </Button>
      </div>
      <ol className={`${PANEL} flex flex-wrap gap-2`} aria-label="ترتيب السور">
        {chips.map(s => (
          <li key={s.number}>
            {hidden && !shown.has(s.number) ? (
              <button type="button" aria-label={`اكشف اسم السورة ${num(s.number)}`} onClick={() => reveal(s.number)}>
                <Badge text={num(s.number)} size="sm" color="gray" />
              </button>
            ) : (
              <Badge text={label(s)} size="sm" color="gray" href={hops.some(h => h.hop.from === s.number) ? `#hop-${s.number}` : undefined} />
            )}
          </li>
        ))}
      </ol>
      <p className={NOTE}>
        كل خطوة تصل آخر سورة بأول التي تليها. «بلا مصدر» تعني أن الربط قراءة لنص السورتين لم تُنسب إلى كتاب، وليس لها حجة غير النص. ويُلوَّن اللفظ المشترك في الآيتين بلون واحد، ويُذكر أيضًا في سطر مستقل.
      </p>
      {hops.map(h => <Hop key={h.hop.from} item={h} label={label} />)}
    </div>
  );
}
