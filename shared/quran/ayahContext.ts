// docs/plans/quran-shared-openings.md
import wordKeys from '../data/quran/wordKeys.json';
import { spell, type BranchAyah } from './branches';
import { wordTokens } from './compare';
import { normalizeWord } from './normalize';

export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null; match?: { exact: number[]; rooted: number[]; links?: Record<number, WordLink> } };

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
  const fallback = wordTokens(norm, wordKeys.surahs[surah - 1]?.[number - 1]);
  return { norm, keys: norm.map((_, i) => ayah.roots?.[i] ? `r:${ayah.roots[i]}` : ayah.lemmas?.[i] ? `p:${ayah.lemmas[i]!.replace(/\d+$/, '')}` : fallback[i]) };
};

/** Index pairs `a`↔`b` on a longest in-order run of words the two share (LCS), so a repeated word is matched where it lines up. */
function alignedPairs(a: string[], b: string[]) {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const pairs = new Map<number, number>();
  for (let i = 0, j = 0; i < a.length && j < b.length;) {
    if (a[i] === b[j]) { pairs.set(i, j); i++; j++; } else if (table[i + 1][j] >= table[i][j + 1]) i++; else j++;
  }
  return pairs;
}

type Lined = { forms: string[]; lined: Map<number, number>[] };
type Match = { indices: (number | undefined)[]; rows: number; exact: boolean };

/** Matches for a word with no root: each occurrence in a pivot row, with the occurrences the LCS lines up with it in the other rows. */
function particleMatches(lists: number[][], all: Lined[]): Match[] {
  const used = lists.map(() => new Set<number>());
  const matches: Match[] = [];
  lists.forEach((list, pivot) => list.forEach(i => {
    if (used[pivot].has(i)) return;
    const indices = lists.map((other, m) => {
      if (m === pivot) return i;
      const j = all[pivot].lined[m].get(i);
      return j !== undefined && other.includes(j) && !used[m].has(j) ? j : undefined;
    });
    const forms = indices.flatMap((at, n) => at === undefined ? [] : [all[n].forms[at]]);
    if (forms.length < 2) return;
    indices.forEach((at, n) => at !== undefined && used[n].add(at));
    matches.push({ indices, rows: forms.length, exact: new Set(forms).size === 1 });
  }));
  return matches;
}

/** A word's partners in the other rows: words lined up together share a `link`; `rows` counts the rows that have it, `exact` says they are all spelled alike. */
export type WordLink = { link: string; rows: number; exact: boolean };

/**
 * Words the ayat share, lined up across them. `exact` and `rooted` are the words every ayah has (spelled alike, or only the
 * same root or lemma); `links` also holds words only some of the ayat share, so the matrix can colour and light them too.
 */
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
    const lined = tokenised.map((other, m) => m === n ? new Map<number, number>() : alignedPairs(keys, other));
    const rank = (i: number) => -lined.filter(pairs => pairs.has(i)).length;
    return { forms, byKey, rank, lined };
  });
  const shared = [...new Set(all.flatMap(ayah => [...ayah.byKey.keys()]))].flatMap(key => {
    const lists = all.map(ayah => ayah.byKey.get(key) ?? []);
    const count = Math.min(...lists.map(list => list.length));
    // The occurrences every ayah shares first, in reading order; the rest after, best lined up first.
    const ordered = lists.map((list, n) => {
      const ranked = [...list].sort((x, y) => all[n].rank(x) - all[n].rank(y) || x - y);
      return [...ranked.slice(0, count).sort((x, y) => x - y), ...ranked.slice(count)];
    });
    // A word with a root («ألقوا», «ملقون») may sit anywhere in the other ayah; a particle with none («من», «لا»)
    // is only paired where the ayat line up in order with one row's occurrence, so a stray «من» is not tied to a «ومنهم» far away.
    if (!key.startsWith('r:')) return particleMatches(lists, all);
    return Array.from({ length: Math.max(...lists.map(list => list.length)) }, (_, at) => {
      const indices = ordered.map(list => list[at]);
      const forms = indices.flatMap((i, n) => i === undefined ? [] : [all[n].forms[i]]);
      return { indices, rows: forms.length, exact: new Set(forms).size === 1 };
    }).filter(match => match.rows > 1);
  });
  return contexts.map((context, n) => {
    const exact: number[] = [];
    const rooted: number[] = [];
    const links: Record<number, WordLink> = {};
    shared.forEach((match, link) => {
      const i = match.indices[n];
      if (i === undefined) return;
      links[i] = { link: String(link), rows: match.rows, exact: match.exact };
      if (match.rows === contexts.length) (match.exact ? exact : rooted).push(i);
    });
    return { ...context, match: { exact: exact.sort((x, y) => x - y), rooted: rooted.sort((x, y) => x - y), links } };
  });
}

export function treeContexts(ayat: BranchAyah[]): AyahContext[] {
  const contexts = ayat.map(ayah => ({ ayah, before: null, after: null, match: { exact: [] as number[], rooted: [] as number[] } }));
  const runs = ayat.map(ayah => {
    const boundaries = [-1, ...ayah.words.flatMap((word, i) => word === '۝' || word.startsWith('﴿') ? [i] : []), ayah.words.length];
    return boundaries.slice(1).flatMap((end, i) => {
      const start = boundaries[i] + 1;
      return start === end ? [] : [{ start, ayah: { ...ayah, words: ayah.words.slice(start, end), roots: ayah.roots?.slice(start, end), lemmas: ayah.lemmas?.slice(start, end) } }];
    });
  });
  for (let step = 0; step < Math.max(0, ...runs.map(run => run.length)); step++) {
    const selected = runs.flatMap((run, index) => run[step] ? [{ ...run[step], index }] : []);
    const matches = sharedByAll(selected.map(({ ayah }) => ({ ayah, before: null, after: null })));
    matches.forEach((context, i) => {
      const { index, start } = selected[i];
      for (const kind of ['exact', 'rooted'] as const) {
        contexts[index].match[kind].push(...(context.match?.[kind] ?? []).map(at => start + at));
      }
    });
  }
  return contexts;
}

export type Neighbour = Pick<BranchAyah, 'key' | 'page' | 'words' | 'roots' | 'lemmas'> & { basmala?: string[] };
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
        return { key: previous, page, words, ...(all[last].roots && { roots: all[last].roots, lemmas: all[last].lemmas }), ...(key === '1:2' && basmala && { basmala }) };
      }
    }
    const found = i === undefined ? undefined : all[i + step];
    if (!found) return null;
    const { page, words } = found;
    const crossed = found.key.split(':')[0] !== key.split(':')[0];
    const opened = Number((step === 1 ? found.key : key).split(':')[0]);
    return { key: found.key, page, words, ...(found.roots && { roots: found.roots, lemmas: found.lemmas }), ...(crossed && basmala && opened !== NO_BASMALA && { basmala }) };
  };
  return {
    before: Object.fromEntries(before.map(key => [key, neighbour(key, -1)])),
    after: Object.fromEntries(after.map(key => [key, neighbour(key, 1)])),
  };
}
