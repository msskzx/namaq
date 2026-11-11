import { NextRequest, NextResponse } from 'next/server';
import { branchInventory, distinctBranchPieces, outsideMatches } from '@shared/quran/branchInventory';
import { searchSharedPhrases } from '@shared/quran/branchSearch';
import { groupFilters } from '@shared/quran/mutashabih/browse';
import { parseJuzRange } from '@shared/quran/juz';

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
  const brief = (pieces: typeof inventory) => pieces.map(({ id, text, textEn, count }) => ({ id, text, textEn, count }));
  // Trees the search finds outside the current filters, listed under their own label in the search box.
  if (params.get('outside') === '1') return NextResponse.json({ outside: brief(outsideMatches(query, distinctBranchPieces(searchSharedPhrases(inventory, query)))) }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
  const selected = all ? inventory : searchSharedPhrases(inventory, query).slice(0, 10);
  const phrases = brief(selected);
  return NextResponse.json(all ? { phrases } : { suggestions: phrases }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
