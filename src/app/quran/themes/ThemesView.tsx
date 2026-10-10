import React from 'react';
import { AyahCard } from '@/components/quran/AyahCard';
import type { Ayah } from '@/types/quran';
import { num } from '@/lib/quran/arabicNumber';

type Span = { from: number; to: number };
type Theme = { theme: string; a: Span; b: Span };
type Side = { number: number; name: string; ayat: string[] };

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
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

export default function ThemesView({ a, b, themes }: { a: Side; b: Side; themes: Theme[] }) {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-4 text-gray-900 dark:text-gray-200">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl text-amber-600 dark:text-amber-400">{a.name} ↔ {b.name}</h1>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">مواضع متقابلة بحسب الموضوع لا بحسب الألفاظ ({num(themes.length)} موضعًا).</p>
      {themes.map((row) => (
        <section key={`${row.a.from}-${row.b.from}-${row.theme}`} className={PANEL}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h2 className="text-lg text-amber-600 dark:text-amber-400">{row.theme}</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">{a.name} {span(row.a)} · {b.name} {span(row.b)}</span>
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
