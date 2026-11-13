import { NextResponse } from 'next/server';
import surahRows from '@shared/data/quran/surahs.json';
import { isAyahKey } from '@shared/quran/ayahContext';
import { ayahPreview } from '@/app/quran/read/ayahPreview';

/** What the reader's tree and compare buttons preview for one ayah, in a sheet (src/app/quran/read/AyahPreviewSheet.tsx). */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('k') ?? '';
  const [surah, ayah] = key.split(':').map(Number);
  if (!isAyahKey(key) || ayah > (surahRows.find(row => row.number === surah)?.numberOfAyat ?? 0)) return NextResponse.json({ error: 'Provide a surah:ayah key' }, { status: 400 });
  return NextResponse.json(ayahPreview(key), { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
}
