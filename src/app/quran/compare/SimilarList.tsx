'use client';

// docs/plans/quran-similar-ayat.md
import React, { useState } from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import { ChevronsDown, ArrowLeftRight } from 'lucide-react';
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

function marksFor(marks: Mark[], ayah: number, other: Mark[], otherSpan: Span, ayat: Record<string, string>, names: Record<number, string>, ar: boolean): Record<number, SpreadMark> {
  const [surah] = otherSpan;
  const word = ([at, index]: Mark) => (ayat[`${surah}:${at}`] ?? '').split(' ')[index] ?? '';
  return Object.fromEntries(marks.filter(([at]) => at === ayah).map(([, index, kind, key]) => {
    const partners = key ? other.filter(m => m[3] === key) : [];
    const partnerTitle = key ? `${ar ? 'يقابلها' : 'Corresponds to'}: ${partners.map(m => `${word(m)} (${plainName(names[surah] ?? '')} ${num(m[0])})`).join('، ')}` : undefined;
    const title = kind === SAME_ROOT ? `${ar ? 'من جذر مشترك بلفظ مختلف' : 'Same root, different wording'}${partnerTitle ? ` · ${partnerTitle}` : ''}` : partnerTitle;
    return [index, { kind: kind === SAME_ROOT ? 'root' : 'exact', title, linked: kind === SAME_WORD && partners.some(m => m[2] === SAME_ROOT) }];
  }));
}

function page(span: Span, marks: Mark[], other: Mark[], otherSpan: Span, ayat: Record<string, string>, names: Record<number, string>, ar: boolean): SpreadPage {
  const [surah, from, to] = span;
  const name = names[surah] ?? '';
  return {
    title: name,
    subtitle: `${ar ? (from === to ? 'الآية' : 'الآيات') : (from === to ? 'Ayah' : 'Ayat')} ${range(span)}`,
    label: `${plainName(name)} ${range(span)}`,
    rows: [Array.from({ length: to - from + 1 }, (_, k) => from + k).map(ayah => ({
      number: ayah,
      words: (ayat[`${surah}:${ayah}`] ?? '').split(' '),
      marks: marksFor(marks, ayah, other, otherSpan, ayat, names, ar),
    }))],
  };
}

export function SimilarList({ pairs, ayat, names, pair }: { pairs: SimilarPair[]; ayat: Record<string, string>; names: Record<number, string>; pair: boolean }) {
  const ar = useLanguage().language === 'ar';
  const [all, setAll] = useState(false);
  const passages = useRepetition()?.passages ?? [];
  const shown = all ? pairs : pairs.slice(0, VISIBLE);
  const title = pair ? (ar ? 'آيات متشابهة بين السورتين' : 'Similar ayat between these surahs') : (ar ? `آيات متشابهة في ${plainName(names[pairs[0]?.a[0]] ?? '')}` : `Similar ayat in ${plainName(names[pairs[0]?.a[0]] ?? '')}`);
  return (
    <section dir={ar ? 'rtl' : 'ltr'} className={PANEL}>
      <h2 className="text-2xl mb-1">{pairs.length === 0 ? (ar ? 'آيات متشابهة' : 'Similar ayat') : title}</h2>
      <p className={`${NOTE} mb-3`}>{ar ? 'لم يراجع هذا العرض أحد من أهل العلم.' : 'This display has not been reviewed by a scholar.'}</p>
      <details className="mb-3">
        <summary className={`cursor-pointer ${NOTE}`}>{ar ? 'عن المطابقة والألوان' : 'About matching and highlights'}</summary>
        <p className={`${NOTE} mt-2`}>{ar ? 'آيات تتقارب في المعنى أو في نظم الكلام أو تتطابق، كما يجمعها المتشابه اللفظي. تُقاس بالجذور والأدوات المشتركة وترتيبها. مرّر المؤشر على كلمة لترى ما يقابلها. يُسطَّر بنقاط ما يقابل كلمة من جذر مشترك في الجانب الآخر.' : 'Matches are estimated from shared roots, particles and their order. Hover over a word to see its counterparts. Dotted underlines identify a counterpart with the same root and different wording.'}</p>
      </details>
      <MatchLegend exact={ar ? 'كلمة وردت بلفظها في الجانبين' : 'Same word on both sides'} root={ar ? 'كلمة من جذر مشترك بلفظ مختلف' : 'Same root, different wording'} />
      {pairs.length === 0 ? <p className={NOTE}>{pair ? (ar ? 'لا آيات متشابهة بين السورتين.' : 'No similar ayat between these surahs.') : (ar ? 'لا آيات متشابهة في هذه السورة.' : 'No similar ayat in this surah.')}</p> : (
        <ol className="flex flex-col gap-6">
          {shown.map(p => {
            const run = passageOf(p, passages);
            return (
            <li key={`${p.a.join()}|${p.b.join()}`} className="border-t border-[var(--home-rule)] pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge size="sm" color="gray" text={ar ? `تقارب ${num(Math.round(p.score * 100))}٪` : `${Math.round(p.score * 100)}% similarity`} />
                {run && <Badge size="sm" color="amber" text={ar ? `نص مشترك: ${num(run.matched)} كلمة` : `Shared text: ${run.matched} words`} />}
                {run && run.places > 2 && <Badge size="sm" color="amber" text={ar ? `يرد في ${num(run.places)} مواضع` : `${run.places} occurrences`} />}
                {p.roots.map(r => <Badge key={r} size="sm" color="gray" text={r} />)}
                <Button size="sm" href={`${compareHref(p.a[0], { from: p.a[1], to: p.a[2] }, p.b[0], { from: p.b[1], to: p.b[2] })}&view=ayat`}>
                  <ArrowLeftRight size={16} aria-hidden />
                  {ar ? 'آية بآية' : 'Ayah by ayah'}
                </Button>
              </div>
              <PageSpread pages={[page(p.a, p.marksA, p.marksB, p.b, ayat, names, ar), page(p.b, p.marksB, p.marksA, p.a, ayat, names, ar)]} />
            </li>
            );
          })}
        </ol>
      )}
      {pairs.length > VISIBLE && !all && (
        <Button size="sm" className="mt-3" onClick={() => setAll(true)}>
          <ChevronsDown size={16} aria-hidden />
          {ar ? `عرض الباقي (${num(pairs.length - VISIBLE)})` : `Show the rest (${pairs.length - VISIBLE})`}
        </Button>
      )}
    </section>
  );
}
