import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SurahIndex from './SurahIndex';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default async function QuranReadIndexPage() {
  const surahs = await prisma.surah.findMany({ orderBy: { number: 'asc' }, select: { number: true, name: true, numberOfAyat: true, page: true } });
  return <SurahIndex surahs={surahs} />;
}
