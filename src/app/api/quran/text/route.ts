import { NextResponse } from 'next/server';
import { loadReaderAyat } from '@/lib/quran/readerAyat';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(await loadReaderAyat(), { headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } });
}
