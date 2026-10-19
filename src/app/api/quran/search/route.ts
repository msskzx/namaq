import { NextResponse } from 'next/server';
import { readerAyat } from '@/lib/quran/branches';
import { indexAyat, searchAyat } from '@/lib/quran/ayahSearch';
import type { ReaderPageData } from '@/lib/quran/readerPage';

let ayat: ReturnType<typeof indexAyat> | Promise<ReturnType<typeof indexAyat>> | null = null;

const load = async () =>
  indexAyat(
    readerAyat(
      await Promise.all(
        Array.from({ length: 604 }, async (_, i): Promise<ReaderPageData> => (await import(`@/app/quran/read/data/${i + 1}.json`)).default),
      ),
    ),
  );

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  ayat ??= load().catch(error => {
    ayat = null;
    throw error;
  });
  ayat = await ayat;
  return NextResponse.json(searchAyat(ayat, query.slice(0, 200)), { headers: { 'Cache-Control': 'public, max-age=86400' } });
}
