import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loadDerivedIntervals } from '@/lib/derivedPlacements';
import { battleKind, type TimelineItem } from '@/lib/timeline';
import { apiError, CATALOG_CACHE_HEADERS } from '@/lib/apiError';

/**
 * Every event and every battle as one list for the events page, which sorts and
 * filters it in the browser. Neither table is large, so nothing is paged.
 */
export async function GET() {
  try {
    const [events, battles] = await Promise.all([
      prisma.event.findMany({
        select: { id: true, slug: true, name: true, nameTransliterated: true, hijriYear: true, hijriPeriod: true, location: true, locationTransliterated: true },
      }),
      prisma.battle.findMany({
        select: { id: true, slug: true, name: true, nameTransliterated: true, hijriYear: true, hijriPeriod: true, location: true, locationEn: true, engagement: true },
      }),
    ]);

    const items: TimelineItem[] = [
      ...events.map((event) => ({ ...event, kind: 'event' as const })),
      ...battles.map(({ locationEn, engagement, ...battle }) => ({
        ...battle,
        locationTransliterated: locationEn,
        kind: battleKind(engagement),
      })),
    ];
    const intervals = await loadDerivedIntervals();
    return NextResponse.json(
      items.map((item) => (item.hijriYear === null ? { ...item, interval: intervals.get(item.slug) ?? null } : item)),
      { headers: CATALOG_CACHE_HEADERS },
    );
  } catch (error) {
    return apiError('GET /api/timeline', error, 'Failed to fetch the timeline');
  }
}
