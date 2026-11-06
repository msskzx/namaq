import { NextRequest, NextResponse } from 'next/server';
import { branchInventory } from '@/lib/quran/branchInventory';
import { searchSharedPhrases } from '@/lib/quran/branchSearch';
import { groupFilters } from '@/lib/quran/mutashabih/browse';
import { parseJuzRange } from '@/lib/quran/juz';

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('q') ?? '';
  const all = params.get('all') === '1';
  if (!all && !query.trim()) return NextResponse.json({ suggestions: [] });
  const filters = groupFilters(Object.fromEntries(params));
  const range = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const saved = params.get('b')?.split('|').filter(Boolean);
  const surah = params.get('s');
  const inventory = branchInventory(filters, range).filter(piece =>
    (!surah || piece.keys.some(key => key.split(':')[0] === surah)) &&
    (!saved?.length || saved.some(id => piece.id === id || piece.legacyId === id || piece.legacyIds?.includes(id) || piece.group?.aliases?.includes(id))));
  const selected = all ? inventory : searchSharedPhrases(inventory, query).slice(0, 10);
  const phrases = selected.map(({ id, text, textEn, count }) => ({ id, text, textEn, count }));
  return NextResponse.json(all ? { phrases } : { suggestions: phrases }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
