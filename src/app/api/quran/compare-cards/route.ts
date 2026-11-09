import { NextResponse } from 'next/server';
import { pairCards } from '@/app/quran/compare/pairCards';

const surah = (value: string | null) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
};

/** One surah pair's compare cards, so a swipe can draw the neighbouring page beside the current one. */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const [a, b] = [surah(params.get('a')), surah(params.get('b'))];
  if (a === null || b === null || a === b) return NextResponse.json({ error: 'Two different surahs, 1 to 114' }, { status: 400 });
  // The cards are built once into a file, so they only change with a deploy.
  return NextResponse.json(pairCards(a, b, params.get('review') === '1'), { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
