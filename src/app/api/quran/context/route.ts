import { NextResponse } from 'next/server';
import { ayahContexts, sharedByAll, isAyahKey, loadReaderAyat } from '@/lib/quran/ayahContext';

const MAX_KEYS = 200;

// docs/plans/quran-shared-openings.md
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const wanted = params.get('q')?.split(',') ?? [];
  if (wanted.length === 0 || wanted.length > MAX_KEYS || !wanted.every(isAyahKey)) return NextResponse.json({ error: 'Provide valid surah:ayah keys' }, { status: 400 });
  try {
    const contexts = ayahContexts(await loadReaderAyat(), wanted);
    if (contexts.length !== new Set(wanted).size) return NextResponse.json({ error: 'Ayah not found' }, { status: 404 });
    return NextResponse.json(sharedByAll(contexts));
  } catch {
    return NextResponse.json({ error: 'Could not load ayah context' }, { status: 500 });
  }
}
