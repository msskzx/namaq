import { NextResponse } from 'next/server';
import { ayahContexts, loadReaderAyat } from '@/lib/quran/ayahContext';

// docs/plans/quran-shared-openings.md
export async function GET(request: Request) {
  const wanted = new URL(request.url).searchParams.get('q')?.split(',') ?? [];
  if (wanted.length === 0 || wanted.some(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return !/^[1-9]\d*:[1-9]\d*$/.test(key) || !Number.isSafeInteger(surah) || surah > 114 || !Number.isSafeInteger(ayah);
  })) return NextResponse.json({ error: 'Provide valid surah:ayah keys' }, { status: 400 });
  try {
    const contexts = ayahContexts(await loadReaderAyat(), wanted);
    if (contexts.length !== new Set(wanted).size) return NextResponse.json({ error: 'Ayah not found' }, { status: 404 });
    return NextResponse.json(contexts);
  } catch {
    return NextResponse.json({ error: 'Could not load ayah context' }, { status: 500 });
  }
}
