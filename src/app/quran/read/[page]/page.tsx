import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { surahList } from '@/lib/quran/surahList';
import { spreadOf, type MushafPage } from '@/lib/quran/readerPage';
import ReaderView, { MarkedReaderView } from '../ReaderView';
import { garamond } from '../font';

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default async function QuranReadPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const number = Number(page);
  if (String(number) !== page || number < 1 || number > 604) notFound();
  const spread = [...new Set(spreadOf(number))];
  const [datas, surahs] = await Promise.all([Promise.all(spread.map(async at => (await import(`../mushaf/${at}.json`)).default as MushafPage)), surahList()]);
  const before = (at: number) => surahs.findLast(surah => surah.page != null && surah.page < at);
  const shown = new Set([...datas.flatMap(data => data.items.flatMap(item => ('surah' in item ? [item.surah] : []))), ...spread.flatMap(at => before(at)?.number ?? [])]);
  const names = Object.fromEntries(surahs.filter(surah => shown.has(surah.number)).map(surah => [surah.number, surah.name]));
  const pages = spread.map((at, i) => ({ page: at, data: datas[i], top: before(at)?.number }));
  const props = { page: number, pages, names, fontClass: garamond.variable };
  return (
    <Suspense fallback={<ReaderView {...props} />}>
      <MarkedReaderView {...props} />
    </Suspense>
  );
}
