import { NextResponse } from 'next/server';
import type { BookId } from '@shared/books';
import { sahihText } from '@/lib/sahih';

/** The books the phone downloads to keep (shared/books.ts); built-in books ship with the app and are not served here. */
const FILES: Partial<Record<BookId, () => Promise<unknown>>> = {
  ukbari: async () => (await import('@shared/data/quran/irabUkbari')).default,
  kashshaf: async () => (await import('@shared/data/quran/kashshaf')).default,
  bukhari: async () => sahihText('bukhari'),
  muslim: async () => sahihText('muslim'),
};

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const load = FILES[(await params).id as BookId];
  if (!load) return NextResponse.json({ error: 'No such book to download' }, { status: 404 });
  return NextResponse.json(await load(), { headers: { 'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=2592000', 'Access-Control-Allow-Origin': '*' } });
}
