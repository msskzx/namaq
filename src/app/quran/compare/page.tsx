import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import TextCompare from './TextCompare';
import ThemesCompare from './ThemesCompare';
import CompareModeToggle from './CompareModeToggle';
import { modeHref } from './modeHref';
import { RepetitionList, RepetitionProvider, SharedPassages, SurahRepetition } from './Repetition';
import SimilarAyat from './SimilarAyat';

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

  return (
    <RepetitionProvider>
      <div dir="rtl" className="w-full p-4 grid lg:grid-cols-[20rem_minmax(0,1fr)] gap-4 items-start text-gray-900 dark:text-gray-200">
        <RepetitionList a={a} b={b} surah={s} mode={themes ? 'themes' : 'text'} />
        <div className="min-w-0">
          {s !== null ? (
            <div className="flex flex-col gap-6">
              <SurahRepetition surah={s} />
              <SimilarAyat surah={s} />
            </div>
          ) : (
            <>
              <CompareModeToggle themes={themes} textHref={modeHref('text', query)} themesHref={modeHref('themes', query)} />
              {themes ? <ThemesCompare query={query} /> : <TextCompare query={query} shared={<><SharedPassages a={a} b={b} /><SimilarAyat surah={a} other={b} /></>} />}
            </>
          )}
        </div>
      </div>
    </RepetitionProvider>
  );
}
