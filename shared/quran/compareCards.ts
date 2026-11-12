/** The compare page's cards, read back from the file `npm run quran:compare-cards` writes (shared/data/quran/compareCards.js). */

import { droppedBranch } from './branchVerdicts';

export const MARK_KINDS = ['exact', 'root', 'related'] as const;
export type MarkKind = (typeof MARK_KINDS)[number];
/** `link` names the matched pair a word belongs to: tapping it lights its partner. */
export type CardMark = { kind: MarkKind; link?: string };
export type CardAyah = { number: number; words: string[]; marks?: Record<number, CardMark> };

/** A reader's verdict on one engine pair: is it a real parallel, or only shared vocabulary?
 *  `checked`: the owner reviewed it. `ask`: Claude is unsure and asks the owner this question.
 *  `alone`: this pair keeps its own card and never joins a range or one-to-many card.
 *  `draft`: the verdict before the owner's button press, so the press can be undone; empty when there was none.
 *  `card`: the owner decided this pair with a card's buttons, so a press on the whole page leaves it alone. */
export type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: string; alone?: boolean; draft?: Partial<Verdict>; card?: boolean };

/** Two surahs with at least one similar ayah pair, lower surah first. */
export type SurahPair = { a: number; b: number; count: number };

export type CardSide = { surah: number; ayah: number; ayat: CardAyah[] };
/** One ayah against several far ones: `side` holds the partners. `shared` is the one ayah with the marks of that pairing. */
export type ManyOption = { id: string; ayah: CardAyah; shared: CardAyah };
/** `pairs` lists the ayah pairs of a range or one-to-many card; a single-pair card has `verdict` instead. */
export type PairCard = { id: string; group?: string; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; many?: { side: 0 | 1; options: ManyOption[] }; span?: [number, number][]; sides: [CardSide, CardSide] };

/** One card as stored: its pair ids, tree link, range, word marks (`m`, or `n` and `o` for one-to-many) and `x` when only review shows it. */
export type StoredCard = { p: string[]; g?: string; s?: [number, number][]; m?: number[][]; n?: 0 | 1; o?: number[][][]; x?: 1 };
export type StoredCards = { listed: SurahPair[]; review: SurahPair[]; cards: Record<string, StoredCard[]> };

/** The words of an ayah ("2:255"), from the bundled Quran text. */
export type WordsOf = (key: string) => string[] | undefined;

const parts = (key: string) => key.split(':').map(Number);

/** One mark is one number: which ayah of the card, which word, what kind, which link. */
export function encodeMark(offset: number, word: number, kind: MarkKind, link: number) {
  return link + 1000 * (MARK_KINDS.indexOf(kind) + 3 * (word + 200 * offset));
}

function ayatOf(words: WordsOf, surah: number, numbers: number[], codes: number[]): CardAyah[] {
  return numbers.map((number, offset) => ({
    number,
    words: words(`${surah}:${number}`) ?? [],
    marks: Object.fromEntries(codes.flatMap(code => {
      const rest = Math.floor(code / 1000);
      const place = Math.floor(rest / 3);
      return Math.floor(place / 200) === offset ? [[place % 200, { kind: MARK_KINDS[rest % 3], link: String(code % 1000) }]] : [];
    })),
  }));
}

type Verdicts = Record<string, Verdict> | undefined;

const pairVerdict = (verdicts: Verdicts) => (id: string) => {
  const verdict = verdicts?.[id];
  return { id, ...(verdict ? { verdict } : {}) };
};

function rangeCard(item: StoredCard, words: WordsOf, verdicts: Verdicts): PairCard {
  const keys = item.p.map(id => id.split('|'));
  const sides = [0, 1].map(side => {
    const surah = parts(keys[0][side])[0];
    const numbers = keys.map(key => parts(key[side])[1]);
    const [from, to] = item.s?.[side] ?? [Math.min(...numbers), Math.max(...numbers)];
    return { surah, ayah: from, to, ayat: ayatOf(words, surah, Array.from({ length: to - from + 1 }, (_, i) => from + i), item.m![side]) };
  });
  const rangeId = (side: (typeof sides)[number]) => `${side.surah}:${side.ayah}${side.to > side.ayah ? `-${side.to}` : ''}`;
  const verdict = item.p.length === 1 ? verdicts?.[item.p[0]] : undefined;
  return {
    id: item.p.length === 1 ? item.p[0] : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(item.g && !droppedBranch({ id: item.g }) ? { group: item.g } : {}),
    ...(verdict ? { verdict } : {}),
    ...(item.p.length > 1 ? { pairs: item.p.map(pairVerdict(verdicts)) } : {}),
    sides: sides.map(({ surah, ayah, ayat }) => ({ surah, ayah, ayat })) as PairCard['sides'],
  };
}

function manyCard(item: StoredCard, words: WordsOf, verdicts: Verdicts): PairCard {
  const side = item.n!;
  const shared = side === 0 ? 1 : 0;
  const keys = item.p.map(id => id.split('|'));
  const surah = parts(keys[0][side])[0];
  const sharedKey = keys[0][shared];
  const [sharedSurah, sharedAyah] = parts(sharedKey);
  const options = keys.map((key, i) => ({
    id: item.p[i],
    ayah: ayatOf(words, surah, [parts(key[side])[1]], item.o![i][1])[0],
    shared: ayatOf(words, sharedSurah, [sharedAyah], item.o![i][0])[0],
  }));
  const partners = `${surah}:${options.map(option => option.ayah.number).join(',')}`;
  const sides = [] as unknown as PairCard['sides'];
  sides[side] = { surah, ayah: options[0].ayah.number, ayat: [options[0].ayah] };
  sides[shared] = { surah: sharedSurah, ayah: sharedAyah, ayat: [options[0].shared] };
  return {
    id: side === 1 ? `${sharedKey}|${partners}` : `${partners}|${sharedKey}`,
    ...(item.g && !droppedBranch({ id: item.g }) ? { group: item.g } : {}),
    pairs: item.p.map(pairVerdict(verdicts)),
    many: { side, options },
    sides,
  };
}

/** The cards of two surahs in mushaf order. Without `verdicts` (review) only the cards a reader kept. */
export function decodeCards(stored: StoredCards, words: WordsOf, x: number, y: number, verdicts?: Record<string, Verdict>): PairCard[] {
  return (stored.cards[`${Math.min(x, y)}:${Math.max(x, y)}`] ?? [])
    .filter(item => verdicts || !item.x)
    .map(item => (item.o ? manyCard(item, words, verdicts) : rangeCard(item, words, verdicts)));
}

/** One stop when stepping through pages: a surah pair seen from `lead`, the surah being browsed. */
export type Visit = { lead: number; other: number; pair: SurahPair };

/**
 * The pages in the order the side pane lists them in mushaf order: under each surah, every pair it is in,
 * so a pair comes twice (once under each of its surahs). Swiping walks this list, so after opening 3·2
 * from under surah 3 the next page is 3·4, not 2·4.
 */
export function surahOrder(pairs: SurahPair[]): Visit[] {
  const groups = new Map<number, Visit[]>();
  for (const pair of pairs) {
    for (const [lead, other] of pair.a === pair.b ? [[pair.a, pair.a]] : [[pair.a, pair.b], [pair.b, pair.a]]) groups.set(lead, [...(groups.get(lead) ?? []), { lead, other, pair }]);
  }
  // A surah with itself comes last under it, after its pairs with other surahs.
  const self = (visit: Visit) => (visit.lead === visit.other ? 1 : 0);
  return [...groups.keys()].sort((x, y) => x - y).flatMap(n => [...groups.get(n)!].sort((p, q) => self(p) - self(q)));
}

/** The other surah a surah shares the most ayat with (not the surah with itself). */
export function closestPair(listed: SurahPair[], surah: number) {
  return listed.filter(pair => pair.a !== pair.b && (pair.a === surah || pair.b === surah)).sort((p, q) => q.count - p.count)[0];
}
