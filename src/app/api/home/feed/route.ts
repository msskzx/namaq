import { NextResponse } from 'next/server';
import { dayNumber } from '@shared/dailyPick';
import { FEED_AHEAD, feedContent, feedIds, pageSlice } from '@/lib/homeFeed';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };
const offsets = (value: string | null) => (value ? value.split(',').map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < FEED_AHEAD).slice(0, FEED_AHEAD) : []);

/**
 * The home feed (src/components/homepage/HomeFeed.tsx), worked out from the reader's own day number:
 * `?day=D` lists the coming pairs' and trees' ids, `?day=D&p=0,2&t=0,1` sends those pairs and trees, `?page=N` a page's first lines.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page'));
  if (params.has('page')) {
    if (!Number.isInteger(page) || page < 1 || page > 604) return NextResponse.json({ error: 'page 1-604' }, { status: 400 });
    return NextResponse.json(await pageSlice(page), { headers: CACHE });
  }
  const day = Number(params.get('day'));
  // The reader's day is within a day of the server's anywhere on earth; anything else would only fill the server's caches.
  if (!Number.isInteger(day) || Math.abs(day - dayNumber(new Date())) > 2) return NextResponse.json({ error: 'Provide today\'s day number' }, { status: 400 });
  if (params.has('p') || params.has('t')) return NextResponse.json(feedContent(day, offsets(params.get('p')), offsets(params.get('t'))), { headers: CACHE });
  return NextResponse.json(feedIds(day), { headers: CACHE });
}
