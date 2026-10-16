// docs/plans/quran-repetition-merge.md
const ARABIC: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ', d: 'د', '*': 'ذ',
  r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض', T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', _: 'ـ', f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م',
  n: 'ن', h: 'ه', w: 'و', Y: 'ى', y: 'ي', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ', '~': 'ّ', o: 'ْ', '^': 'ٓ', '#': 'ٔ',
  '`': 'ٰ', '{': 'ٱ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ',
};

export const fromBuckwalter = (text: string) => [...text].map(c => ARABIC[c] ?? c).join('').normalize('NFC');

export type LemmaCount = [lemma: string, count: number, root: string];
export type LemmaCounts = { lemmas: LemmaCount[]; unlemmatized: number };

export function countLemmas(morphology: string): LemmaCounts {
  const counts = new Map<string, { count: number; root: string }>();
  const words = new Map<string, boolean>();
  for (const line of morphology.split(/\r?\n/)) {
    if (!line.startsWith('(')) continue;
    const [location, , , features] = line.split('\t');
    const word = location.slice(1, location.lastIndexOf(':'));
    const lemma = /\|LEM:([^|]+)/.exec(features)?.[1];
    words.set(word, words.get(word) || lemma !== undefined);
    if (!lemma) continue;
    const entry = counts.get(lemma) ?? { count: 0, root: /\|ROOT:([^|]+)/.exec(features)?.[1] ?? '' };
    entry.count++;
    counts.set(lemma, entry);
  }
  const lemmas = [...counts]
    .sort((p, q) => q[1].count - p[1].count || (p[0] < q[0] ? -1 : 1))
    .map(([lemma, { count, root }]): LemmaCount => [fromBuckwalter(lemma.replace(/\d+$/, '')), count, fromBuckwalter(root)]);
  return { lemmas, unlemmatized: [...words.values()].filter(has => !has).length };
}
