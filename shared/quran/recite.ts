import { ayahHref } from '../ayahMarks';

/**
 * Recite mode (تسميع) in the Quran reader: ayat from a starting ayah on are hidden in place on the page,
 * and the reader reveals them one ayah, or one word, at a time.
 */
export type AyahKey = string; // "57:1"
export type RecitePosition = {
  /** First hidden ayah when reciting began; ayat before it stay visible as context. */
  start: AyahKey;
  /**
   * The forgotten words of `start` under review (owner, 2026-11-21): their places in it (from 0, the ۞ mark not counted), in
   * order. The ayah and the page after it are hidden as in any recitation; each step shows the ayah up to the next forgotten
   * word, then that word, and so on to its end.
   */
  gaps?: number[];
  /** Last ayah revealed in full, or null before the first reveal. */
  shown: AyahKey | null;
  /** Words revealed so far of the ayah after `shown`. */
  words: number;
};

export const parseKey = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return { surah, ayah };
};
export const isKey = (key: string | null | undefined): key is AyahKey => !!key && /^\d{1,3}:\d{1,3}$/.test(key);

export function compareKeys(a: AyahKey, b: AyahKey) {
  const [x, y] = [parseKey(a), parseKey(b)];
  return x.surah - y.surah || x.ayah - y.ayah || Number(a.split(':')[2] ?? -1) - Number(b.split(':')[2] ?? -1);
}

/** The ayah before `key` in the mushaf, given each surah's ayah count. */
export function previousKey(key: AyahKey, counts: ReadonlyMap<number, number>): AyahKey | null {
  const { surah, ayah } = parseKey(key);
  if (ayah > 1) return `${surah}:${ayah - 1}`;
  const count = counts.get(surah - 1);
  return count ? `${surah - 1}:${count}` : null;
}

/** The ayah the next reveal shows, among the ayat on the shown pages (in page order); null when it is past them. */
export function nextAyah(position: RecitePosition, order: readonly AyahKey[]): AyahKey | null {
  const after = position.shown;
  return order.find(key => compareKeys(key, position.start) >= 0 && (!after || compareKeys(key, after) > 0)) ?? null;
}

/** Whether a word of the page is hidden: `word` counts that ayah's words on the shown pages from 0. */
export function isHidden(position: RecitePosition, key: AyahKey, word: number, next: AyahKey | null) {
  if (compareKeys(key, position.start) < 0) return false;
  if (position.shown && compareKeys(key, position.shown) <= 0) return false;
  return !(key === next && word < position.words);
}

export const revealAyah = (position: RecitePosition, next: AyahKey): RecitePosition => ({ ...position, shown: next, words: 0 });

/** One more word of the next ayah; the last word completes the ayah. */
export function revealWord(position: RecitePosition, next: AyahKey, length: number): RecitePosition {
  return position.words + 1 >= length ? revealAyah(position, next) : { ...position, words: position.words + 1 };
}

/** Hides the words of a partly shown ayah first, then the last revealed ayah. */
export function stepBack(position: RecitePosition, counts: ReadonlyMap<number, number>): RecitePosition {
  if (position.words > 0) return { ...position, words: 0 };
  if (!position.shown) return position;
  const before = previousKey(position.shown, counts);
  return { ...position, shown: before && compareKeys(before, position.start) >= 0 ? before : null };
}

export const atStart = (position: RecitePosition) => !position.shown && position.words === 0;

/** URL form: ?recite=57:1&upto=57:4&w=2, and ?recite=57:1&word=3,7 for the forgotten words of the ayah. */
export function readPosition(params: { get(name: string): string | null }): RecitePosition | null {
  const start = params.get('recite');
  if (!isKey(start)) return null;
  const upto = params.get('upto');
  const words = Number(params.get('w'));
  const gaps = (params.get('word') ?? '').split(',').filter(word => /^(?:0|[1-9]\d*)$/.test(word)).map(Number);
  return {
    start,
    ...(gaps.length ? { gaps: [...new Set(gaps)].sort((a, b) => a - b) } : {}),
    shown: isKey(upto) && compareKeys(upto, start) >= 0 ? upto : null,
    words: Number.isInteger(words) && words > 0 ? words : 0,
  };
}

export function positionQuery(position: RecitePosition, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ recite: position.start, ...(position.gaps?.length ? { word: position.gaps.join(',') } : {}), ...(position.shown ? { upto: position.shown } : {}), ...(position.words ? { w: String(position.words) } : {}), ...extra });
  return params.toString();
}

/**
 * A forgotten ayah as the first place of a review (`mark` is the ayah, or one word of it as "s:a:w"). A whole ayah forgotten
 * is recited whole; otherwise every forgotten word of it (in `due`, the marks due for review) is one of its gaps, so an ayah
 * is one stop of a review however many of its words were forgotten (owner, 2026-11-21).
 */
export function reviewPosition(mark: string, due: Record<string, unknown> = {}): RecitePosition {
  const [surah, ayah, word] = mark.split(':');
  const start = `${surah}:${ayah}`;
  const gaps = new Set(Object.keys(due).filter(key => key.startsWith(`${start}:`) && /^\d+$/.test(key.split(':')[2] ?? '')).map(key => Number(key.split(':')[2])));
  if (word !== undefined) gaps.add(Number(word));
  if (due[start] || !gaps.size) return { start, shown: null, words: 0 };
  return { start, gaps: [...gaps].sort((a, b) => a - b), shown: null, words: 0 };
}

/** The website's link that reviews the forgotten ayat from `mark` on, in mushaf order (the app's reviewForgotten). */
export const reviewHref = (mark: string, due: Record<string, unknown> = {}) => `${ayahHref(mark)}?${positionQuery(reviewPosition(mark, due), { review: '1' }).replace(/%3A/g, ':').replace(/%2C/g, ',')}`;

/** Forgotten ayat in mushaf order, and the one after `current` (wrapping to the first). */
export function forgottenOrder(keys: Iterable<AyahKey>) {
  return [...keys].filter(key => /^\d{1,3}:\d{1,3}(?::\d+)?$/.test(key)).sort(compareKeys);
}
export function nextForgotten(keys: readonly AyahKey[], current: AyahKey): AyahKey | null {
  return keys.find(key => compareKeys(key, current) > 0) ?? null;
}

/** The ayat a review stops at, in mushaf order: each forgotten ayah once, whether it or some of its words were forgotten. */
export const forgottenAyat = (keys: Iterable<AyahKey>) => [...new Set(forgottenOrder(keys).map(key => key.split(':').slice(0, 2).join(':')))];

/**
 * A review that began at `from` (owner, 2026-11-21: «ما نسيت» starts at the page open) goes on in mushaf order to the last
 * forgotten ayah, then wraps to the first and ends before `from`. Its place in that order, for the next stop and the count.
 */
const reviewRank = (key: AyahKey, from: AyahKey) => (compareKeys(key, from) >= 0 ? 0 : 1);
const reviewCompare = (a: AyahKey, b: AyahKey, from: AyahKey) => reviewRank(a, from) - reviewRank(b, from) || compareKeys(a, b);

/** The forgotten ayah after `current` in a review that began at `from`; null once it has gone round to `from`. */
export function nextInReview(ayat: readonly AyahKey[], current: AyahKey, from: AyahKey): AyahKey | null {
  return [...ayat].sort((a, b) => reviewCompare(a, b, from)).find(key => reviewCompare(key, current, from) > 0) ?? null;
}

/** How many forgotten ayat come before `current` in a review that began at `from`. */
export const reviewedBefore = (ayat: readonly AyahKey[], current: AyahKey, from: AyahKey) => ayat.filter(key => reviewCompare(key, current, from) < 0).length;
