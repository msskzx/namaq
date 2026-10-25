import React from 'react';
import { AyahCard } from '@/components/quran/AyahCard';
import type { Ayah } from '@/types/quran';
import { num } from '@/lib/quran/arabicNumber';

type Span = { from: number; to: number };
type Theme = { theme: string; a: Span; b: Span };
type Side = { number: number; name: string; ayat: string[] };

const PANEL = 'bg-[var(--home-paper-deep)] border border-[var(--home-rule)] rounded-lg p-4';
const NOTE = 'text-sm text-[var(--home-muted)]';
const span = (r: Span) => (r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`);

function Cards({ side, range }: { side: Side; range: Span }) {
  const surah = { id: `s${side.number}`, number: side.number, name: side.name, nameTransliterated: null };
  return (
    <div>
      {Array.from({ length: range.to - range.from + 1 }, (_, k) => range.from + k).map((n) => (
        <AyahCard key={n} ayah={{ id: `${side.number}:${n}`, number: n, text: side.ayat[n - 1], surah } as unknown as Ayah} />
      ))}
    </div>
  );
}

export default function ThemesView({ a, b, themes, controls, level = 1 }: { a: Side; b: Side; themes: Theme[]; controls?: React.ReactNode; level?: 1 | 2 }) {
  const Title = level === 1 ? 'h1' : 'h2';
  const Row = level === 1 ? 'h2' : 'h3';
  return (
    <div dir="rtl" className="flex flex-col gap-4 text-[var(--home-ink)]">
      <div className="flex flex-wrap items-center gap-2">
        <Title className="text-3xl text-[var(--home-accent)]">{a.name} ↔ {b.name}</Title>
      </div>
      <p className={NOTE}>
        {themes.length === 0 ? 'لا مواضع متقابلة مسجلة بين هاتين السورتين.' : `مواضع متقابلة بحسب الموضوع لا بحسب الألفاظ (${num(themes.length)} موضعًا).`}
      </p>
      {controls}
      {themes.map((row) => (
        <section key={`${row.a.from}-${row.b.from}-${row.theme}`} className={PANEL}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Row className="text-lg text-[var(--home-accent)]">{row.theme}</Row>
            <span className={NOTE}>{a.name} {span(row.a)} · {b.name} {span(row.b)}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Cards side={a} range={row.a} />
            <Cards side={b} range={row.b} />
          </div>
        </section>
      ))}
    </div>
  );
}
