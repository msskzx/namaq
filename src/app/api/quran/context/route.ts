import { NextResponse } from 'next/server';
import { ayahContexts, comparedTo, loadReaderAyat } from '@/lib/quran/ayahContext';

const MAX_KEYS = 200;

// docs/plans/quran-shared-openings.md
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const wanted = params.get('q')?.split(',') ?? [];
  const vs = params.get('vs');
  if (wanted.length === 0 || wanted.length > MAX_KEYS || (vs !== null && !wanted.includes(vs)) || wanted.some(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return !/^[1-9]\d*:[1-9]\d*$/.test(key) || !Number.isSafeInteger(surah) || surah > 114 || !Number.isSafeInteger(ayah);
  })) return NextResponse.json({ error: 'Provide valid surah:ayah keys' }, { status: 400 });
  try {
    const contexts = ayahContexts(await loadReaderAyat(), wanted);
    if (contexts.length !== new Set(wanted).size) return NextResponse.json({ error: 'Ayah not found' }, { status: 404 });
    const base = vs && contexts.find(context => context.ayah.key === vs);
    return NextResponse.json(base ? comparedTo(contexts, base.ayah) : contexts);
  } catch {
    return NextResponse.json({ error: 'Could not load ayah context' }, { status: 500 });
  }
}
