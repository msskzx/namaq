import { NextResponse } from 'next/server';
import { SAHIH, isSahihSlug, searchBoth } from '@/lib/sahih';

const CACHE = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' };

/**
 * The hadith tab's search (the app searches on the phone): `?q=` both Sahihs' babs and hadith holding every word typed;
 * `?n=` how many hits to send (the page asks for more with «المزيد»); `?book=` a Sahih's kitabs and bab headings, for a quiz's look-up.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const book = params.get('book') ?? '';
  if (params.has('book')) return isSahihSlug(book) ? NextResponse.json(SAHIH[book], { headers: CACHE }) : NextResponse.json({ error: 'book bukhari|muslim' }, { status: 400 });
  const query = params.get('q')?.trim().slice(0, 100) ?? '';
  const count = Math.min(Math.max(Number(params.get('n')) || 50, 1), 100_000);
  return NextResponse.json(query ? await searchBoth(query, count) : { babs: [], hadith: [], babCount: 0, hadithCount: 0, total: 0 }, { headers: CACHE });
}
