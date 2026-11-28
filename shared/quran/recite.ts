import { ayahHref } from '../ayahMarks';

export type AyahKey = string;
export type RecitePosition = {
  start: AyahKey;
  gaps?: number[];
  shown: AyahKey | null;
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

export function previousKey(key: AyahKey, counts: ReadonlyMap<number, number>): AyahKey | null {
  const { surah, ayah } = parseKey(key);
  if (ayah > 1) return `${surah}:${ayah - 1}`;
  const count = counts.get(surah - 1);
  return count ? `${surah - 1}:${count}` : null;
}

export function nextAyah(position: RecitePosition, order: readonly AyahKey[]): AyahKey | null {
  const after = position.shown;
  return order.find(key => compareKeys(key, position.start) >= 0 && (!after || compareKeys(key, after) > 0)) ?? null;
}

export function isHidden(position: RecitePosition, key: AyahKey, word: number, next: AyahKey | null) {
  if (compareKeys(key, position.start) < 0) return false;
  if (position.shown && compareKeys(key, position.shown) <= 0) return false;
  return !(key === next && word < position.words);
}

export const revealAyah = (position: RecitePosition, next: AyahKey): RecitePosition => ({ ...position, shown: next, words: 0 });

export function revealWord(position: RecitePosition, next: AyahKey, length: number): RecitePosition {
  return position.words + 1 >= length ? revealAyah(position, next) : { ...position, words: position.words + 1 };
}

export function stepBack(position: RecitePosition, counts: ReadonlyMap<number, number>): RecitePosition {
  if (position.words > 0) return { ...position, words: 0 };
  if (!position.shown) return position;
  const before = previousKey(position.shown, counts);
  return { ...position, shown: before && compareKeys(before, position.start) >= 0 ? before : null };
}

export const atStart = (position: RecitePosition) => !position.shown && position.words === 0;

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

export function reviewPosition(mark: string, due: Record<string, unknown> = {}): RecitePosition {
  const [surah, ayah, word] = mark.split(':');
  const start = `${surah}:${ayah}`;
  const gaps = new Set(Object.keys(due).filter(key => key.startsWith(`${start}:`) && /^\d+$/.test(key.split(':')[2] ?? '')).map(key => Number(key.split(':')[2])));
  if (word !== undefined) gaps.add(Number(word));
  if (due[start] || !gaps.size) return { start, shown: null, words: 0 };
  return { start, gaps: [...gaps].sort((a, b) => a - b), shown: null, words: 0 };
}

export const reviewHref = (mark: string, due: Record<string, unknown> = {}) => `${ayahHref(mark)}?${positionQuery(reviewPosition(mark, due), { review: '1' }).replace(/%3A/g, ':').replace(/%2C/g, ',')}`;

export function forgottenOrder(keys: Iterable<AyahKey>) {
  return [...keys].filter(key => /^\d{1,3}:\d{1,3}(?::\d+)?$/.test(key)).sort(compareKeys);
}
export function nextForgotten(keys: readonly AyahKey[], current: AyahKey): AyahKey | null {
  return keys.find(key => compareKeys(key, current) > 0) ?? null;
}

export const forgottenAyat = (keys: Iterable<AyahKey>) => [...new Set(forgottenOrder(keys).map(key => key.split(':').slice(0, 2).join(':')))];

const reviewRank = (key: AyahKey, from: AyahKey) => (compareKeys(key, from) >= 0 ? 0 : 1);
const reviewCompare = (a: AyahKey, b: AyahKey, from: AyahKey) => reviewRank(a, from) - reviewRank(b, from) || compareKeys(a, b);

export function nextInReview(ayat: readonly AyahKey[], current: AyahKey, from: AyahKey): AyahKey | null {
  return [...ayat].sort((a, b) => reviewCompare(a, b, from)).find(key => reviewCompare(key, current, from) > 0) ?? null;
}

export const reviewedBefore = (ayat: readonly AyahKey[], current: AyahKey, from: AyahKey) => ayat.filter(key => reviewCompare(key, current, from) < 0).length;
