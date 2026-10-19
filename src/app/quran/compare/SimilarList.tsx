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
import PageSpread, { MatchLegend, type SpreadMark, type SpreadPage } from '@/components/quran/PageSpread';
import { SAME_ROOT, SAME_WORD, type Mark, type SimilarPair, type Span } from '@/lib/quran/similar';
import type { Passage } from '@/lib/quran/passages';
import { NOTE, PANEL } from '../panel';
import { useRepetition } from './Repetition';

export const VISIBLE = 20;

const range = ([, from, to]: Span) => (from === to ? num(from) : `${num(from)}–${num(to)}`);

const meets = ([surah, from, to]: Span, side: Passage['a']) => surah === side.from.surah && from <= side.to.ayah && to >= side.from.ayah;

export function passageOf(p: SimilarPair, passages: Passage[]) {
  return passages.filter(x => (meets(p.a, x.a) && meets(p.b, x.b)) || (meets(p.a, x.b) && meets(p.b, x.a))).sort((x, y) => y.matched - x.matched)[0];
}

function marksFor(marks: Mark[], ayah: number, other: Mark[], otherSpan: Span, ayat: Record<string, string>, names: Record<number, string>): Record<number, SpreadMark> {
  const [surah] = otherSpan;
  const word = ([at, index]: Mark) => (ayat[`${surah}:${at}`] ?? '').split(' ')[index] ?? '';
  return Object.fromEntries(marks.filter(([at]) => at === ayah).map(([, index, kind, key]) => {
    const partners = key ? other.filter(m => m[3] === key) : [];
    const title = key ? `يقابلها: ${partners.map(m => `${word(m)} (${plainName(names[surah] ?? '')} ${num(m[0])})`).join('، ')}` : undefined;
    return [index, { kind: kind === SAME_ROOT ? 'root' : 'exact', title, linked: kind === SAME_WORD && partners.some(m => m[2] === SAME_ROOT) }];
  }));
}

function page(span: Span, marks: Mark[], other: Mark[], otherSpan: Span, ayat: Record<string, string>, names: Record<number, string>): SpreadPage {
  const [surah, from, to] = span;
  const name = names[surah] ?? '';
  return {
    title: name,
    subtitle: `${from === to ? 'الآية' : 'الآيات'} ${range(span)}`,
    label: `${plainName(name)} ${range(span)}`,
    rows: [Array.from({ length: to - from + 1 }, (_, k) => from + k).map(ayah => ({
      number: ayah,
      words: (ayat[`${surah}:${ayah}`] ?? '').split(' '),
      marks: marksFor(marks, ayah, other, otherSpan, ayat, names),
    }))],
  };
}

export function SimilarList({ pairs, ayat, names, pair }: { pairs: SimilarPair[]; ayat: Record<string, string>; names: Record<number, string>; pair: boolean }) {
  const [all, setAll] = useState(false);
  const passages = useRepetition()?.passages ?? [];
  const shown = all ? pairs : pairs.slice(0, VISIBLE);
  const title = pair ? 'آيات متشابهة بين السورتين' : `آيات متشابهة في ${plainName(names[pairs[0]?.a[0]] ?? '')}`;
  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">{pairs.length === 0 ? 'آيات متشابهة' : title}</h2>
      <p className={`${NOTE} mb-3`}>
        آيات تتقارب في المعنى أو في نظم الكلام أو تتطابق، كما يجمعها المتشابه اللفظي. تُقاس بالجذور والأدوات المشتركة وترتيبها. بلون كلمة وردت بلفظها في الجانبين، وبلون آخر كلمة من جذر مشترك بلفظ مختلف، ويُسطَّر بنقاط ما يقابل كلمة من جذر مشترك في الجانب الآخر. مرّر المؤشر على كلمة لترى ما يقابلها. لم يراجع هذا العرض أحد من أهل العلم.
      </p>
      <MatchLegend exact="كلمة وردت بلفظها في الجانبين" root="كلمة من جذر مشترك بلفظ مختلف" />
      {pairs.length === 0 ? <p className={NOTE}>{pair ? 'لا آيات متشابهة بين السورتين.' : 'لا آيات متشابهة في هذه السورة.'}</p> : (
        <ol className="flex flex-col gap-6">
          {shown.map(p => {
            const run = passageOf(p, passages);
            return (
            <li key={`${p.a.join()}|${p.b.join()}`} className="border-t border-gray-200 dark:border-white/10 pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge size="sm" color="gray" text={`تقارب ${num(Math.round(p.score * 100))}٪`} />
                {run && <Badge size="sm" color="amber" text={`نص مشترك: ${num(run.matched)} كلمة`} />}
                {run && run.places > 2 && <Badge size="sm" color="amber" text={`يرد في ${num(run.places)} مواضع`} />}
                {p.roots.map(r => <Badge key={r} size="sm" color="gray" text={r} />)}
                <Button size="sm" href={`${compareHref(p.a[0], { from: p.a[1], to: p.a[2] }, p.b[0], { from: p.b[1], to: p.b[2] })}&view=ayat`}>
                  <FontAwesomeIcon icon={faCodeCompare} />
                  آية بآية
                </Button>
              </div>
              <PageSpread pages={[page(p.a, p.marksA, p.marksB, p.b, ayat, names), page(p.b, p.marksB, p.marksA, p.a, ayat, names)]} />
            </li>
            );
          })}
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
