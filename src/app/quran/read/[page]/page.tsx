import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { pageGroups, spreadOf, type MushafPage } from '@/lib/quran/readerPage';
import ReaderView from '../ReaderView';
import { garamond } from '../font';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

const surahBefore = (page: number) =>
  prisma.surah.findFirst({ where: { page: { lt: page } }, orderBy: { number: 'desc' }, select: { number: true, name: true } });

export default async function QuranReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams?: Promise<{ a?: string | string[] }>;
}) {
  const { page } = await params;
  const [surah, ayah] = String([(await searchParams)?.a ?? ''].flat()[0]).split(':').map(Number);
  const number = Number(page);
  if (String(number) !== page || number < 1 || number > 604) notFound();
  const spread = [...new Set(spreadOf(number))];
  const datas: MushafPage[] = await Promise.all(spread.map(async at => (await import(`../mushaf/${at}.json`)).default));
  const numbers = datas.flatMap(data => data.items.flatMap(item => ('surah' in item ? [item.surah] : [])));
  const [rows, befores] = await Promise.all([
    prisma.surah.findMany({ where: { number: { in: numbers } }, select: { number: true, name: true } }),
    Promise.all(spread.map(surahBefore)),
  ]);
  const names = Object.fromEntries([...rows, ...befores.flatMap(row => (row ? [row] : []))].map(row => [row.number, row.name]));
  const pages = spread.map((at, i) => ({ page: at, data: datas[i], top: befores[i]?.number }));
  const shown = pages.find(entry => entry.page === number)!;
  const holds = pageGroups(shown.data.items, shown.top).some(line => line?.some(group => group.surah === surah && group.ayah === ayah));
  if (surah && ayah && !holds) redirect(`/quran/read/ayah/${surah}/${ayah}`);
  return <ReaderView page={number} pages={pages} names={names} mark={surah && ayah ? { surah, ayah } : undefined} fontClass={garamond.variable} />;
}
