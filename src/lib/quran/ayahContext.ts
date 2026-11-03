// docs/plans/quran-shared-openings.md
import wordKeys from '@/app/quran/compare/wordKeys.json';
import { spell, type BranchAyah } from './branches';
import { wordTokens } from './compare';
import { normalizeWord } from './normalize';

export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null; match?: { exact: number[]; rooted: number[] } };

export function isAyahKey(key: string) {
  const [surah, ayah] = key.split(':').map(Number);
  return /^[1-9]\d*:[1-9]\d*$/.test(key) && Number.isSafeInteger(surah) && surah <= 114 && Number.isSafeInteger(ayah);
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

/** Indices of `a` on a longest in-order run of words shared with `b` (LCS), so a repeated word is matched where it lines up. */
function aligned(a: string[], b: string[]) {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const on = new Set<number>();
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (a[i] === b[j]) { on.add(i); i++; j++; } else if (table[i + 1][j] >= table[i][j + 1]) i++; else j++;
  }
  return on;
}

export function sharedByAll(contexts: AyahContext[]): AyahContext[] {
  if (contexts.length < 2) return contexts;
  const raw = contexts.map(context => tokens(context.ayah).keys);
  // A word with no corpus key falls back to its letters, so «وفي» would miss «في»: drop a leading و/ف
  // when the rest is a word every other ayah has (the branches rule merges leading و/ف too).
  const sets = raw.map(keys => new Set(keys));
  const tokenised = raw.map((keys, n) => keys.map(key => {
    if (!/^[وف]./.test(key) || sets.every((set, m) => m === n || set.has(key))) return key;
    const bare = key.slice(1);
    return sets.every((set, m) => m === n || set.has(bare)) ? bare : key;
  }));
  const all = contexts.map((context, n) => {
    const keys = tokenised[n];
    const forms = context.ayah.words.map(spell);
    const byKey = new Map<string, number[]>();
    keys.forEach((key, i) => byKey.set(key, [...(byKey.get(key) ?? []), i]));
    // Lined up with every other ayah: where a word repeats, these occurrences are the ones the ayat share.
    const lined = tokenised.filter((_, m) => m !== n).map(other => aligned(keys, other));
    const rank = (i: number) => -lined.filter(set => set.has(i)).length;
    return { forms, byKey, rank };
  });
  const shared = [...all[0].byKey.keys()].flatMap(key => {
    const lists = all.map(ayah => ayah.byKey.get(key) ?? []);
    const count = Math.min(...lists.map(list => list.length));
    return count === 0 ? [] : [{ key, count, common: lists.map((list, n) => new Set(list.map(i => all[n].forms[i]))).reduce((a, b) => new Set([...a].filter(form => b.has(form)))) }];
  });
  return contexts.map((context, n) => {
    const exact: number[] = [];
    const rooted: number[] = [];
    shared.forEach(({ key, count, common }) => {
      const list = all[n].byKey.get(key)!;
      const chosen = list.length === count ? list : [...list].sort((x, y) => all[n].rank(x) - all[n].rank(y) || Number(!common.has(all[n].forms[x])) - Number(!common.has(all[n].forms[y])) || x - y).slice(0, count);
      chosen.forEach(i => (common.has(all[n].forms[i]) ? exact : rooted).push(i));
    });
    return { ...context, match: { exact: exact.sort((x, y) => x - y), rooted: rooted.sort((x, y) => x - y) } };
  });
}

export type Neighbour = { key: string; page: number; words: string[]; basmala?: string[] };
export type Surrounding = { before: Record<string, Neighbour | null>; after: Record<string, Neighbour | null> };

const NO_BASMALA = 9;

export function surrounding(all: BranchAyah[], before: string[], after: string[]): Surrounding {
  const at = new Map(all.map((ayah, i) => [ayah.key, i]));
  const basmala = all.find(ayah => ayah.key === '1:1')?.words;
  const neighbour = (key: string, step: 1 | -1): Neighbour | null => {
    const i = at.get(key);
    if (i !== undefined && step === -1 && (key === '1:1' || key === '1:2')) {
      const last = at.get('114:6');
      if (last !== undefined) {
        const { key: previous, page, words } = all[last];
        return { key: previous, page, words, ...(key === '1:2' && basmala && { basmala }) };
      }
    }
    const found = i === undefined ? undefined : all[i + step];
    if (!found) return null;
    const { page, words } = found;
    const crossed = found.key.split(':')[0] !== key.split(':')[0];
    const opened = Number((step === 1 ? found.key : key).split(':')[0]);
    return { key: found.key, page, words, ...(crossed && basmala && opened !== NO_BASMALA && { basmala }) };
  };
  return {
    before: Object.fromEntries(before.map(key => [key, neighbour(key, -1)])),
    after: Object.fromEntries(after.map(key => [key, neighbour(key, 1)])),
  };
}
