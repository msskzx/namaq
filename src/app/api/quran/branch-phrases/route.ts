import { NextRequest, NextResponse } from 'next/server';
import { searchPhrases, type BranchAyah, type Opening } from '@/lib/quran/branches';
import { buildTreeGroups, type TreeGroup } from '@/lib/quran/phraseTrees';
import { subtreeIndex, type Subtree } from '@/lib/quran/subtrees';
import { inJuzRange, parseJuzRange } from '@/lib/quran/juz';
import treeData from '@/app/quran/branches/trees.json';

type Suggestion = Opening;
const inventories = new Map<string, Suggestion[]>();

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('q') ?? '';
  const all = params.get('all') === '1';
  if (!all && !query.trim()) return NextResponse.json({ suggestions: [] });
  const range = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const key = JSON.stringify(range);
  if (!inventories.has(key)) {
    if (inventories.size >= 16) inventories.delete(inventories.keys().next().value!);
    const within = (ayah: BranchAyah) => !range || inJuzRange(ayah.key, range);
    const data = treeData as { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] };
    const ayat = data.ayat.filter(within);
    const trees = range ? buildTreeGroups(ayat) : [...data.trees, ...subtreeIndex(data.trees, data.subtrees).groups];
    inventories.set(key, trees.map(tree => ({ id: tree.id, text: tree.text, textEn: tree.textEn, aliases: tree.aliases, count: new Set(tree.occurrences.map(occurrence => occurrence.key)).size })));
  }
  if (all) return NextResponse.json({ phrases: inventories.get(key)! }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=31536000' } });
  return NextResponse.json({ suggestions: query.trim() ? searchPhrases(inventories.get(key)!, query).slice(0, 10) : [] }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
