const RANK: Record<string, number> = {
  'ۧ': 0, 'ۨ': 0,
  'ّ': 1,
  'ٔ': 2, 'ٕ': 2, '٘': 2, 'ۜ': 2,
  'ً': 3, 'ٌ': 3, 'ٍ': 3, 'َ': 3, 'ُ': 3, 'ِ': 3, 'ْ': 3, 'ٰ': 3,
};

export const VOWEL_FIRST = /[ً-ِْٰ][ّٕٔ٘ۜۧۨ]|ّ[ۧۨ]/;

export const outOfMushafOrder = (text: string) => VOWEL_FIRST.test(text);

export function mushafMarkOrder(text: string): string {
  if (!outOfMushafOrder(text)) return text;
  const chars = [...text];
  for (let i = 1; i < chars.length; i++) {
    for (let j = i; j > 0 && RANK[chars[j]] !== undefined && RANK[chars[j - 1]] > RANK[chars[j]]; j--) {
      [chars[j - 1], chars[j]] = [chars[j], chars[j - 1]];
    }
  }
  return chars.join('');
}
