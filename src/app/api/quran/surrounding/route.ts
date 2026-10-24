import { NextResponse } from 'next/server';
import { isAyahKey, loadReaderAyat, surrounding } from '@/lib/quran/ayahContext';

const MAX_KEYS = 400;

const keysOf = (value: string | null) => (value ? value.split(',') : []);

// docs/plans/quran-shared-openings.md
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const before = keysOf(params.get('before'));
  const after = keysOf(params.get('after'));
  const all = [...before, ...after];
  if (all.length === 0 || all.length > MAX_KEYS || !all.every(isAyahKey)) return NextResponse.json({ error: 'Provide valid surah:ayah keys' }, { status: 400 });
  try {
    return NextResponse.json(surrounding(await loadReaderAyat(), before, after));
  } catch {
    return NextResponse.json({ error: 'Could not load ayat' }, { status: 500 });
  }
}
