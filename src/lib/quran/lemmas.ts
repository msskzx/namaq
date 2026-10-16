// docs/plans/quran-repetition-merge.md
const ARABIC: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ', d: 'د', '*': 'ذ',
  r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض', T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', _: 'ـ', f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م',
  n: 'ن', h: 'ه', w: 'و', Y: 'ى', y: 'ي', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ', '~': 'ّ', o: 'ْ', '^': 'ٓ', '#': 'ٔ',
  '`': 'ٰ', '{': 'ٱ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ',
};
const MARKS = /[aiuoFNK~`^#:@"[;,.!\-+%\]]/g;

export const fromBuckwalter = (text: string) => [...text].map(c => ARABIC[c] ?? c).join('').normalize('NFC');

export type LemmaCount = [lemma: string, count: number, root: string];
export type LemmaCounts = { lemmas: LemmaCount[]; unlemmatized: number };
export type Side = { label: string; lemma: string; form?: string };
export type CountedSide = { label: string; lemma: string; form: boolean; count: number };

function* segments(morphology: string) {
  for (const line of morphology.split(/\r?\n/)) {
    if (!line.startsWith('(')) continue;
    const [location, form, , features] = line.split('\t');
    yield {
      word: location.slice(1, location.lastIndexOf(':')),
      form: form.replace(MARKS, ''),
      lemma: /\|LEM:([^|]+)/.exec(features)?.[1],
      root: /\|ROOT:([^|]+)/.exec(features)?.[1] ?? '',
    };
  }
}

export function countLemmas(morphology: string): LemmaCounts {
  const counts = new Map<string, { count: number; root: string }>();
  const words = new Map<string, boolean>();
  for (const { word, lemma, root } of segments(morphology)) {
    words.set(word, words.get(word) || lemma !== undefined);
    if (!lemma) continue;
    const entry = counts.get(lemma) ?? { count: 0, root };
    entry.count++;
    counts.set(lemma, entry);
  }
  const lemmas = [...counts]
    .sort((p, q) => q[1].count - p[1].count || (p[0] < q[0] ? -1 : 1))
    .map(([lemma, { count, root }]): LemmaCount => [fromBuckwalter(lemma.replace(/\d+$/, '')), count, fromBuckwalter(root)]);
  return { lemmas, unlemmatized: [...words.values()].filter(has => !has).length };
}

export function countPairs(morphology: string, pairs: [Side, Side][]): [CountedSide, CountedSide][] {
  const counts = new Map<string, number>();
  for (const { lemma, form } of segments(morphology)) {
    if (!lemma) continue;
    for (const key of [lemma, `${lemma}\t${form}`]) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const count = (s: Side): CountedSide => ({
    label: s.label,
    lemma: fromBuckwalter(s.lemma.replace(/\d+$/, '')),
    form: s.form !== undefined,
    count: counts.get(s.form === undefined ? s.lemma : `${s.lemma}\t${s.form}`) ?? 0,
  });
  return pairs.map(([a, b]) => [count(a), count(b)]);
}
