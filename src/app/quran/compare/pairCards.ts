import treeData from '@/app/quran/branches/trees.json';
import type { Verdict } from '@/lib/quran/curation/comparePairs';
import type { SurahPair } from '@/lib/quran/mutashabih/pairs';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import generated from './compareCards';

export type CardSide = { surah: number; ayah: number; ayat: SpreadAyah[] };
/** One ayah against several far ones: `side` holds the partners. `shared` is the one ayah with the marks of that pairing. */
export type ManyOption = { id: string; ayah: SpreadAyah; shared: SpreadAyah };
/** `pairs` lists the ayah pairs of a range or one-to-many card; a single-pair card has `verdict` instead. */
export type PairCard = { id: string; group?: string; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; many?: { side: 0 | 1; options: ManyOption[] }; sides: [CardSide, CardSide] };
export type ReviewState = 'checked' | 'ask';

/** `npm run quran:compare-cards` writes this from the pairs and verdicts (docs/plans/curated-passage-comparisons.md). */
const stored = generated as unknown as { listed: SurahPair[]; review: SurahPair[]; states: Record<string, ReviewState>; cards: Record<string, PairCard[]>; links: [string, string, string][] };

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));

export const listedPairs = stored.listed;
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
export const reviewPairs = stored.review;
export const reviewStates = () => stored.states;

const withWords = (surah: number) => (ayah: SpreadAyah): SpreadAyah => ({ ...ayah, words: words.get(`${surah}:${ayah.number}`) ?? [] });

function withText(card: PairCard): PairCard {
  const sides = card.sides.map(side => ({ ...side, ayat: side.ayat.map(withWords(side.surah)) })) as PairCard['sides'];
  if (!card.many) return { ...card, sides };
  const { side, options } = card.many;
  const [partners, shared] = [sides[side].surah, sides[side === 0 ? 1 : 0].surah];
  return { ...card, sides, many: { side, options: options.map(option => ({ ...option, ayah: withWords(partners)(option.ayah), shared: withWords(shared)(option.shared) })) } };
}

function withoutVerdicts(card: PairCard): PairCard {
  const plain = { ...card, ...(card.pairs ? { pairs: card.pairs.map(pair => ({ id: pair.id })) } : {}) };
  delete plain.verdict;
  return plain;
}

/** The cards of two surahs, lower surah first, in mushaf order. `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  const cards = (stored.cards[`${Math.min(x, y)}:${Math.max(x, y)}`] ?? []).map(withText);
  return review ? cards : cards.filter(card => card.verdict?.keep !== false).map(withoutVerdicts);
}

const linksByAyah = new Map<string, [string, string, string][]>();
for (const link of stored.links) for (const key of [link[0], link[1]]) linksByAyah.set(key, [...(linksByAyah.get(key) ?? []), link]);

/** The compare card that holds two of these ayat as a kept pair, on a listed page. */
export function compareLinkFor(keys: string[]): string | undefined {
  const shown = new Set(keys);
  return keys.flatMap(key => linksByAyah.get(key) ?? []).find(([a, b]) => shown.has(a) && shown.has(b))?.[2];
}
