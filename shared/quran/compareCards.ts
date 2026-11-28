
import { droppedBranch } from './branchVerdicts';

export const MARK_KINDS = ['exact', 'root', 'related'] as const;
export type MarkKind = (typeof MARK_KINDS)[number];
export type CardMark = { kind: MarkKind; link?: string };
export type CardAyah = { number: number; words: string[]; marks?: Record<number, CardMark> };

export type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: string; alone?: boolean; draft?: Partial<Verdict>; card?: boolean };

export type SurahPair = { a: number; b: number; count: number };

export type CardSide = { surah: number; ayah: number; ayat: CardAyah[]; rows?: number[][]; back?: boolean };
export type ManyOption = { id: string; ayah: CardAyah; shared: CardAyah };
export type PairCard = { id: string; group?: string; book?: number; verdict?: Verdict; pairs?: { id: string; verdict?: Verdict }[]; many?: { side: 0 | 1; options: ManyOption[] }; span?: [number, number][]; sides: [CardSide, CardSide] };

export type StoredCard = { p: string[]; g?: string; k?: number; s?: [number, number][]; m?: number[][]; n?: 0 | 1; o?: number[][][]; x?: 1; a?: number[][]; t?: 1; r?: number[][][]; b?: (0 | 1)[] };
export type StoredCards = { listed: SurahPair[]; review: SurahPair[]; cards: Record<string, StoredCard[]>; stories?: Record<string, StoredCard[]> };

export type WordsOf = (key: string) => string[] | undefined;

const NO_LINK = 999;

const parts = (key: string) => key.split(':').map(Number);

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
      return Math.floor(place / 200) === offset ? [[place % 200, { kind: MARK_KINDS[rest % 3], ...(code % 1000 === NO_LINK ? {} : { link: String(code % 1000) }) }]] : [];
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
    const shown = item.a?.[side] ?? Array.from({ length: to - from + 1 }, (_, i) => from + i);
    return { surah, ayah: shown[0], to: shown[shown.length - 1], ayat: ayatOf(words, surah, shown, item.m![side]) };
  });
  const rangeId = (side: (typeof sides)[number]) => `${side.surah}:${side.ayah}${side.to > side.ayah ? `-${side.to}` : ''}`;
  const verdict = item.p.length === 1 && !item.t && !item.k ? verdicts?.[item.p[0]] : undefined;
  return {
    id: item.p.length === 1 && !item.t ? item.p[0] : `${rangeId(sides[0])}|${rangeId(sides[1])}`,
    ...(item.g && !droppedBranch({ id: item.g }) ? { group: item.g } : {}),
    ...(item.k ? { book: item.k } : {}),
    ...(verdict ? { verdict } : {}),
    ...(item.p.length > 1 || item.t ? { pairs: item.p.map(pairVerdict(verdicts)) } : {}),
    sides: sides.map(({ surah, ayah, ayat }, s) => ({ surah, ayah, ayat, ...(item.r ? { rows: item.r[s] } : {}), ...(item.b?.[s] ? { back: true } : {}) })) as PairCard['sides'],
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

export function decodeCards(stored: StoredCards, words: WordsOf, x: number, y: number, verdicts?: Record<string, Verdict>): PairCard[] {
  return (stored.cards[`${Math.min(x, y)}:${Math.max(x, y)}`] ?? [])
    .filter(item => verdicts || !item.x)
    .map(item => (item.o ? manyCard(item, words, verdicts) : rangeCard(item, words, verdicts)));
}

export function shownCards(stored: StoredCards, words: WordsOf, x: number, y: number): PairCard[] {
  const story = stored.stories?.[`${Math.min(x, y)}:${Math.max(x, y)}`];
  return story ? story.map(item => (item.o ? manyCard(item, words, undefined) : rangeCard(item, words, undefined))) : decodeCards(stored, words, x, y);
}

export function encodeAyat(ayat: CardAyah[], links: Map<string, number>) {
  return ayat.flatMap((ayah, offset) => Object.entries(ayah.marks ?? {}).map(([word, mark]) => {
    if (mark.link === undefined) return encodeMark(offset, Number(word), mark.kind, NO_LINK);
    if (!links.has(mark.link)) {
      if (links.size >= NO_LINK) throw new Error('compare cards: a card has too many word links to store');
      links.set(mark.link, links.size);
    }
    return encodeMark(offset, Number(word), mark.kind, links.get(mark.link)!);
  }));
}

export function encodeShownCard(card: PairCard): StoredCard {
  const links = new Map<string, number>();
  const base: StoredCard = { p: card.pairs?.map(pair => pair.id) ?? [card.id], ...(card.group ? { g: card.group } : {}), ...(card.book ? { k: card.book } : {}) };
  if (card.many) return { ...base, n: card.many.side, o: card.many.options.map(option => [encodeAyat([option.shared], links), encodeAyat([option.ayah], links)]) };
  const story = card.pairs?.length === 1;
  return {
    ...base,
    a: card.sides.map(side => side.ayat.map(ayah => ayah.number)),
    m: card.sides.map(side => encodeAyat(side.ayat, links)),
    ...(story ? { t: 1 as const } : {}),
    ...(card.sides[0].rows ? { r: card.sides.map(side => side.rows!) } : {}),
    ...(card.sides.some(side => side.back) ? { b: card.sides.map(side => (side.back ? 1 : 0) as 0 | 1) } : {}),
  };
}

export type Visit = { lead: number; other: number; pair: SurahPair };

export function surahOrder(pairs: SurahPair[]): Visit[] {
  const groups = new Map<number, Visit[]>();
  for (const pair of pairs) {
    for (const [lead, other] of pair.a === pair.b ? [[pair.a, pair.a]] : [[pair.a, pair.b], [pair.b, pair.a]]) groups.set(lead, [...(groups.get(lead) ?? []), { lead, other, pair }]);
  }
  const self = (visit: Visit) => (visit.lead === visit.other ? 1 : 0);
  return [...groups.keys()].sort((x, y) => x - y).flatMap(n => [...groups.get(n)!].sort((p, q) => self(p) - self(q)));
}

export function closestPair(listed: SurahPair[], surah: number) {
  return listed.filter(pair => pair.a !== pair.b && (pair.a === surah || pair.b === surah)).sort((p, q) => q.count - p.count)[0];
}
