import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import SurahIndex from './SurahIndex';
import { garamond } from './font';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default async function QuranReadIndexPage() {
  const surahs = await prisma.surah.findMany({ orderBy: { number: 'asc' }, select: { number: true, name: true, nameTransliterated: true, numberOfAyat: true, page: true } });
  return <SurahIndex surahs={surahs} fontClass={garamond.variable} />;
}
