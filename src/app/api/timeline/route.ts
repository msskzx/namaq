import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { battleKind, type TimelineItem } from '@/lib/timeline';

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
    return NextResponse.json(items);
  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json({ error: 'Failed to fetch the timeline' }, { status: 500 });
  }
}
