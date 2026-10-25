import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import TextCompare from './TextCompare';
import ThemesCompare from './ThemesCompare';
import CompareControls from './CompareControls';
import CompareLayout from './CompareLayout';
import { modeHref, type CompareTab } from './modeHref';
import { RepetitionProvider, SurahRepetition } from './Repetition';
import SimilarAyat, { similarSurahPairs } from './SimilarAyat';
import { SurahPairs } from './SurahPairs';
import { prisma } from '@/lib/prisma';
import { num } from '@/lib/quran/arabicNumber';
import { ayahInRange, parseCompareRange, surahInRange } from '@/lib/quran/compareRange';
import { plainName } from '@/lib/quran/normalize';
import { groupBySurah } from '@/lib/quran/surahPairs';
import { getTopicSurahPairs } from '@/lib/quran/topicEngine';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة السور وتكرار العبارات',
};

function topPair(pairs: [number, number][]) {
  const counts = new Map<string, number>();
  for (const [x, y] of pairs) if (x !== y) counts.set(`${Math.min(x, y)}:${Math.max(x, y)}`, (counts.get(`${Math.min(x, y)}:${Math.max(x, y)}`) ?? 0) + 1);
  const best = [...counts].sort((p, q) => q[1] - p[1])[0];
  return best ? best[0].split(':').map(Number) : null;
}

const surahOf = (value: string | string[] | undefined) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
};

export default async function QuranComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const themes = query.mode === 'themes';
  const s = surahOf(query.s);
  const t = surahOf(query.t);
  if (s !== null && t !== null && s !== t) redirect(modeHref('text', { a: String(s), b: String(t) }));
  const range = parseCompareRange(query);
  const tab: CompareTab = themes && s === null ? 'themes' : query.view === 'ayat' && s === null ? 'ayat' : 'similar';
  const [surahs, pairs] = await Promise.all([
    prisma.surah.findMany({ select: { number: true, name: true } }),
    tab === 'themes' ? getTopicSurahPairs((surah, ayah) => ayahInRange(surah, ayah, range)) : similarSurahPairs(range),
  ]);
  const [topA, topB] = range.range && query.a === undefined && query.b === undefined ? topPair(pairs) ?? [] : [];
  const [first, second] = themes ? [16, 43] : [56, 69];
  const a = surahOf(query.a) ?? topA ?? (surahOf(query.b) === first ? second : first);
  const b = surahOf(query.b) ?? topB ?? (a === second ? first : second);
  const shown = { ...query, a: String(a), b: String(b) };
  const names = Object.fromEntries(surahs.map(x => [x.number, plainName(x.name)]));
  const strings = Object.fromEntries(Object.entries(query).flatMap(([key, value]) => (typeof value === 'string' ? [[key, value]] : [])));
  const where = range.range ? `${range.unit === 'juz' ? 'الأجزاء' : 'السور'} ${num(range.range.from)}–${num(range.range.to)}` : 'المصحف كله';
  const summary = `${where} · ${tab === 'themes' ? 'المواضيع المشتركة' : 'أزواج الآيات المتشابهة'}: ${num(pairs.length)}`;
  const within = s !== null && query.within === '1';
  const current = s !== null ? `${within ? 'داخل سورة' : 'سورة'} ${names[s]}` : `${names[a]} و${names[b]}`;

  return (
    <RepetitionProvider>
      <div dir="rtl" className="w-full p-4 flex flex-col gap-4 text-[var(--home-ink)]">
        <header>
          <h1 className="text-4xl text-[var(--home-accent)]">مقارنة السور</h1>
          <p className="text-sm text-[var(--home-muted)]">قارن بين سورتين بالآيات المتشابهة، أو آية بآية، أو بالمواضيع المشتركة.</p>
        </header>
        <CompareControls tab={tab} query={strings} range={range} summary={summary} />
        <CompareLayout title={tab === 'themes' ? 'السور بالمواضيع المشتركة' : 'السور بالآيات المتشابهة'} current={current}
          pane={<SurahPairs key="pane" groups={groupBySurah(pairs, surahs.map(x => x.number).filter(n => surahInRange(n, range)))} names={names} tab={tab} query={strings} surah={s} within={within} a={a} b={b} />}>
          {s !== null ? (
            <>
              <SimilarAyat surah={s} within={within} range={range} query={strings} />
              <SurahRepetition surah={s} />
            </>
          ) : themes ? <ThemesCompare query={shown} range={range} /> : <TextCompare query={shown} range={range} />}
        </CompareLayout>
      </div>
    </RepetitionProvider>
  );
}
