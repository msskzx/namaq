'use client';

// docs/plans/quran-similar-ayat.md
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { compareHref } from '@/lib/quran/compare';
import { plainName } from '@/lib/quran/normalize';
import type { Mark, SimilarPair, Span } from '@/lib/quran/similar';
import { Card } from '../Card';
import { NOTE, PANEL } from '../panel';

export const VISIBLE = 20;

const range = ([, from, to]: Span) => (from === to ? num(from) : `${num(from)}–${num(to)}`);

function Side({ span, marks, ayat, names }: { span: Span; marks: Mark[]; ayat: Record<string, string>; names: Record<number, string> }) {
  const [surah, from, to] = span;
  const name = names[surah] ?? '';
  return (
    <div>
      <h3 className="text-lg mb-2 text-amber-600 dark:text-amber-400">{`${plainName(name)} ${range(span)}`}</h3>
      {Array.from({ length: to - from + 1 }, (_, k) => from + k).map(ayah => (
        <Card key={ayah} surah={{ number: surah, name, plain: plainName(name) }} ayah={ayah} text={ayat[`${surah}:${ayah}`] ?? ''}
          slots={Object.fromEntries(marks.filter(([at]) => at === ayah).map(([, word, kind]) => [word, kind]))} />
      ))}
    </div>
  );
}

export function SimilarList({ pairs, ayat, names, pair }: { pairs: SimilarPair[]; ayat: Record<string, string>; names: Record<number, string>; pair: boolean }) {
  const [all, setAll] = useState(false);
  const shown = all ? pairs : pairs.slice(0, VISIBLE);
  const title = pair ? 'آيات متشابهة بين السورتين' : `آيات متشابهة في ${plainName(names[pairs[0]?.a[0]] ?? '')}`;
  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">{pairs.length === 0 ? 'آيات متشابهة' : title}</h2>
      <p className={`${NOTE} mb-3`}>
        آيات تتقارب في المعنى أو في نظم الكلام أو تتطابق، كما يجمعها المتشابه اللفظي. تُقاس بالجذور والأدوات المشتركة وترتيبها. باللون <span className="text-amber-600 dark:text-amber-400">الأصفر</span> كلمة وردت بلفظها في الجانبين، وباللون <span className="text-sky-600 dark:text-sky-400">الأزرق</span> كلمة من جذر مشترك بلفظ مختلف. لم يراجع هذا العرض أحد من أهل العلم.
      </p>
      {pairs.length === 0 ? <p className={NOTE}>{pair ? 'لا آيات متشابهة بين السورتين.' : 'لا آيات متشابهة في هذه السورة.'}</p> : (
        <ol className="flex flex-col gap-6">
          {shown.map(p => (
            <li key={`${p.a.join()}|${p.b.join()}`} className="border-t border-gray-200 dark:border-white/10 pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge size="sm" color="gray" text={`تقارب ${num(Math.round(p.score * 100))}٪`} />
                {p.roots.map(r => <Badge key={r} size="sm" color="gray" text={r} />)}
                <Button size="sm" href={`${compareHref(p.a[0], { from: p.a[1], to: p.a[2] }, p.b[0], { from: p.b[1], to: p.b[2] })}&view=ayat`}>
                  <FontAwesomeIcon icon={faCodeCompare} />
                  آية بآية
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Side span={p.a} marks={p.marksA} ayat={ayat} names={names} />
                <Side span={p.b} marks={p.marksB} ayat={ayat} names={names} />
              </div>
            </li>
          ))}
        </ol>
      )}
      {pairs.length > VISIBLE && !all && (
        <Button size="sm" className="mt-3" onClick={() => setAll(true)}>
          <FontAwesomeIcon icon={faAnglesDown} />
          {`عرض الباقي (${num(pairs.length - VISIBLE)})`}
        </Button>
      )}
    </section>
  );
}
