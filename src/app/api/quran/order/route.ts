import { NextResponse } from 'next/server';
import { num } from '@shared/quran/arabicNumber';
import { orderSurahs } from '@shared/quran/surahOrder';
import { loadReaderAyat } from '@/lib/quran/readerAyat';

/**
 * The surah-order page's cards for one surah (`?surah=`), as the page builds them: what «رتّب سور الجزء» opens for a box
 * (owner, 2026-11-21), its opening ayat as the Madina pages print them.
 */
export async function GET(request: Request) {
  const surah = Number(new URL(request.url).searchParams.get('surah'));
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return NextResponse.json({ error: 'Provide ?surah= from 1 to 114' }, { status: 400 });
  const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
  const found = orderSurahs(key => words.get(key), num).find(s => s.surah === surah);
  return NextResponse.json({ surah: found }, { headers: { 'Cache-Control': 'public, max-age=86400' } });
}
