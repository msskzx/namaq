import { prisma } from '@/lib/prisma';
import type { SharedTopic, TopicInstance } from './topicTypes';

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

export function sharedTopicsFromInstances(
  a: TopicInstance[],
  b: TopicInstance[],
): SharedTopic[] {
  const bySlugB = new Map(b.map((t) => [t.slug, t]));
  const shared: SharedTopic[] = [];
  for (const topicA of a) {
    const topicB = bySlugB.get(topicA.slug);
    if (!topicB) continue;
    shared.push({
      slug: topicA.slug,
      labelAr: topicA.labelAr,
      a: { from: topicA.ayahFrom, to: topicA.ayahTo },
      b: { from: topicB.ayahFrom, to: topicB.ayahTo },
    });
  }
  return shared;
}

export async function getSharedTopics(surahA: number, surahB: number): Promise<SharedTopic[]> {
  const [a, b] = await Promise.all([getSurahTopics(surahA), getSurahTopics(surahB)]);
  return sharedTopicsFromInstances(a, b);
}
