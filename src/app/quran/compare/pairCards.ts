import treeData from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { num } from '@shared/quran/arabicNumber';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';
import { withUnappliedReviews } from '@/lib/quran/curation/reviewLog';
import { compareAnchor } from '@shared/compareBookmarks';
import { juzOf } from '@shared/quran/juz';
import type { SurahSpans } from '@shared/quran/compareScope';
import generated from '@shared/data/quran/compareCards';
import { decodeCards, encodeShownCard, type CardMark, type PairCard, type StoredCards, type Verdict } from '@shared/quran/compareCards';
import type { BranchAyah } from '@shared/quran/branches';
import { normalizeWord } from '@shared/quran/normalize';
import { STORIES } from '@shared/quran/prophets/stories';
import type { Story, StoryEvent } from '@shared/quran/prophets/story';
import links from '@/lib/quran/curation/compareLinks.json';
import { rootWeights, similarAyahPair } from '@/lib/quran/mutashabih/similar';
import { dailyPair, dayNumber } from '@shared/dailyPick';

export type { CardSide, ManyOption, PairCard } from '@shared/quran/compareCards';
export type ReviewState = 'checked' | 'ask' | 'dropped';

/** `npm run quran:compare-cards` writes this from the pairs and verdicts (docs/plans/curated-passage-comparisons.md). */
const stored = generated as unknown as StoredCards;

const words = new Map((treeData.ayat as { key: string; words: string[] }[]).map(ayah => [ayah.key, ayah.words]));

export const listedPairs = stored.listed;

/** The homepage's look-alike pair for the server's calendar day, the same card the app shows that day. */
export const todaysPair = (date = new Date()) => dailyPair(stored, key => words.get(key), dayNumber(date));
/** Review still lists every page the engine finds, so a page whose cards were all left out can be looked at again. */
export const reviewPairs = stored.review;

/** Where the owner's review of each page stands: a question waiting, every pair checked, or checked with none kept. */
export function reviewStates(): Record<string, ReviewState> {
  const states: Record<string, ReviewState> = {};
  const current = withUnappliedReviews(compareVerdicts);
  for (const { a, b } of reviewPairs) {
    // A page with a story judges its parts too, under the pairs they hold or their own.
    const ids = partsFor(a, b).length ? pairCards(a, b, true).flatMap(card => card.pairs?.map(pair => pair.id) ?? [card.id]) : (stored.cards[`${a}:${b}`] ?? []).flatMap(card => card.p);
    const verdicts = ids.map(id => current[id]);
    if (verdicts.some(verdict => verdict?.ask)) states[`${a}:${b}`] = 'ask';
    else if (verdicts.every(verdict => verdict?.checked)) states[`${a}:${b}`] = verdicts.some(verdict => verdict?.keep !== false) ? 'checked' : 'dropped';
  }
  return states;
}

/** The first and last juz and mushaf page each surah reaches, for the side pane's filter. */
export const surahSpans: SurahSpans = { juz: {}, page: {} };
const widen = (spans: Record<number, [number, number]>, surah: number, value: number) => {
  const span = spans[surah];
  spans[surah] = span ? [Math.min(span[0], value), Math.max(span[1], value)] : [value, value];
};
for (const ayah of treeData.ayat as { key: string; page: number }[]) {
  const surah = Number(ayah.key.split(':')[0]);
  widen(surahSpans.juz, surah, juzOf(ayah.key));
  widen(surahSpans.page, surah, ayah.page);
}

const rangeNumbers = (text: string) => {
  const [from, to = from] = (text.split(':')[1] ?? '').split('-').map(Number);
  if (!Number.isInteger(from) || !Number.isInteger(to) || to < from) throw new Error(`compareLinks.json: bad ayah range "${text}"`);
  return Array.from({ length: to - from + 1 }, (_, k) => from + k);
};
const surahOfRange = (text: string) => Number(text.split(':')[0]);

const quran = new Map((treeData.ayat as unknown as BranchAyah[]).map(ayah => [ayah.key, ayah]));
let weights: Map<string, number> | undefined;
const LEVELS = ['exact', 'letters', 'lemma', 'root'];
const OPEN = { minWords: 0, minCoverage: 0, minWeight: 0, minWholeWords: 0 };
const RARE = 2;
const kindOf = (level: string): CardMark['kind'] => (level === 'root' ? 'related' : level === 'lemma' ? 'root' : 'exact');

/** Marks across one story part: the engine's word links between every two ayat on words with a rare root, then, as on the story pages, words in a run of two the other side also has. */
function partMarks(surahs: [number, number], sides: [number[], number[]]) {
  weights ??= rootWeights([...quran.values()]);
  const marks = [new Map<number, Record<number, CardMark>>(), new Map<number, Record<number, CardMark>>()];
  const mark = (side: number, n: number, word: number, value: CardMark) => {
    const ayah = marks[side].get(n) ?? {};
    ayah[word] ??= value;
    marks[side].set(n, ayah);
  };
  const columns = sides[0].flatMap(a => sides[1].flatMap(b => {
    const [ayahA, ayahB] = [quran.get(`${surahs[0]}:${a}`)!, quran.get(`${surahs[1]}:${b}`)!];
    // The parts are curated as one stretch of the story, so no pair has to pass the engine's bar; a word only needs a root rarer than «قال».
    const pair = similarAyahPair(ayahA, ayahB, weights!, OPEN);
    return pair?.columns.filter(([i]) => (weights!.get(ayahA.roots?.[i] ?? '') ?? 0) >= RARE).map(([i, j, level]) => ({ a, i, b, j, level: level ?? '' })) ?? [];
  })).sort((p, q) => LEVELS.indexOf(p.level) - LEVELS.indexOf(q.level));
  columns.forEach((column, c) => {
    const link = marks[0].get(column.a)?.[column.i]?.link ?? marks[1].get(column.b)?.[column.j]?.link ?? String(c);
    mark(0, column.a, column.i, { kind: kindOf(column.level), link });
    mark(1, column.b, column.j, { kind: kindOf(column.level), link });
  });
  const norms = sides.map((numbers, s) => numbers.map(n => ({ n, norm: (words.get(`${surahs[s]}:${n}`) ?? []).map(normalizeWord) })));
  const bigrams = norms.map(side => new Set(side.flatMap(({ norm }) => norm.slice(1).map((word, k) => `${norm[k]} ${word}`))));
  norms.forEach((side, s) => side.forEach(({ n, norm }) => {
    const shared = (k: number) => k >= 0 && k + 1 < norm.length && bigrams[1 - s].has(`${norm[k]} ${norm[k + 1]}`);
    norm.forEach((_, k) => { if (shared(k - 1) || shared(k)) mark(s, n, k, { kind: 'exact' }); });
  }));
  return marks;
}

/** One card of a story told in two surahs: rows that line up across the sides, each the ayah numbers of one stretch; a side with none in a row is silent there. */
type Part = { rows: [number[], number[]][] };
type StoryPages = { storyParts?: { parts: (string | string[])[] }[]; timelineStories?: { story: string; surahs: number[] }[] };

/** Hand-cut parts (compareLinks.json `storyParts`): one row "2:35|7:19", or rows ["2:30-33|", "2:34|7:11", "|7:12-18"]. */
function curatedParts(x: number, y: number): Part[][] {
  return ((links as StoryPages).storyParts ?? []).flatMap(({ parts }) => {
    const rows = parts.map(part => (Array.isArray(part) ? part : [part]).map(row => row.split('|')));
    const [as, bs] = [0, 1].map(s => rows.flat(1).map(row => row[s]).filter(Boolean));
    if (surahOfRange(as[0]) !== x || surahOfRange(bs[0]) !== y) return [];
    const stray = [...as.filter(a => surahOfRange(a) !== x), ...bs.filter(b => surahOfRange(b) !== y)];
    if (stray.length) throw new Error(`compareLinks.json: ${stray.join(', ')} outside ${x}:${y}`);
    return [rows.map(part => ({ rows: part.map(([a, b]) => [a ? rangeNumbers(a) : [], b ? rangeNumbers(b) : []] as [number[], number[]]) }))];
  });
}

/**
 * Parts drawn from a prophet's timeline (compareLinks.json `timelineStories`): an event both surahs tell is a card, and an
 * event only one tells is a row on the next such card (the last, past the end). Only the stretch of each surah that holds
 * a shared event counts, so a passing mention elsewhere in the surah stays out.
 */
export function timelineParts(story: Story, [x, y]: [number, number]): Part[] {
  const told = (event: StoryEvent, surah: number) => event.segments.filter(segment => segment.surah === surah).flatMap(({ range: [lo, hi] }) => Array.from({ length: hi - lo + 1 }, (_, k) => lo + k));
  const shared = story.events.filter(event => told(event, x).length && told(event, y).length);
  const stretch = (surah: number) => {
    const all = new Set(story.events.flatMap(event => told(event, surah)));
    const kept = new Set<number>();
    for (const start of shared.flatMap(event => told(event, surah))) {
      for (let n = start; all.has(n) && !kept.has(n); n--) kept.add(n);
      for (let n = start + 1; all.has(n) && !kept.has(n); n++) kept.add(n);
    }
    return kept;
  };
  const [keptX, keptY] = [stretch(x), stretch(y)];
  const parts: Part[] = [];
  let pending: [number[], number[]][] = [];
  for (const event of story.events) {
    const row: [number[], number[]] = [told(event, x).filter(n => keptX.has(n)), told(event, y).filter(n => keptY.has(n))];
    if (!row[0].length && !row[1].length) continue;
    pending.push(row);
    if (row[0].length && row[1].length) {
      parts.push({ rows: pending });
      pending = [];
    }
  }
  if (pending.length && parts.length) parts[parts.length - 1].rows.push(...pending);
  return joinFilledGaps(parts);
}

const sideOf = (part: Part, s: number) => [...new Set(part.rows.flatMap(row => row[s]))].sort((p, q) => p - q);
const gapsOf = (numbers: number[]) => numbers.length ? Array.from({ length: numbers[numbers.length - 1] - numbers[0] + 1 }, (_, k) => numbers[0] + k).filter(n => !numbers.includes(n)) : [];

/**
 * Two events a surah tells interleaved (البقرة 57, 58-59, 60-61: the town inside the manna) would leave a hole in one
 * card that the other fills, so they join: the one-sided rows stay, and the shared rows become one unbroken row.
 */
function joinFilledGaps(parts: Part[]): Part[] {
  for (let i = 0; i < parts.length; i++) for (let j = 0; j < parts.length; j++) {
    if (i === j || ![0, 1].some(s => {
      const gaps = gapsOf(sideOf(parts[i], s));
      return gaps.length > 0 && gaps.every(n => sideOf(parts[j], s).includes(n));
    })) continue;
    const both = [parts[i], parts[j]];
    const shared = both.flatMap(part => part.rows.filter(row => row[0].length && row[1].length));
    const joined: Part = { rows: [...both.flatMap(part => part.rows.filter(row => !row[0].length || !row[1].length)), [0, 1].map(s => [...new Set(shared.flatMap(row => row[s]))].sort((p, q) => p - q)) as [number[], number[]]] };
    return joinFilledGaps(parts.flatMap((part, k) => (k === i ? [joined] : k === j ? [] : [part])));
  }
  return parts;
}

/** Per card and side: whether the side starts before an earlier card's side started, stepping back in its surah. */
export function stepsBack(cards: [number[], number[]][]): [boolean, boolean][] {
  return cards.map((sides, p) => sides.map((numbers, s) => {
    const before = cards.slice(0, p).flatMap(earlier => earlier[s].slice(0, 1));
    return numbers.length > 0 && before.length > 0 && numbers[0] < Math.max(...before);
  }) as [boolean, boolean]);
}

function partsFor(x: number, y: number): Part[][] {
  const derived = ((links as StoryPages).timelineStories ?? []).filter(({ surahs }) => surahs[0] === x && surahs[1] === y).map(({ story, surahs }) => timelineParts(STORIES[story], [surahs[0], surahs[1]]));
  return [...curatedParts(x, y), ...derived];
}

/**
 * A story told in both surahs, as parts that each line up one stretch of it, in place of the engine's cards inside it.
 * Each engine pair goes with the part holding its first ayah. Cards run in the first surah's order, and a second side
 * that steps back in its surah is marked `back`.
 */
function withStoryParts(cards: PairCard[], x: number, y: number, verdicts?: Record<string, Verdict>): PairCard[] {
  // Parts gather every engine pair inside the story, a pair curation left out too, so a part is judged the same way in
  // review and on the page; off review, a part shows once one of its pairs is kept, like any card.
  const everyPair = verdicts ? undefined : engineCards(x, y, true);
  const judged = verdicts ?? compareVerdicts;
  return partsFor(x, y).reduce((current, unsorted) => {
    const ayatOf = (part: Part) => [0, 1].map(s => [...new Set(part.rows.flatMap(row => row[s]))].sort((p, q) => p - q)) as [number[], number[]];
    // The first surah reads forward, as on every compare page; the second side is marked where it steps back.
    const parts = [...unsorted].sort((p, q) => ayatOf(p)[0][0] - ayatOf(q)[0][0]);
    const sideAyat = parts.map(part => [0, 1].map(s => [...new Set(part.rows.flatMap(row => row[s]))].sort((p, q) => p - q)) as [number[], number[]]);
    const told = [0, 1].map(s => new Set(sideAyat.flatMap(sides => sides[s])));
    const back = stepsBack(sideAyat);
    const pairsOf = (card: PairCard) => card.pairs ?? [{ id: card.id, ...(card.verdict ? { verdict: card.verdict } : {}) }];
    const ayahOfKey = (key: string) => Number(key.split(':')[1]);
    const inStory = (card: PairCard) => !card.many && pairsOf(card).every(({ id }) => {
      const [a, b] = id.split('|');
      return told[0].has(ayahOfKey(a)) && told[1].has(ayahOfKey(b));
    });
    const inside = (everyPair ?? current).filter(inStory);
    const taken = inside.flatMap(pairsOf);
    const groupOf = (pairs: { id: string }[]) => inside.find(card => card.group && pairsOf(card).some(pair => pairs.some(own => own.id === pair.id)))?.group;
    const surahs: [number, number] = [x, y];
    // An ayah an engine card already marks keeps those marks, curated links included; each link keeps its card's name so a tap lights its own partner.
    const engineMarks = [new Map<number, Record<number, CardMark>>(), new Map<number, Record<number, CardMark>>()];
    for (const card of inside) card.sides.forEach((side, s) => side.ayat.forEach(ayah => {
      if (!engineMarks[s].has(ayah.number) && Object.keys(ayah.marks ?? {}).length) engineMarks[s].set(ayah.number, Object.fromEntries(Object.entries(ayah.marks!).map(([word, mark]) => [word, { ...mark, ...(mark.link ? { link: `${card.id}/${mark.link}` } : {}) }])));
    }));
    const storyCards = parts.map((part, p): PairCard => {
      const sides = sideAyat[p];
      const marks = [new Map<number, Record<number, CardMark>>(), new Map<number, Record<number, CardMark>>()];
      for (const row of part.rows) if (row[0].length && row[1].length) partMarks(surahs, row).forEach((side, s) => side.forEach((ayah, n) => marks[s].set(n, ayah)));
      engineMarks.forEach((side, s) => side.forEach((ayah, n) => { if (sides[s].includes(n)) marks[s].set(n, ayah); }));
      const firstIds = sides.map((numbers, s) => `${surahs[s]}:${numbers[0]}`).join('|');
      // A pair goes with the part that shows both its ayat, else with the part holding its first.
      const holds = (q: number, id: string) => id.split('|').every((key, s) => sideAyat[q][s].includes(ayahOfKey(key)));
      const pairs = taken.filter(({ id }) => holds(p, id) || (!parts.some((_, q) => holds(q, id)) && sides[0].includes(ayahOfKey(id.split('|')[0]))));
      return {
        id: sides.map((numbers, s) => `${surahs[s]}:${numbers[0]}${numbers.length > 1 ? `-${numbers[numbers.length - 1]}` : ''}`).join('|'),
        // A part with no engine pair is judged under its first two ayat, so the owner can keep or drop it like any card.
        ...(groupOf(pairs) ? { group: groupOf(pairs) } : {}),
        pairs: (pairs.length ? pairs : [{ id: firstIds }]).map(({ id }) => ({ id, ...(verdicts?.[id] ? { verdict: verdicts[id] } : {}) })),
        sides: sides.map((numbers, s) => {
          return {
            surah: surahs[s],
            ayah: numbers[0],
            ayat: numbers.map(number => ({ number, words: words.get(`${surahs[s]}:${number}`) ?? [], marks: marks[s].get(number) ?? {} })),
            ...(part.rows.length > 1 ? { rows: part.rows.map(row => row[s]) } : {}),
            ...(back[p][s] ? { back: true } : {}),
          };
        }) as PairCard['sides'],
      };
    });
    const shown = verdicts ? storyCards : storyCards.filter(card => card.pairs!.some(({ id }) => judged[id]?.keep === true));
    const found = current.findIndex(inStory);
    const at = found >= 0 ? found : [...current, null].findIndex(card => !card || card.sides[0].ayah > storyCards[0].sides[0].ayah);
    return [...current.slice(0, at).filter(card => !inStory(card)), ...shown, ...current.slice(at).filter(card => !inStory(card))];
  }, cards);
}

/** The engine's cards of two surahs, before any story takes its stretch of them. */
export function engineCards(x: number, y: number, review = false): PairCard[] {
  return decodeCards(stored, key => words.get(key), Math.min(x, y), Math.max(x, y), review ? withUnappliedReviews(compareVerdicts) : undefined);
}

function cardsOf(key: string, review: boolean) {
  const [x, y] = key.split(':').map(Number);
  return withStoryParts(engineCards(x, y, review), x, y, review ? withUnappliedReviews(compareVerdicts) : undefined);
}

/** Every listed page with a story, its cards as this page shows them off review, for the phone app (`stories` in the card file). */
export function storyCards() {
  return Object.fromEntries(listedPairs.filter(({ a, b }) => partsFor(a, b).length).map(({ a, b }) => [`${a}:${b}`, pairCards(a, b).map(encodeShownCard)]));
}

/** The cards of two surahs, lower surah first, in mushaf order. `review` also shows the pairs curation left out, each with its verdict. */
export function pairCards(x: number, y: number, review = false): PairCard[] {
  return cardsOf(`${Math.min(x, y)}:${Math.max(x, y)}`, review);
}

const holders = new Map<string, string>();
// Only engine pairs link in: a story part's own pair, judged under its first ayat, is no parallel the engine found.
for (const { a, b } of listedPairs) {
  const engine = new Set(engineCards(a, b).flatMap(card => card.pairs?.map(pair => pair.id) ?? [card.id]));
  for (const card of cardsOf(`${a}:${b}`, false)) {
    const shows = (key: string) => card.sides.some(side => side.ayat.some(ayah => `${side.surah}:${ayah.number}` === key)) || !!card.many?.options.some(option => `${card.sides[card.many!.side].surah}:${option.ayah.number}` === key);
    // A story part can hold an engine pair whose ayah it leaves out; a link there would open a card without it.
    for (const id of card.pairs?.map(pair => pair.id) ?? [card.id]) if (engine.has(id) && id.split('|').every(shows) && compareVerdicts[id]?.keep !== false) holders.set(id, `/quran/compare?a=${a}&b=${b}#${compareAnchor(card.sides[0], card.sides[1])}`);
  }
}
const pairsByAyah = new Map<string, string[]>();
for (const id of holders.keys()) for (const key of id.split('|')) pairsByAyah.set(key, [...(pairsByAyah.get(key) ?? []), id]);

/** The first compare card (mushaf order of surah pairs) holding two of these ayat as a kept pair, on a listed page. */
export function compareLinkFor(keys: string[]): string | undefined {
  return compareLinksFor(keys)[0]?.href;
}

/** A tree's way into compare: one listed surah pair holding a kept card of two of its ayat. */
export type CompareLink = { href: string; label: string; labelEn: string; surahs?: [number, number] };

const surahName = (n: number) => surahRows.find(row => row.number === n);

/**
 * Every listed surah pair holding a kept card of two of these ayat, one link each in mushaf order: a tree across
 * two surahs has one, a tree across more gets a short list to choose from (the «في المقارنة» button).
 */
export function compareLinksFor(keys: string[]): CompareLink[] {
  const shown = new Set(keys);
  const ids = [...new Set(keys.flatMap(key => pairsByAyah.get(key) ?? []))].filter(pair => pair.split('|').every(key => shown.has(key)));
  const bySurahs = new Map<string, string>();
  for (const id of ids) {
    const [x, y] = id.split('|').map(key => key.split(':').map(Number));
    const pair = x[0] < y[0] ? [x, y] : [y, x];
    const at = `${pair[0][0]}:${pair[1][0]}`;
    if (!bySurahs.has(at)) bySurahs.set(at, id);
  }
  return [...bySurahs].sort(([p], [q]) => {
    const [pa, pb] = p.split(':').map(Number);
    const [qa, qb] = q.split(':').map(Number);
    return pa - qa || pb - qb;
  }).map(([, id]) => {
    const [x, y] = id.split('|').map(key => key.split(':').map(Number)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const [a, b] = [surahName(x[0]), surahName(y[0])];
    const itself = x[0] === y[0];
    return {
      href: holders.get(id)!,
      label: `${a?.name} مع ${itself ? 'نفسها' : b?.name} · ${num(x[1])} · ${num(y[1])}`,
      labelEn: `${a?.nameTransliterated} with ${itself ? 'itself' : b?.nameTransliterated} · ${x[1]} · ${y[1]}`,
      surahs: [x[0], y[0]] as [number, number],
    };
  });
}

/**
 * Every listed surah pair holding a kept card of this one ayah, one link each in mushaf order (the reader's
 * ayah menu): the card's own anchor, labelled with the partner ayah.
 */
export function compareLinksOfAyah(key: string): CompareLink[] {
  const [own] = key.split(':').map(Number);
  const bySurahs = new Map<string, string>();
  for (const id of pairsByAyah.get(key) ?? []) {
    const partner = id.split('|').find(other => other !== key) ?? key;
    const surah = Number(partner.split(':')[0]);
    const at = `${Math.min(own, surah)}:${Math.max(own, surah)}`;
    if (!bySurahs.has(at)) bySurahs.set(at, id);
  }
  return [...bySurahs].sort(([p], [q]) => {
    const [pa, pb] = p.split(':').map(Number);
    const [qa, qb] = q.split(':').map(Number);
    return pa - qa || pb - qb;
  }).map(([, id]) => {
    const partner = id.split('|').find(other => other !== key) ?? key;
    const [surah, ayah] = partner.split(':').map(Number);
    const row = surahName(surah);
    return { href: holders.get(id)!, label: `${row?.name} ${num(ayah)}`, labelEn: `${row?.nameTransliterated} ${ayah}` };
  });
}
