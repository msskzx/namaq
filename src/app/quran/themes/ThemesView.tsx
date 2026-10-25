'use client';

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { type SpreadPage } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE } from '../panel';

type Span = { from: number; to: number };
type Theme = { theme: string; a: Span; b: Span };
type Side = { number: number; name: string; ayat: string[] };

const span = (r: Span) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);

function passage(side: Side, range: Span, ar: boolean): SpreadPage {
  return {
    title: side.name,
    subtitle: `${ar ? (range.from === range.to ? 'الآية' : 'الآيات') : (range.from === range.to ? 'Ayah' : 'Ayat')} ${span(range)}`,
    label: `${side.name} ${span(range)}`,
    rows: [Array.from({ length: range.to - range.from + 1 }, (_, k) => {
      const number = range.from + k;
      return { number, words: side.ayat[number - 1].split(' ') };
    })],
  };
}

export default function ThemesView({ a, b, themes, controls, level = 1 }: { a: Side; b: Side; themes: Theme[]; controls?: React.ReactNode; level?: 1 | 2 }) {
  const ar = useLanguage().language === 'ar';
  const Title = level === 1 ? 'h1' : 'h2';
  const Row = level === 1 ? 'h2' : 'h3';
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="flex flex-col gap-4 text-[var(--home-ink)]">
      <header className="flex flex-col gap-2">
        <Title className="text-3xl text-[var(--home-accent)]">{a.name} {ar ? 'و' : 'and'}{ar ? '' : ' '}{b.name}</Title>
        <p className={NOTE}>
          {themes.length === 0
            ? (ar ? 'لا مواضع متقابلة مسجلة بين هاتين السورتين.' : 'No shared topics are recorded for these two surahs.')
            : (ar ? `مواضع متقابلة بحسب الموضوع لا بحسب الألفاظ (${num(themes.length)} موضعًا).` : `Passages grouped by shared topic, not wording (${themes.length}).`)}
        </p>
      </header>
      {controls}
      {themes.map((row) => (
        <section key={`${row.a.from}-${row.b.from}-${row.theme}`} aria-label={row.theme} className="flex flex-col gap-3">
          <Row className="text-xl text-[var(--home-accent)]" dir="rtl" lang="ar">{row.theme}</Row>
          <PageSpread stackOnMobile pages={[passage(a, row.a, ar), passage(b, row.b, ar)]} />
        </section>
      ))}
    </div>
  );
}
