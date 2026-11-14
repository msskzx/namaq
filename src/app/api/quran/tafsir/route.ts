import { NextResponse } from 'next/server';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';

/** Al-Sa'di's passage for one ayah, for the reader's tafsir sheet (src/app/quran/read/AyahPreviewSheet.tsx); the book stays on the server. */
export async function GET(request: Request) {
  const passage = tafsirSadiOf(new URL(request.url).searchParams.get('k') ?? '');
  if (!passage) return NextResponse.json({ error: 'Provide a surah:ayah key' }, { status: 400 });
  return NextResponse.json(passage, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
}
