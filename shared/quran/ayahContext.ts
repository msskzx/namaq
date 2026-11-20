// docs/plans/quran-shared-openings.md
import wordKeys from '../data/quran/wordKeys.json';
import type { BranchAyah } from './branches';
import { likeness, type Likeness } from './wordMatch';
import { wordTokens } from './compare';
import { normalizeWord } from './normalize';

/** `written`: words every ayah has in the same letters but writes differently; `rooted`: the rest every ayah shares by root. */
export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null; match?: { exact: number[]; written?: number[]; rooted: number[]; links?: Record<number, WordLink> } };

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
/** The longest LCS lining up of `a[ai..aj)` with `b[bi..bj)`, added to `pairs`. */
function lcsPairs(a: string[], b: string[], ai: number, aj: number, bi: number, bj: number, pairs: Map<number, number>) {
  const n = aj - ai, m = bj - bi;
  const table = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    table[i][j] = a[ai + i] === b[bi + j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[ai + i] === b[bi + j]) { pairs.set(ai + i, bi + j); i++; j++; } else if (table[i + 1][j] >= table[i][j + 1]) i++; else j++;
  }
}

/**
 * Lines up two ayat word by word. The longest run of words they share in a row is lined up first, then the words before and
 * after it, the same way: so where a word repeats, the one inside the shared phrase is the one paired (al-Ma'ida 17's «ولله ملك»,
 * not its earlier «إن الله»). Single words left over are lined up as a plain longest common subsequence.
 */
function alignedPairs(a: string[], b: string[]) {
  const pairs = new Map<number, number>();
  const split = (ai: number, aj: number, bi: number, bj: number) => {
    if (ai >= aj || bi >= bj) return;
    let best = 0, at = 0, bt = 0;
    const run = new Array<number>(bj - bi + 1).fill(0);
    for (let i = aj - 1; i >= ai; i--) for (let j = bi; j < bj; j++) {
      run[j - bi] = a[i] === b[j] ? (run[j - bi + 1] ?? 0) + 1 : 0;
      if (run[j - bi] > best) { best = run[j - bi]; at = i; bt = j; }
    }
    if (best < 2) { lcsPairs(a, b, ai, aj, bi, bj, pairs); return; }
    for (let k = 0; k < best; k++) pairs.set(at + k, bt + k);
    split(ai, at, bi, bt);
    split(at + best, aj, bt + best, bj);
  };
  split(0, a.length, 0, b.length);
  return pairs;
}

type Lined = { forms: string[]; lined: Map<number, number>[] };
type Match = { indices: (number | undefined)[]; rows: number; kind: Likeness };

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
    matches.push({ indices, rows: forms.length, kind: likeness(forms) });
  }));
  return matches;
}

/** A word's partners in the other rows: words lined up together share a `link`; `rows` counts the rows that have it, `kind` says how alike they are and `exact` that they are all written alike. */
export type WordLink = { link: string; rows: number; exact: boolean; kind: Likeness };

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
    const forms = context.ayah.words;
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
      return { indices, rows: forms.length, kind: likeness(forms) };
    }).filter(match => match.rows > 1);
  });
  return contexts.map((context, n) => {
    const lists: Record<Likeness, number[]> = { exact: [], written: [], root: [] };
    const links: Record<number, WordLink> = {};
    shared.forEach((match, link) => {
      const i = match.indices[n];
      if (i === undefined) return;
      links[i] = { link: String(link), rows: match.rows, exact: match.kind === 'exact', kind: match.kind };
      if (match.rows === contexts.length) lists[match.kind].push(i);
    });
    const sorted = (list: number[]) => list.sort((x, y) => x - y);
    return { ...context, match: { exact: sorted(lists.exact), written: sorted(lists.written), rooted: sorted(lists.root), links } };
  });
}

export function treeContexts(ayat: BranchAyah[]): AyahContext[] {
  const contexts = ayat.map(ayah => ({ ayah, before: null, after: null, match: { exact: [] as number[], written: [] as number[], rooted: [] as number[] } }));
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
      for (const kind of ['exact', 'written', 'rooted'] as const) {
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

/** How alike word `i` is in every ayah, from a context's match; none when not every ayah has it. */
export function likenessOf(match: AyahContext['match'], i: number): Likeness | undefined {
  if (!match) return undefined;
  return match.rooted.includes(i) ? 'root' : match.written?.includes(i) ? 'written' : match.exact.includes(i) ? 'exact' : undefined;
}
