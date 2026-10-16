import type { Metadata } from 'next';
import TextCompare from './TextCompare';
import ThemesCompare from './ThemesCompare';
import CompareModeToggle from './CompareModeToggle';
import { modeHref } from './modeHref';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة سورتين',
};

export default async function QuranComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const themes = query.mode === 'themes';

  return (
    <>
      <CompareModeToggle themes={themes} textHref={modeHref('text', query)} themesHref={modeHref('themes', query)} />
      {themes ? <ThemesCompare query={query} /> : <TextCompare query={query} />}
    </>
  );
}
