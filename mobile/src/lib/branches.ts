import corpus from '@shared/quran/quranText/corpus';
import surahRows from '@shared/data/quran/surahs.json';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { ayahContexts, sharedByAll, surrounding, treeContexts, type AyahContext, type Neighbour } from '@shared/quran/ayahContext';
import type { Likeness } from '@shared/quran/wordMatch';
import { ownAyatOnly, twoAyat } from '@shared/quran/branchVerdicts';
import { ayahEnds, ownAyat, ownEnds, twoEnds, uncoveredRows, branchesHref, keys, textHolds, type Branch, type BranchAyah, type Variant } from '@shared/quran/branches';
import { readBookmarks, toggleBookmark } from '@shared/bookmarks';
import { filteredAyat } from '@shared/quran/mutashabih/browse';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import { evidenceGroup } from '@shared/quran/mutashabih/evidence';
import type { Group } from '@shared/quran/mutashabih/types';
import { phrasePresentation } from '@shared/quran/phraseTrees';
import { stepTime } from '@shared/quran/readPlan';
import type { Beat } from './growth';
import { aliasesOf, BOTH_KINDS_LIST, branchList, EMPTY_LIST, isSavedIn, type ListState } from './branchList';
import { SURAH_NAMES } from '@shared/quran/surahNames';

export type Presentation = { tree: Branch; prefixes: Variant[]; offsets: Record<string, number>; ayat: BranchAyah[] };
export type Shared = { exact: Set<number>; written: Set<number>; rooted: Set<number> };
export const sharedOf = (match?: AyahContext['match']): Shared => ({ exact: new Set(match?.exact), written: new Set(match?.written), rooted: new Set(match?.rooted) });
export const NOTHING_SHARED: Shared = sharedOf();
export const likenessAt = (shared: Shared, i: number): Likeness | undefined =>
  shared.rooted.has(i) ? 'root' : shared.written.has(i) ? 'written' : shared.exact.has(i) ? 'exact' : undefined;
export type Matches = Record<string, Shared>;
export type TreeCard = { piece: BranchPiece; presentation: Presentation; matches: Matches };

export const surahs = surahRows;
export const surahNames: Record<number, string> = SURAH_NAMES;

const all = corpus.ayat as BranchAyah[];
let ayatByKey: Map<string, BranchAyah> | undefined;
const byKey = () => (ayatByKey ??= new Map(all.map(ayah => [ayah.key, ayah])));
export const ayahOf = (key: string) => byKey().get(key);

export const treeList = (): BranchPiece[] => branchList(BOTH_KINDS_LIST);

const setOf = (ayahKeys: string[]) => [...ayahKeys].sort().join(' ');
let bySet: Map<string, BranchPiece> | undefined;
export function subtreeOf(ayahKeys: string[]): BranchPiece | undefined {
  if (!bySet) {
    bySet = new Map();
    for (const piece of treeList()) if (!bySet.has(setOf(piece.keys))) bySet.set(setOf(piece.keys), piece);
  }
  return bySet.get(setOf(ayahKeys));
}

const cards = new Map<string, TreeCard>();
const curatedEnds = new WeakMap<Presentation, Record<string, string>>();
const repeated = new WeakMap<Presentation, Record<string, number[]>>();


export function cardOf(piece: BranchPiece, state: Pick<ListState, 'filters' | 'range'> = EMPTY_LIST): TreeCard {
  const id = JSON.stringify([piece.id, piece.keys.length, state.filters, state.range]);
  const cached = cards.get(id);
  if (cached) return cached;
  const visible = filteredAyat(byKey(), state.filters, state.range);
  const built: Presentation = piece.group
    ? groupPresentation(piece.group, byKey(), state.range, state.filters)
    : phrasePresentation(piece.phrase, all, true, !state.range, key => visible.has(key));
  const presentation: Presentation = ownAyatOnly(piece) ? { ...built, tree: ownAyat(built.tree) } : built;
  const matches: Matches = Object.fromEntries(treeContexts(presentation.ayat).map(context => [context.ayah.key, sharedOf(context.match)]));
  if (twoAyat(piece)) curatedEnds.set(presentation, twoEnds(presentation.tree, key => positions.has(key)));
  if (ownAyatOnly(piece)) curatedEnds.set(presentation, ownEnds(presentation.tree));
  if (piece.group?.places.length === 1 && Object.keys(piece.group.differences).length) repeated.set(presentation, piece.group.differences);
  const card = { piece, presentation, matches };
  if (cards.size > 40) cards.delete(cards.keys().next().value!);
  cards.set(id, card);
  return card;
}

export type Beside = Neighbour & Shared;
export type Around = { before: Record<string, Beside | null>; after: Record<string, Beside | null>; earlier: Record<string, Beside | null>; ends: Record<string, string> };

const marked = (list: (Neighbour | null)[]): Map<string, Beside> => {
  const unique = [...new Map(list.flatMap(ayah => ayah ? [[ayah.key, ayah] as const] : [])).values()];
  const contexts = sharedByAll(unique.map(ayah => ({ ayah: { ...ayah, page: ayah.page }, before: null, after: null })));
  return new Map(contexts.map((context, i) => [unique[i].key, { ...unique[i], ...sharedOf(context.match) }]));
};

const aroundCache = new Map<Branch, Around>();
export function aroundOf(presentation: Presentation): Around {
  const cached = aroundCache.get(presentation.tree);
  if (cached) return cached;
  const around = aroundWith(presentation, ayahEnds(presentation.tree));
  if (aroundCache.size > 40) aroundCache.delete(aroundCache.keys().next().value!);
  aroundCache.set(presentation.tree, around);
  return around;
}

const matrixAround = new WeakMap<Presentation, Around>();
function matrixAroundOf(presentation: Presentation): Around {
  const ends = curatedEnds.get(presentation);
  if (!ends) return aroundOf(presentation);
  if (!matrixAround.has(presentation)) matrixAround.set(presentation, aroundWith(presentation, ends));
  return matrixAround.get(presentation)!;
}

function aroundWith(presentation: Presentation, ends: Record<string, string>): Around {
  const inTree = keys(presentation.tree);
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
  return around;
}

export const mixedBefore = (presentation: Presentation) => presentation.prefixes.some(prefix => prefix.word);

export type MatrixLink = { link: string; kind: Likeness; some: boolean };
export type MatrixAyah = Shared & { key: string; page: number; words: string[]; links?: Map<number, MatrixLink>; basmala?: string[] };
export type MatrixCell = { ayat: MatrixAyah[] } | null;
export type MatrixColumn = 'before' | 'ayah' | 'after';
export type Matrix = { columns: MatrixColumn[]; rows: Record<MatrixColumn, MatrixCell>[] };

const positions = new Map(all.map((ayah, i) => [ayah.key, i]));

export function rowOf(matrix: Matrix, key: string): { r: number; row: Matrix['rows'][number] } | null {
  const own = matrix.rows.findIndex(row => row.ayah?.ayat[0]?.key === key);
  if (own >= 0) return { r: own, row: matrix.rows[own] };
  const r = matrix.rows.findIndex(row => row.ayah?.ayat.some(ayah => ayah.key === key));
  if (r < 0) return null;
  const ayat = matrix.rows[r].ayah!.ayat;
  return { r, row: { before: null, ayah: { ayat: ayat.slice(ayat.findIndex(ayah => ayah.key === key)) }, after: matrix.rows[r].after } };
}

export function matrixOf(presentation: Presentation, withAround: boolean): Matrix {
  const ends = curatedEnds.get(presentation) ?? ayahEnds(presentation.tree);
  const every = presentation.ayat.map(ayah => ayah.key);
  const drawn = every.map(key => all.slice(positions.get(key)!, positions.get(ends[key] ?? key)! + 1));
  const kept = uncoveredRows(drawn.map(passage => passage.map(ayah => ayah.key)));
  const starts = kept.map(i => every[i]);
  const passages = kept.map(i => drawn[i]);
  const steps = Math.max(0, ...passages.map(passage => passage.length));
  const matched = new Map<string, Shared & { links: Map<number, MatrixLink> }>();
  for (let step = 0; step < steps; step++) {
    const wanted = passages.flatMap(passage => passage[step] ? [passage[step].key] : []);
    const rows = new Set(wanted).size;
    sharedByAll(ayahContexts(all, wanted)).forEach(context => matched.set(`${step}:${context.ayah.key}`, {
      ...sharedOf(context.match),
      links: new Map(Object.entries(context.match?.links ?? {}).map(([i, item]) => [Number(i), { link: `${step}:${item.link}`, kind: item.kind, some: item.rows < rows }])),
    }));
  }
  const around = withAround ? matrixAroundOf(presentation) : undefined;
  const cellOf = (beside: Beside | null | undefined): MatrixCell => beside ? { ayat: [{ key: beside.key, page: beside.page, words: beside.words, exact: beside.exact, written: beside.written, rooted: beside.rooted, basmala: beside.basmala }] } : null;
  return {
    columns: withAround ? ['before', 'ayah', 'after'] : ['ayah'],
    rows: passages.map((passage, row) => ({
      before: cellOf(around?.before[starts[row]]),
      ayah: { ayat: passage.map((ayah, step) => ({ key: ayah.key, page: ayah.page, words: ayah.words, ...(matched.get(`${step}:${ayah.key}`) ?? NOTHING_SHARED), ...(repeated.get(presentation)?.[ayah.key] && { exact: new Set(repeated.get(presentation)![ayah.key]) }) })) },
      after: cellOf(around?.after[passage[passage.length - 1].key]),
    })),
  };
}

export const readId = (row: number, key: string, index: number) => `${row}:${key}:${index}`;

const readingCache = new WeakMap<Presentation, Beat[]>();
export function matrixReading(presentation: Presentation): Beat[] {
  const cached = readingCache.get(presentation);
  if (cached) return cached;
  const beats = matrixOf(presentation, false).rows.flatMap((row, r) => (row.ayah?.ayat ?? []).flatMap((ayah, a, ayat) => ayah.words.map((_, i): Beat => {
    const link = ayah.links?.get(i)?.link;
    const last = i === ayah.words.length - 1;
    return { step: r, key: ayah.key, ms: stepTime({ side: 0, ayah: a, word: i, link, last: last && a === ayat.length - 1 }, 1), reveal: [], now: [readId(r, ayah.key, i), ...(link ? [`link:${link}`] : [])] };
  })));
  readingCache.set(presentation, beats);
  return beats;
}

export function withPathReading(presentation: Presentation, beats: Beat[]): Beat[] {
  const matrix = matrixOf(presentation, false);
  return beats.flatMap(beat => {
    const found = beat.path ? rowOf(matrix, beat.key) : null;
    const ayat = found?.row.ayah?.ayat;
    if (!found || !ayat?.length) return [beat];
    const { r } = found;
    return ayat.flatMap((ayah, a) => ayah.words.map((_, i): Beat => ({ ...beat, ms: stepTime({ side: 0, ayah: a, word: i, link: undefined, last: i === ayah.words.length - 1 && a === ayat.length - 1 }, 1), now: [readId(r, ayah.key, i)] })));
  });
}

export const isSaved = (piece: BranchPiece, list = readBookmarks()) => isSavedIn(piece, list);
export const toggleSaved = (piece: BranchPiece) => toggleBookmark({ id: piece.id, text: piece.text, href: branchesHref(piece.id) }, aliasesOf(piece));

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

const evidenceCache = new WeakMap<BranchPiece, Group | null>();

export function evidenceOf(piece: BranchPiece): Group | null {
  if (!piece.group) return null;
  if (evidenceCache.has(piece)) return evidenceCache.get(piece)!;
  const group = evidenceGroup(piece.group, piece.keys);
  const found = group.tags.length || group.citations.length ? group : null;
  evidenceCache.set(piece, found);
  return found;
}

export function searchLit(presentation: Presentation, query: string): string[] {
  if (!query.trim()) return [];
  const holding = presentation.ayat.filter(ayah => textHolds(ayah.words.join(' '), query)).map(ayah => ayah.key);
  return holding.length < presentation.ayat.length ? holding : [];
}
