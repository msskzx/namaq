// docs/plans/quran-shared-openings.md
import wordKeys from '@/app/quran/compare/wordKeys.json';
import { readerAyat, type BranchAyah } from './branches';
import { pairOf, wordTokens } from './compare';
import { normalizeWord } from './normalize';

export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null; match?: { exact: number[]; rooted: number[] } };

let source: Promise<BranchAyah[]> | undefined;

export function loadReaderAyat(): Promise<BranchAyah[]> {
  return source ??= Promise.all(Array.from({ length: 604 }, (_, i) => import(`../../app/quran/read/data/${i + 1}.json`)))
    .then(pages => readerAyat(pages.map(page => page.default)))
    .catch(error => { source = undefined; throw error; });
}

export function ayahContexts(all: BranchAyah[], wanted: string[]): AyahContext[] {
  const byKey = new Map(all.map(ayah => [ayah.key, ayah]));
  return [...new Set(wanted)].flatMap(key => {
    const ayah = byKey.get(key);
    if (!ayah) return [];
    const [surah, number] = key.split(':').map(Number);
    return [{ ayah, before: byKey.get(`${surah}:${number - 1}`) ?? null, after: byKey.get(`${surah}:${number + 1}`) ?? null }];
  }).sort((a, b) => {
    const [as, aa] = a.ayah.key.split(':').map(Number);
    const [bs, ba] = b.ayah.key.split(':').map(Number);
    return as - bs || aa - ba;
  });
}

const tokens = (ayah: BranchAyah) => {
  const [surah, number] = ayah.key.split(':').map(Number);
  const norm = ayah.words.map(normalizeWord);
  return { norm, keys: wordTokens(norm, wordKeys.surahs[surah - 1]?.[number - 1]) };
};

export function comparedTo(contexts: AyahContext[], base: BranchAyah): AyahContext[] {
  const b = tokens(base);
  const shared = { exact: new Set<number>(), rooted: new Set<number>() };
  const rest = (count: number, ...apart: number[][]) => Array.from({ length: count }, (_, i) => i).filter(i => apart.every(list => !list.includes(i)));
  const compared = contexts.map(context => {
    if (context.ayah.key === base.key) return context;
    const a = tokens(context.ayah);
    const pair = pairOf(0, 0, a.keys, b.keys, a.norm, b.norm);
    rest(b.norm.length, pair.marksB, pair.rootsB).forEach(i => shared.exact.add(i));
    pair.rootsB.forEach(i => shared.rooted.add(i));
    return { ...context, match: { exact: rest(a.norm.length, pair.marksA, pair.rootsA), rooted: pair.rootsA } };
  });
  const own = { exact: [...shared.exact].sort((x, y) => x - y), rooted: [...shared.rooted].filter(i => !shared.exact.has(i)).sort((x, y) => x - y) };
  return compared.map(context => (context.ayah.key === base.key ? { ...context, match: own } : context));
}
