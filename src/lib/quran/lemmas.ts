// docs/plans/quran-repetition-merge.md
import { num } from './arabicNumber';

const ARABIC: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', A: 'ا', b: 'ب', p: 'ة', t: 'ت', v: 'ث', j: 'ج', H: 'ح', x: 'خ', d: 'د', '*': 'ذ',
  r: 'ر', z: 'ز', s: 'س', $: 'ش', S: 'ص', D: 'ض', T: 'ط', Z: 'ظ', E: 'ع', g: 'غ', _: 'ـ', f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م',
  n: 'ن', h: 'ه', w: 'و', Y: 'ى', y: 'ي', F: 'ً', N: 'ٌ', K: 'ٍ', a: 'َ', u: 'ُ', i: 'ِ', '~': 'ّ', o: 'ْ', '^': 'ٓ', '#': 'ٔ',
  '`': 'ٰ', '{': 'ٱ', ':': 'ۜ', '@': '۟', '"': '۠', '[': 'ۢ', ';': 'ۣ', ',': 'ۥ', '.': 'ۦ', '!': 'ۨ', '-': '۪', '+': '۫', '%': '۬', ']': 'ۭ',
};
const MARKS = /[aiuoFNK~`^#:@"[;,.!\-+%\]]/g;

export const fromBuckwalter = (text: string) => [...text].map(c => {
  if (!Object.hasOwn(ARABIC, c)) throw new Error(`Unknown Buckwalter character "${c}" in "${text}"`);
  return ARABIC[c];
}).join('').normalize('NFC');

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

function lemmaNames(lemmas: Iterable<string>) {
  const spellings = new Map<string, string[]>();
  for (const lemma of lemmas) {
    const word = fromBuckwalter(lemma.replace(/\d+$/, ''));
    spellings.set(word, [...(spellings.get(word) ?? []), lemma]);
  }
  const names = new Map<string, string>();
  for (const [word, group] of spellings) {
    for (const lemma of group) names.set(lemma, group.length > 1 ? `${word} ${num(Number(/\d+$/.exec(lemma)?.[0] ?? 1))}` : word);
  }
  return names;
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
  const names = lemmaNames(counts.keys());
  const lemmas = [...counts]
    .sort((p, q) => q[1].count - p[1].count || (p[0] < q[0] ? -1 : 1))
    .map(([lemma, { count, root }]): LemmaCount => [names.get(lemma)!, count, fromBuckwalter(root)]);
  return { lemmas, unlemmatized: [...words.values()].filter(has => !has).length };
}

export function countPairs(morphology: string, pairs: [Side, Side][]): [CountedSide, CountedSide][] {
  const counts = new Map<string, number>();
  const lemmas = new Set<string>();
  for (const { lemma, form } of segments(morphology)) {
    if (!lemma) continue;
    lemmas.add(lemma);
    for (const key of [lemma, `${lemma}\t${form}`]) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const names = lemmaNames(lemmas);
  const count = (s: Side): CountedSide => {
    const found = counts.get(s.form === undefined ? s.lemma : `${s.lemma}\t${s.form}`);
    if (!found) throw new Error(`No ${s.form === undefined ? `lemma ${s.lemma}` : `form ${s.form} of lemma ${s.lemma}`} in the corpus for ${s.label}`);
    return { label: s.label, lemma: names.get(s.lemma)!, form: s.form !== undefined, count: found };
  };
  return pairs.map(([a, b]) => [count(a), count(b)]);
}
