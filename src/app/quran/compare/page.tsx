import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import TextCompare from './TextCompare';
import ThemesCompare from './ThemesCompare';
import CompareModeToggle from './CompareModeToggle';
import { modeHref } from './modeHref';
import { RepetitionProvider, SurahRepetition } from './Repetition';
import SimilarAyat, { similarSurahPairs } from './SimilarAyat';
import { SurahPairs } from './SurahPairs';
import { prisma } from '@/lib/prisma';
import { plainName } from '@/lib/quran/normalize';
import { groupBySurah } from '@/lib/quran/surahPairs';
import { getTopicSurahPairs } from '@/lib/quran/topicEngine';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة السور وتكرار العبارات',
};

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
  const a = surahOf(query.a) ?? (themes ? 16 : 56);
  const b = surahOf(query.b) ?? (themes ? 43 : 69);
  const [surahs, pairs] = await Promise.all([
    prisma.surah.findMany({ select: { number: true, name: true } }),
    themes && s === null ? getTopicSurahPairs() : similarSurahPairs(),
  ]);
  const names = Object.fromEntries(surahs.map(x => [x.number, plainName(x.name)]));

  return (
    <RepetitionProvider>
      <div dir="rtl" className="w-full p-4 grid lg:grid-cols-[20rem_minmax(0,1fr)] gap-4 items-start text-gray-900 dark:text-gray-200">
        <div className="order-last lg:order-none">
          <SurahPairs groups={groupBySurah(pairs, surahs.map(x => x.number))} names={names} mode={themes && s === null ? 'themes' : 'text'} surah={s} a={a} b={b} />
        </div>
        <div className="min-w-0 flex flex-col gap-4">
          {s !== null ? (
            <>
              <SurahRepetition surah={s} />
              <SimilarAyat surah={s} />
            </>
          ) : (
            <>
              <CompareModeToggle on={themes} offHref={modeHref('text', query)} onHref={modeHref('themes', query)} />
              {themes ? <ThemesCompare query={query} /> : <TextCompare query={query} />}
            </>
          )}
        </div>
      </div>
    </RepetitionProvider>
  );
}
