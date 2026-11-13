import { prisma } from '@/lib/prisma';
import type { TopicInstance } from './topicTypes';

function toInstance(row: {
  slug: string;
  labelAr: string;
  themeId: string | null;
  surah: number;
  ayahFrom: number;
  ayahTo: number;
  excerptAr: string;
  alternativeOf: string | null;
}): TopicInstance {
  return {
    slug: row.slug,
    labelAr: row.labelAr,
    themeId: row.themeId,
    surah: row.surah,
    ayahFrom: row.ayahFrom,
    ayahTo: row.ayahTo,
    excerptAr: row.excerptAr,
    alternativeOf: row.alternativeOf,
  };
}

export async function getSurahTopics(surah: number): Promise<TopicInstance[]> {
  const rows = await prisma.quranTopic.findMany({
    where: { surah, alternativeOf: null },
    orderBy: { ayahFrom: 'asc' },
  });
  return rows.map(toInstance);
}
