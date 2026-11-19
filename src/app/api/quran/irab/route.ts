import { NextResponse } from 'next/server';
import surahRows from '@shared/data/quran/surahs.json';
import { isAyahKey } from '@shared/quran/ayahContext';
import { irabAyah } from '@/app/quran/read/irab';

/** One ayah's i'rab for the reader's sheet: its words, the pressed one (page `p`, its `n`th word there; or `w`, its place in the ayah), each word's line and al-'Ukbari's passages. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get('k') ?? '';
  const [surah, ayah] = key.split(':').map(Number);
  if (!isAyahKey(key) || ayah > (surahRows.find(row => row.number === surah)?.numberOfAyat ?? 0)) return NextResponse.json({ error: 'Provide a surah:ayah key' }, { status: 400 });
  const page = Number(params.get('p')) || undefined;
  const n = params.has('n') ? Number(params.get('n')) : undefined;
  const w = params.has('w') ? Number(params.get('w')) : undefined;
  return NextResponse.json(await irabAyah(key, page, Number.isInteger(n) ? n : undefined, Number.isInteger(w) && w! >= 0 ? w : undefined), { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
}
