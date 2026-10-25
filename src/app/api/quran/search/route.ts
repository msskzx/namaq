import { NextResponse } from 'next/server';
import { loadReaderAyat } from '@/lib/quran/ayahContext';
import { indexAyat, searchAyat } from '@/lib/quran/ayahSearch';

let ayat: ReturnType<typeof indexAyat> | Promise<ReturnType<typeof indexAyat>> | null = null;

const load = async () => indexAyat(await loadReaderAyat());

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  ayat ??= load().catch(error => {
    ayat = null;
    throw error;
  });
  ayat = await ayat;
  return NextResponse.json(searchAyat(ayat, query.slice(0, 200)), { headers: { 'Cache-Control': 'public, max-age=86400' } });
}
