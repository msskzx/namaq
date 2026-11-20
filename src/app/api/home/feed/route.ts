import { NextResponse } from 'next/server';
import { termCard } from '@/lib/balaghaTerms';
import { hadithCards } from '@/lib/forty';
import { nameCards, tarajimCards } from '@/lib/tarajim';
import { sahihCards } from '@/lib/sahih';
import { savedFeedCard } from '@/lib/feedCard';
import { drawingCards } from '@/lib/drawingCards';
import { dayNumber } from '@shared/dailyPick';
import { ayahPages, FEED_AHEAD, FEED_FAR, feedContent, feedIds, pageSlice, savedContent, siraCards, storyCards } from '@/lib/homeFeed';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };
const offsets = (value: string | null) => (value ? value.split(',').map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < FEED_FAR).slice(0, FEED_AHEAD) : []);

/**
 * The home feed (src/components/homepage/HomeFeed.tsx), worked out from the reader's own day number:
 * `?day=D&n=N` lists the next N pairs' and trees' ids (N a multiple of FEED_AHEAD, FEED_AHEAD when left out), `?day=D&p=0,2&t=0,1` sends those pairs and trees, `?page=N` a page's first lines,
 * `?saved=ID` a saved tree's or compare card's content (a saved card in the feed), `?ayah=S:A` the page an ayah is on and the page before it (the recall card's lines), `?day=D&s=1,3` the prophets cards of those batches,
 * `?day=D&sira=0,1` the sira and battle-moment cards of those batches, `?day=D&term=1,3` the balagha term cards of those batches,
 * `?day=D&hadith=0,1` the hadith and Ibn Rajab cards of those batches, `?day=D&tarajim=0,1` the virtue («من التراجم») and
 * «صلة» cards of those batches, `?day=D&sahih=0,1` the Sahih al-Bukhari and Sahih Muslim cards of those batches, `?day=D&card=card:KIND:ITEM` a saved feed card (src/lib/feedCard.ts),
 * `?day=D&draw=0,1&kinds=nasab,battle` the drawings' cards of those batches, of those kinds (src/lib/drawingCards.ts).
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
  if (params.has('draw')) return NextResponse.json(await drawingCards(day, offsets(params.get('draw')), (params.get('kinds') ?? '').split(',')), { headers: CACHE });
  if (params.has('tarajim')) return NextResponse.json(tarajimCards(day, offsets(params.get('tarajim'))), { headers: CACHE });
  if (params.has('sahih')) return NextResponse.json(await sahihCards(day, offsets(params.get('sahih'))), { headers: CACHE });
  if (params.has('names')) return NextResponse.json(nameCards(day, offsets(params.get('names'))), { headers: CACHE });
  if (params.has('hadith')) return NextResponse.json(hadithCards(day, offsets(params.get('hadith'))), { headers: CACHE });
  if (params.has('term')) return NextResponse.json(await Promise.all(offsets(params.get('term')).map(slot => termCard(day, slot))), { headers: CACHE });
  if (params.has('sira')) return NextResponse.json(await siraCards(day, offsets(params.get('sira'))), { headers: CACHE });
  if (params.has('s')) return NextResponse.json(storyCards(day, offsets(params.get('s'))), { headers: CACHE });
  if (params.has('p') || params.has('t')) return NextResponse.json(feedContent(day, offsets(params.get('p')), offsets(params.get('t'))), { headers: CACHE });
  const count = params.has('n') ? Number(params.get('n')) : FEED_AHEAD;
  if (!Number.isInteger(count) || count < FEED_AHEAD || count > FEED_FAR || count % FEED_AHEAD) return NextResponse.json({ error: `n: a multiple of ${FEED_AHEAD} up to ${FEED_FAR}` }, { status: 400 });
  return NextResponse.json(feedIds(day, count), { headers: CACHE });
}
