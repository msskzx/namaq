// docs/plans/quran-shared-openings.md
import wordKeys from '@/app/quran/compare/wordKeys.json';
import { readerAyat, spell, type BranchAyah } from './branches';
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

export function sharedByAll(contexts: AyahContext[]): AyahContext[] {
  if (contexts.length < 2) return contexts;
  const all = contexts.map(context => ({ ...tokens(context.ayah), forms: context.ayah.words.map(spell) }));
  return contexts.map((context, n) => {
    const a = all[n];
    const found = a.norm.map(() => ({ shared: true, exact: true }));
    all.forEach((b, m) => {
      if (m === n || found.every(word => !word.shared)) return;
      const pair = pairOf(0, 0, a.keys, b.keys, a.forms, b.forms);
      found.forEach((word, i) => {
        if (pair.marksA.includes(i)) word.shared = false;
        else if (pair.rootsA.includes(i)) word.exact = false;
      });
    });
    const at = (exact: boolean) => found.flatMap((word, i) => (word.shared && word.exact === exact ? [i] : []));
    return { ...context, match: { exact: at(true), rooted: at(false) } };
  });
}
