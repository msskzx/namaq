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

function spanByTheme(topics: TopicInstance[]): Map<string, { from: number; to: number; labelAr: string }> {
  const byTheme = new Map<string, { from: number; to: number; labelAr: string }>();
  for (const topic of topics) {
    if (!topic.themeId) continue;
    const existing = byTheme.get(topic.themeId);
    if (!existing) {
      byTheme.set(topic.themeId, { from: topic.ayahFrom, to: topic.ayahTo, labelAr: topic.labelAr });
    } else {
      existing.from = Math.min(existing.from, topic.ayahFrom);
      existing.to = Math.max(existing.to, topic.ayahTo);
    }
  }
  return byTheme;
}

// Topic slugs are per-surah (see docs/plans/quran-topics-engine.md), so they never
// collide across surahs by construction. themeId is the only key both surahs can share.
export function sharedTopicsFromInstances(
  a: TopicInstance[],
  b: TopicInstance[],
): SharedTopic[] {
  const spansA = spanByTheme(a);
  const spansB = spanByTheme(b);
  const shared: SharedTopic[] = [];
  for (const [themeId, spanA] of spansA) {
    const spanB = spansB.get(themeId);
    if (!spanB) continue;
    shared.push({
      slug: themeId,
      labelAr: spanA.labelAr,
      a: { from: spanA.from, to: spanA.to },
      b: { from: spanB.from, to: spanB.to },
    });
  }
  return shared;
}

export async function getSharedTopics(surahA: number, surahB: number): Promise<SharedTopic[]> {
  const [a, b] = await Promise.all([getSurahTopics(surahA), getSurahTopics(surahB)]);
  return sharedTopicsFromInstances(a, b);
}

export function topicSurahPairs(rows: { surah: number; themeId: string | null }[]): [number, number][] {
  const surahs = new Map<string, Set<number>>();
  for (const { surah, themeId } of rows) if (themeId) surahs.set(themeId, (surahs.get(themeId) ?? new Set()).add(surah));
  return [...surahs.values()].flatMap(set => {
    const list = [...set].sort((a, b) => a - b);
    return list.flatMap((a, i) => list.slice(i + 1).map(b => [a, b] as [number, number]));
  });
}

export async function getTopicSurahPairs(keep: (surah: number, ayah: number) => boolean = () => true): Promise<[number, number][]> {
  const rows = await prisma.quranTopic.findMany({ where: { alternativeOf: null, themeId: { not: null } }, select: { surah: true, themeId: true, ayahFrom: true } });
  return topicSurahPairs(rows.filter(row => keep(row.surah, row.ayahFrom)));
}
