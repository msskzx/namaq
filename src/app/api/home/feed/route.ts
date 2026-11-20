import { NextResponse } from 'next/server';
import { savedFeedCard } from '@/lib/feedCard';
import { dayNumber } from '@shared/dailyPick';
import { ayahPages, FEED_AHEAD, FEED_FAR, feedContent, feedIds, pageSlice, savedContent } from '@/lib/homeFeed';
import { feedItemIds } from '@/lib/feedLists';
import { LIST_KINDS, type ListKind } from '@shared/homeFeed';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };
const offsets = (value: string | null) => (value ? value.split(',').map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < FEED_FAR).slice(0, FEED_AHEAD) : []);

/**
 * The home feed (src/components/homepage/HomeFeed.tsx), worked out from the reader's own day number:
 * `?day=D&n=N` lists the next N pairs' and trees' ids (N a multiple of FEED_AHEAD, FEED_AHEAD when left out), `?day=D&p=0,2&t=0,1` sends those pairs and trees, `?page=N` a page's first lines,
 * `?saved=ID` a saved tree's or compare card's content (a saved card in the feed), `?ayah=S:A` the page an ayah is on and the page before it (the recall card's lines),
 * `?day=D&items=KIND&n=N[&after=ITEM]` the next N items of a content card kind (src/lib/feedLists.ts), `?day=D&card=card:KIND:ITEM` one content card,
 * in the feed or saved (src/lib/feedCard.ts).
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page'));
  if (params.has('page')) {
    if (!Number.isInteger(page) || page < 1 || page > 604) return NextResponse.json({ error: 'page 1-604' }, { status: 400 });
    return NextResponse.json(await pageSlice(page), { headers: CACHE });
  }
  const saved = params.get('saved');
  if (params.has('saved')) {
    // A card the data no longer holds is empty, and the feed skips it.
    return NextResponse.json((saved && saved.length <= 200 ? savedContent(saved) : null) ?? {}, { headers: CACHE });
  }
  const ayah = params.get('ayah');
  if (params.has('ayah')) {
    const pages = ayah && /^\d{1,3}:\d{1,3}$/.test(ayah) ? await ayahPages(ayah) : null;
    return pages ? NextResponse.json(pages, { headers: CACHE }) : NextResponse.json({ error: 'ayah S:A' }, { status: 400 });
  }
  const day = Number(params.get('day'));
  // The reader's day is within a day of the server's anywhere on earth; anything else would only fill the server's caches.
  if (!Number.isInteger(day) || Math.abs(day - dayNumber(new Date())) > 2) return NextResponse.json({ error: 'Provide today\'s day number' }, { status: 400 });
  const card = params.get('card');
  if (params.has('card')) return NextResponse.json((card && card.length <= 200 ? await savedFeedCard(card, day) : null) ?? {}, { headers: CACHE });
  const kind = params.get('items');
  if (params.has('items')) {
    const n = Number(params.get('n'));
    if (!(LIST_KINDS as readonly (string | null)[]).includes(kind) || !Number.isInteger(n) || n < 1 || n > FEED_FAR) return NextResponse.json({ error: `items: a card kind, n: 1 to ${FEED_FAR}` }, { status: 400 });
    const after = params.get('after');
    return NextResponse.json(feedItemIds(kind as ListKind, day, n, after && after.length <= 200 ? after : undefined), { headers: CACHE });
  }
  if (params.has('p') || params.has('t')) return NextResponse.json(feedContent(day, offsets(params.get('p')), offsets(params.get('t'))), { headers: CACHE });
  const count = params.has('n') ? Number(params.get('n')) : FEED_AHEAD;
  if (!Number.isInteger(count) || count < FEED_AHEAD || count > FEED_FAR || count % FEED_AHEAD) return NextResponse.json({ error: `n: a multiple of ${FEED_AHEAD} up to ${FEED_FAR}` }, { status: 400 });
  return NextResponse.json(feedIds(day, count), { headers: CACHE });
}
