import treeData from '@/app/quran/branches/trees.json';
import { groups } from '@/lib/quran/mutashabih/data';
import { ayahOf, ayahPairs, keyOrder, pairChains, pairsBySurah, pairsFor, surahPairs, surahOf, type AyahPair } from '@/lib/quran/mutashabih/pairs';
import type { SimilarAyahPair } from '@/lib/quran/mutashabih/similar';
import { keptPair, verdictFor } from '@/lib/quran/curation/comparePairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import { MARK_KINDS } from './markKinds';
import type { CardSide, PairCard } from './pairCards';
import links from '@/lib/quran/curation/compareLinks.json';
import data from './pairs.json';
import passage from './passagePairs.json';

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));
type CuratedLinks = { pair: string; links: SimilarAyahPair['columns']; why: string; source: string };

/** Word links added by hand or from a book: they win over the engine's on the same words, and add the pair if the engine has none. */
function withCuratedLinks(pairs: SimilarAyahPair[]): SimilarAyahPair[] {
  const curated = new Map((links.links as CuratedLinks[]).map(item => [item.pair, item.links]));
  const merged = pairs.map(pair => {
    const added = curated.get(`${pair.a}|${pair.b}`);
    curated.delete(`${pair.a}|${pair.b}`);
    if (!added) return pair;
    const [takenA, takenB] = [new Set(added.map(column => column[0])), new Set(added.map(column => column[1]))];
    return { ...pair, columns: [...added, ...pair.columns.filter(([i, j]) => !takenA.has(i) && !takenB.has(j))] };
  });
  return [...merged, ...[...curated].map(([pair, columns]) => {
    const [a, b] = pair.split('|');
    return { a, b, columns };
  })];
}

const found = ayahPairs(withCuratedLinks([...data.pairs, ...passage.pairs] as SimilarAyahPair[]), groups);
/** Curation runs after the engine: pairs a reader judged to share only vocabulary are left out. */
const bySurah = pairsBySurah(found.filter(keptPair));
const foundBySurah = pairsBySurah(found);

/** Every surah pair with enough kept ayah pairs to get its own page. */
const listedPairs = surahPairs(bySurah);
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
const reviewPairs = surahPairs(foundBySurah);

const LEVELS = ['exact', 'letters', 'lemma', 'root'];
const kindOf = (level: string) => (level === 'root' ? 'related' : level === 'lemma' ? 'root' : 'exact') as NonNullable<SpreadAyah['marks']>[number]['kind'];

/** Each word lights one partner: strongest matches first, then the pair of ayat that share the most words (7:113 goes with 26:41, not 26:40). */
function wordMarks(pairs: AyahPair[]) {
  const marks = new Map<string, { kind: ReturnType<typeof kindOf>; link: string }>();
  const columns = pairs.flatMap((pair, p) => pair.columns.map((column, c) => ({ ...column, id: `${p}-${c}`, shared: pair.columns.length })))
    .sort((x, y) => LEVELS.indexOf(x.level ?? '') - LEVELS.indexOf(y.level ?? '') || y.shared - x.shared);
  for (const column of columns) {
    const [a, b] = [`${column.a.key}:${column.a.index}`, `${column.b.key}:${column.b.index}`];
    if (marks.has(a) || marks.has(b)) continue;
    // Root-only matches are marked lightly: words sharing a root can differ in meaning («بين» and «بيان»).
    for (const word of [a, b]) marks.set(word, { kind: kindOf(column.level ?? ''), link: column.id });
  }
  return marks;
}

function side(pairs: AyahPair[], which: 'a' | 'b', marks: ReturnType<typeof wordMarks>): CardSide {
  const surah = surahOf(pairs[0][which]);
  const numbers = pairs.map(pair => ayahOf(pair[which]));
  const [from, to] = [Math.min(...numbers), Math.max(...numbers)];
  const ayat = Array.from({ length: to - from + 1 }, (_, i) => {
    const number = from + i;
    const key = `${surah}:${number}`;
    const list = words.get(key) ?? [];
    return { number, words: list, marks: Object.fromEntries(list.flatMap((_, index) => {
      const mark = marks.get(`${key}:${index}`);
      return mark ? [[index, mark]] : [];
    })) };
  });
  return { surah, ayah: from, ayat };
}

const rangeId = (cardSide: CardSide) => `${cardSide.surah}:${cardSide.ayah}${cardSide.ayat.length > 1 ? `-${cardSide.ayat[cardSide.ayat.length - 1].number}` : ''}`;

function card(pairs: AyahPair[], review: boolean): PairCard {
  const marks = wordMarks(pairs);
  const sides: PairCard['sides'] = [side(pairs, 'a', marks), side(pairs, 'b', marks)];
  const group = pairs.find(pair => pair.group)?.group;
  const verdict = review && pairs.length === 1 ? verdictFor(pairs[0].a, pairs[0].b) : undefined;
  return {
    id: pairs.length === 1 ? `${pairs[0].a}|${pairs[0].b}` : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(group ? { group } : {}),
    ...(verdict ? { verdict } : {}),
    ...(pairs.length > 1 ? { pairs: pairs.map(pair => ({ id: `${pair.a}|${pair.b}`, ...(review && verdictFor(pair.a, pair.b) ? { verdict: verdictFor(pair.a, pair.b) } : {}) })) } : {}),
    sides,
  };
}

/** One shared ayah against several far partners, as one card opening on its first partner. */
function manyCard(pairs: AyahPair[], shared: 'a' | 'b', review: boolean): PairCard {
  const many = shared === 'a' ? 'b' : 'a';
  const first = card([pairs[0]], review);
  const reference = (key: string) => key.split(':')[1];
  const ids = { [shared]: pairs[0][shared], [many]: `${surahOf(pairs[0][many])}:${pairs.map(pair => reference(pair[many])).join(',')}` };
  return {
    ...first,
    verdict: undefined,
    id: `${ids.a}|${ids.b}`,
    group: pairs.find(pair => pair.group)?.group,
    pairs: pairs.map(pair => ({ id: `${pair.a}|${pair.b}`, ...(review && verdictFor(pair.a, pair.b) ? { verdict: verdictFor(pair.a, pair.b) } : {}) })),
    many: { side: many === 'a' ? 0 : 1, options: pairs.map(pair => {
      const marks = wordMarks([pair]);
      return { id: `${pair.a}|${pair.b}`, ayah: side([pair], many, marks).ayat[0], shared: side([pair], shared, marks).ayat[0] };
    }) },
  };
}

/** Single pairs that share an ayah, largest groups first; a pair joins one group only. */
function manyGroups(singles: AyahPair[]) {
  const candidates = (['a', 'b'] as const).flatMap(shared => {
    const byAyah = new Map<string, AyahPair[]>();
    for (const pair of singles) byAyah.set(pair[shared], [...(byAyah.get(pair[shared]) ?? []), pair]);
    return [...byAyah.values()].map(pairs => ({ shared, pairs }));
  });
  const used = new Set<AyahPair>();
  return candidates.sort((p, q) => q.pairs.length - p.pairs.length).flatMap(({ shared, pairs }) => {
    const free = pairs.filter(pair => !used.has(pair));
    if (free.length < 2) return [];
    free.forEach(pair => used.add(pair));
    return [{ shared, pairs: free }];
  });
}

/** The similar ayah pairs of two surahs as cards, lower surah first, in mushaf order. Kept pairs that continue each other become one
 *  range card, and an ayah paired with several far ones becomes one card (docs/plans/curated-passage-comparisons.md).
 *  `review` also shows the pairs curation left out, each with its verdict. */
function pairCards(x: number, y: number, review = false): PairCard[] {
  const pairs = pairsFor(review ? foundBySurah : bySurah, x, y);
  const alone = (pair: AyahPair) => !!verdictFor(pair.a, pair.b)?.alone;
  const kept = pairs.filter(keptPair);
  const chains = pairChains(kept.filter(pair => !alone(pair)));
  const groups = manyGroups(chains.filter(chain => chain.length === 1).map(chain => chain[0]));
  const grouped = new Set(groups.flatMap(group => group.pairs));
  const order = (pair: AyahPair) => [keyOrder(pair.a), keyOrder(pair.b)];
  return [
    ...chains.filter(chain => !grouped.has(chain[0])).map(chain => ({ at: chain[0], build: () => card(chain, review) })),
    ...kept.filter(alone).map(pair => ({ at: pair, build: () => card([pair], review) })),
    ...pairs.filter(pair => !keptPair(pair)).map(pair => ({ at: pair, build: () => card([pair], review) })),
    ...groups.map(group => ({ at: group.pairs[0], build: () => manyCard(group.pairs, group.shared, review) })),
  ].sort((p, q) => order(p.at)[0] - order(q.at)[0] || order(p.at)[1] - order(q.at)[1]).map(entry => entry.build());
}

type Marks = SpreadAyah['marks'];

/** One mark as one number, so the file holds no text: which ayah of the card, which word, what kind, which link. */
function encodeAyat(ayat: SpreadAyah[], links: Map<string, number>) {
  return ayat.flatMap((ayah, offset) => Object.entries((ayah.marks ?? {}) as NonNullable<Marks>).map(([word, mark]) => {
    if (!links.has(mark.link!)) links.set(mark.link!, links.size);
    return links.get(mark.link!)! + 1000 * (MARK_KINDS.indexOf(mark.kind as (typeof MARK_KINDS)[number]) + 3 * (Number(word) + 200 * offset));
  }));
}

function storedCard(card: PairCard) {
  const links = new Map<string, number>();
  const base = { p: card.pairs?.map(pair => pair.id) ?? [card.id], ...(card.group ? { g: card.group } : {}) };
  if (card.many) return { ...base, n: card.many.side, o: card.many.options.map(option => [encodeAyat([option.shared], links), encodeAyat([option.ayah], links)]) };
  return { ...base, m: card.sides.map(side => encodeAyat(side.ayat, links)) };
}

/** Every card of every page: pair ids, tree link and word marks. The reader joins back the ayah text and the verdicts. */
export function buildCompareCards() {
  const cards = Object.fromEntries(reviewPairs.map(({ a, b }) => [`${a}:${b}`, pairCards(a, b, true).map(storedCard)]));
  return { listed: listedPairs, review: reviewPairs, cards };
}
