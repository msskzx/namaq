import { NextResponse } from 'next/server';
import surahRows from '@shared/data/quran/surahs.json';
import { isAyahKey } from '@shared/quran/ayahContext';
import { gharibAyah } from '@/app/quran/read/gharib';

/** A pressed word's meaning sheet: the ayah's words, the pressed one (page `p`, its `n`th word there), Ibn Qutaybah on the ayah and al-Raghib on the word's root. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get('k') ?? '';
  const [surah, ayah] = key.split(':').map(Number);
  if (!isAyahKey(key) || ayah > (surahRows.find(row => row.number === surah)?.numberOfAyat ?? 0)) return NextResponse.json({ error: 'Provide a surah:ayah key' }, { status: 400 });
  const page = Number(params.get('p')) || undefined;
  const n = params.has('n') ? Number(params.get('n')) : undefined;
  return NextResponse.json(await gharibAyah(key, page, Number.isInteger(n) ? n : undefined), { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
}
