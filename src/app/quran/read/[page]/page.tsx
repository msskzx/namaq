import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { ReaderPageData } from '@/lib/quran/readerPage';
import ReaderView from '../ReaderView';
import { garamond } from '../font';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default async function QuranReadPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const number = Number(page);
  if (String(number) !== page || number < 1 || number > 604) notFound();
  const data: ReaderPageData = (await import(`../data/${number}.json`)).default;
  const numbers = data.items.flatMap((item) => ('surah' in item ? [item.surah] : []));
  const [rows, before] = await Promise.all([
    prisma.surah.findMany({ where: { number: { in: numbers } }, select: { number: true, name: true } }),
    prisma.surah.findFirst({ where: { page: { lt: number } }, orderBy: { number: 'desc' }, select: { number: true, name: true } }),
  ]);
  const names = Object.fromEntries([...rows, ...(before ? [before] : [])].map((row) => [row.number, row.name]));
  return <ReaderView page={number} data={data} names={names} top={before?.number} fontClass={garamond.variable} />;
}
