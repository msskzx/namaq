import { NextRequest, NextResponse } from 'next/server';
import { listPhrases, searchPhrases, sharedOpenings, type BranchAyah, type Opening } from '@/lib/quran/branches';
import { buildPhraseGroups, type PhraseGroup } from '@/lib/quran/phraseTrees';
import { chapterFamilies } from '@/lib/quran/chapterFamilies';
import { inJuzRange, parseJuzRange } from '@/lib/quran/juz';
import openingAyat from '@/app/quran/branches/ayat.json';
import phraseData from '@/app/quran/branches/phrases.json';

type Suggestion = Opening & { kind?: 'inside' };
const inventories = new Map<string, Suggestion[]>();

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const scope = params.get('scope') === 'inside' ? 'inside' : params.get('scope') === 'opening' ? 'opening' : 'all';
  const query = params.get('q') ?? '';
  if (!query.trim()) return NextResponse.json({ suggestions: [] });
  const range = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const key = JSON.stringify([scope, range]);
  if (!inventories.has(key)) {
    if (inventories.size >= 16) inventories.delete(inventories.keys().next().value!);
    const within = (ayah: BranchAyah) => !range || inJuzRange(ayah.key, range);
    const openings = (openingAyat as BranchAyah[]).filter(within);
    const phrases = scope === 'opening' ? [] : range ? buildPhraseGroups((phraseData.ayat as BranchAyah[]).filter(within)) : phraseData.groups as PhraseGroup[];
    inventories.set(key, [
      ...(scope === 'inside' ? [] : [...listPhrases(sharedOpenings(openings)), ...chapterFamilies(openings)]),
      ...phrases.map(group => ({ id: group.id, text: group.text, count: new Set(group.occurrences.map(at => at.key)).size, kind: 'inside' as const })),
    ]);
  }
  return NextResponse.json({ suggestions: query.trim() ? searchPhrases(inventories.get(key)!, query).slice(0, 10) : [] }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
