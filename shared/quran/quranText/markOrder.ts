const RANK: Record<string, number> = {
  'ۧ': 0, 'ۨ': 0,
  'ّ': 1,
  'ٔ': 2, 'ٕ': 2, '٘': 2, 'ۜ': 2,
  'ً': 3, 'ٌ': 3, 'ٍ': 3, 'َ': 3, 'ُ': 3, 'ِ': 3, 'ْ': 3, 'ٰ': 3,
};

const SAME_CLASS = new Set(['ۧ', 'ۨ', 'ٔ', '٘', 'ۜ']);

const goesBefore = (mark: string, previous: string) => RANK[mark] !== undefined && RANK[previous] !== undefined
  && RANK[previous] > RANK[mark] && !(SAME_CLASS.has(mark) && SAME_CLASS.has(previous));

const MARKS = Object.keys(RANK);

export const VOWEL_FIRST = new RegExp(MARKS.flatMap(previous => MARKS.filter(mark => goesBefore(mark, previous)).map(mark => previous + mark)).join('|'));

export const outOfMushafOrder = (text: string) => VOWEL_FIRST.test(text);

export function mushafMarkOrder(text: string): string {
  if (!outOfMushafOrder(text)) return text;
  const chars = [...text];
  for (let i = 1; i < chars.length; i++) {
    for (let j = i; j > 0 && goesBefore(chars[j], chars[j - 1]); j--) [chars[j - 1], chars[j]] = [chars[j], chars[j - 1]];
  }
  return chars.join('');
}
