import corpus from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { ayahContexts, sharedByAll, surrounding, treeContexts, type Neighbour } from '@shared/quran/ayahContext';
import { ayahEnds, branchesHref, keys, type Branch, type BranchAyah, type Variant } from '@shared/quran/branches';
import { readBookmarks, toggleBookmark } from '@shared/bookmarks';
import { filteredAyat } from '@shared/quran/mutashabih/browse';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import { phrasePresentation } from '@shared/quran/phraseTrees';
import { aliasesOf, branchList, EMPTY_LIST, isSavedIn, type ListState } from './branchList';

export type Presentation = { tree: Branch; prefixes: Variant[]; offsets: Record<string, number>; ayat: BranchAyah[] };
/** For each ayah in a tree, which of its word positions every ayah shares exactly or by root. */
export type Matches = Record<string, { exact: Set<number>; rooted: Set<number> }>;
export type TreeCard = { piece: BranchPiece; presentation: Presentation; matches: Matches };

export const surahs = surahRows;
export const surahNames: Record<number, string> = Object.fromEntries(surahs.map(row => [row.number, row.name]));

const all = corpus.ayat as BranchAyah[];
let ayatByKey: Map<string, BranchAyah> | undefined;
const byKey = () => (ayatByKey ??= new Map(all.map(ayah => [ayah.key, ayah])));
export const ayahOf = (key: string) => byKey().get(key);

/** The trees of the website's default branches list, in mushaf order. */
export const treeList = (): BranchPiece[] => branchList(EMPTY_LIST);

const cards = new Map<string, TreeCard>();

/** The tree drawn on a card, built the same way as the website's branches page with the same filters. */
export function cardOf(piece: BranchPiece, state: Pick<ListState, 'filters' | 'range'> = EMPTY_LIST): TreeCard {
  const id = JSON.stringify([piece.id, piece.keys.length, state.filters, state.range]);
  const cached = cards.get(id);
  if (cached) return cached;
  const visible = filteredAyat(byKey(), state.filters, state.range);
  const presentation: Presentation = piece.group
    ? groupPresentation(piece.group, byKey(), state.range, state.filters)
    : phrasePresentation(piece.phrase, all, true, !state.range, key => visible.has(key));
  const matches: Matches = Object.fromEntries(treeContexts(presentation.ayat).map(context => [context.ayah.key, { exact: new Set(context.match?.exact), rooted: new Set(context.match?.rooted) }]));
  const card = { piece, presentation, matches };
  if (cards.size > 40) cards.delete(cards.keys().next().value!);
  cards.set(id, card);
  return card;
}

/** An ayah drawn beside a tree with the surrounding-ayat switch on, with the words it shares with the others on its side. */
export type Beside = Neighbour & { exact: Set<number>; rooted: Set<number> };
/**
 * The ayat around a tree, as the website draws them: `before` each ayah's start, `after` each ayah's end,
 * `earlier` one more before an ayah whose ayah before is already drawn (see `required`).
 */
export type Around = { before: Record<string, Beside | null>; after: Record<string, Beside | null>; earlier: Record<string, Beside | null>; ends: Record<string, string> };

const marked = (list: (Neighbour | null)[]): Map<string, Beside> => {
  const unique = [...new Map(list.flatMap(ayah => ayah ? [[ayah.key, ayah] as const] : [])).values()];
  const contexts = sharedByAll(unique.map(ayah => ({ ayah: { ...ayah, page: ayah.page }, before: null, after: null })));
  return new Map(contexts.map((context, i) => [unique[i].key, { ...unique[i], exact: new Set(context.match?.exact), rooted: new Set(context.match?.rooted) }]));
};

const aroundCache = new Map<Branch, Around>();
export function aroundOf(presentation: Presentation): Around {
  const cached = aroundCache.get(presentation.tree);
  if (cached) return cached;
  const inTree = keys(presentation.tree);
  const ends = ayahEnds(presentation.tree);
  const near = surrounding(all, inTree, [...new Set(Object.values(ends))]);
  const earlierKeys = inTree.flatMap(key => near.before[key] ? [near.before[key]!.key] : []);
  const further = surrounding(all, earlierKeys, []);
  const before = marked(Object.values(near.before));
  const after = marked(Object.values(near.after));
  const earlier = marked(Object.values(further.before));
  const pick = (map: Map<string, Beside>, neighbour: Neighbour | null | undefined) => neighbour ? map.get(neighbour.key) ?? null : null;
  const around: Around = {
    ends,
    before: Object.fromEntries(inTree.map(key => [key, pick(before, near.before[key])])),
    after: Object.fromEntries(Object.entries(near.after).map(([key, ayah]) => [key, pick(after, ayah)])),
    earlier: Object.fromEntries(inTree.map(key => [key, pick(earlier, further.before[near.before[key]?.key ?? ''])])),
  };
  if (aroundCache.size > 40) aroundCache.delete(aroundCache.keys().next().value!);
  aroundCache.set(presentation.tree, around);
  return around;
}

/**
 * A phrase that opens its ayah shows the ayah before only with the surrounding-ayat switch on, unless another ayah
 * has words before the phrase: then the ayah before is always drawn, so those words never read as a trunk every ayah shares.
 */
export const mixedBefore = (presentation: Presentation) => presentation.prefixes.some(prefix => prefix.word);

/** One cell of the matrix: an ayah (or a passage running over several) with the words every row shares at that step. */
export type MatrixAyah = { key: string; page: number; words: string[]; exact: Set<number>; rooted: Set<number>; basmala?: string[] };
export type MatrixCell = { ayat: MatrixAyah[] } | null;
export type MatrixColumn = 'before' | 'ayah' | 'after';
export type Matrix = { columns: MatrixColumn[]; rows: Record<MatrixColumn, MatrixCell>[] };

const positions = new Map(all.map((ayah, i) => [ayah.key, i]));

/** The website's ayah matrix: a row per ayah of the tree, and with the switch on the ayah before and after each. */
export function matrixOf(presentation: Presentation, withAround: boolean): Matrix {
  const ends = ayahEnds(presentation.tree);
  const starts = presentation.ayat.map(ayah => ayah.key);
  const passages = starts.map(key => all.slice(positions.get(key)!, positions.get(ends[key] ?? key)! + 1));
  const steps = Math.max(0, ...passages.map(passage => passage.length));
  const matched = new Map<string, { exact: Set<number>; rooted: Set<number> }>();
  for (let step = 0; step < steps; step++) {
    const wanted = passages.flatMap(passage => passage[step] ? [passage[step].key] : []);
    sharedByAll(ayahContexts(all, wanted)).forEach(context => matched.set(`${step}:${context.ayah.key}`, { exact: new Set(context.match?.exact), rooted: new Set(context.match?.rooted) }));
  }
  const around = withAround ? aroundOf(presentation) : undefined;
  const cellOf = (beside: Beside | null | undefined): MatrixCell => beside ? { ayat: [{ key: beside.key, page: beside.page, words: beside.words, exact: beside.exact, rooted: beside.rooted, basmala: beside.basmala }] } : null;
  return {
    columns: withAround ? ['before', 'ayah', 'after'] : ['ayah'],
    rows: passages.map((passage, row) => ({
      before: cellOf(around?.before[starts[row]]),
      ayah: { ayat: passage.map((ayah, step) => ({ key: ayah.key, page: ayah.page, words: ayah.words, ...(matched.get(`${step}:${ayah.key}`) ?? { exact: new Set<number>(), rooted: new Set<number>() }) })) },
      after: cellOf(around?.after[passage[passage.length - 1].key]),
    })),
  };
}

export const isSaved = (piece: BranchPiece, list = readBookmarks()) => isSavedIn(piece, list);
export const toggleSaved = (piece: BranchPiece) => toggleBookmark({ id: piece.id, text: piece.text, href: branchesHref(piece.id) }, aliasesOf(piece));
export const WEBSITE = 'https://namaq.vercel.app';

/** What a growing tree draws before its root for each ayah, and after each ayah's end, matching what BranchTree draws. */
export function growthParts(presentation: Presentation, around: Around | undefined): { starts: { id: string; keys: string[] }[]; afters: Record<string, string> } {
  const all = keys(presentation.tree);
  const before = (key: string, context = around) => context?.before[key] ? [{ id: `b${key}`, keys: [key] }] : [];
  const mixed = mixedBefore(presentation);
  const starts = presentation.prefixes.length === 0 ? all.flatMap(key => before(key)) : presentation.prefixes.flatMap((prefix, i) => {
    if (prefix.word) return [...prefix.keys.flatMap(key => before(key)), { id: `p${i}`, keys: prefix.keys }];
    if (!mixed) return prefix.keys.flatMap(key => before(key));
    const context = around ?? aroundOf(presentation);
    return prefix.keys.flatMap(key => [...(around?.earlier[key] && context.before[key] ? [{ id: `e${key}`, keys: [key] }] : []), ...before(key, context)]);
  });
  const afters = around ? Object.fromEntries(all.flatMap(key => around.after[around.ends[key]] ? [[key, `a${key}`]] : [])) : {};
  return { starts, afters };
}
