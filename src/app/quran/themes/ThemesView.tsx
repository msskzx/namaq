'use client';

import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE, PANEL } from '../panel';

type Span = { from: number; to: number };
type Theme = { theme: string; a: Span; b: Span };
type Side = { number: number; name: string; ayat: string[] };
const span = (r: Span) => r.from === r.to ? num(r.from) : `${num(r.from)}–${num(r.to)}`;

export default function ThemesView({ a, b, themes }: { a: Side; b: Side; themes: Theme[] }) {
  const ar = useLanguage().language === 'ar';
  const page = (side: Side, range: Span) => ({
    title: side.name,
    subtitle: `${ar ? 'الآيات' : 'Ayat'} ${span(range)}`,
    label: `${side.name} ${span(range)}`,
    rows: [Array.from({ length: range.to - range.from + 1 }, (_, k) => ({ number: range.from + k, words: side.ayat[range.from + k - 1].split(' ') }))],
  });
  return <div dir={ar ? 'rtl' : 'ltr'} className="flex flex-col gap-4 text-[var(--home-ink)]">
    <h1 className="text-2xl" dir="rtl">{a.name} ↔ {b.name}</h1>
    <p className={NOTE}>{themes.length === 0
      ? (ar ? 'لا مواضع متقابلة مسجلة بين هاتين السورتين.' : 'No corresponding topic passages are recorded for these surahs.')
      : (ar ? `مواضع متقابلة بحسب الموضوع لا بحسب الألفاظ (${num(themes.length)} موضعًا).` : `${themes.length} corresponding passages grouped by topic rather than wording.`)}</p>
    {themes.map(row => <section key={`${row.a.from}-${row.b.from}-${row.theme}`} className={PANEL}>
      <h2 className="text-lg mb-3" dir="rtl">{row.theme}</h2>
      <PageSpread pages={[page(a, row.a), page(b, row.b)]} />
    </section>)}
  </div>;
}
