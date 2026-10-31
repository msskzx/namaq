import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const surahList = unstable_cache(
  () => prisma.surah.findMany({ orderBy: { number: 'asc' }, select: { number: true, name: true, nameTransliterated: true, numberOfAyat: true, page: true } }),
  ['quran-surah-list'],
  { revalidate: 86400 },
);
