// docs/plans/quran-repetition-merge.md
import { num } from '@shared/quran/arabicNumber';

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

/**
 * Names for the corpus lemmas that share a spelling, which the corpus tells apart only by a number («عصا ١» was the verb
 * "disobey", «عصا ٢» the staff). Each says which word it is. docs/plans/word-counts-app.md
 */
export const SHARED_SPELLINGS: Record<string, string> = {
  'ma`lik': 'مَٰلِك (المالك)', 'ma`lik2': 'مَٰلِك (خازن النار)',
  '<i*aA': 'إِذَا (الظرفية)', '<i*aA2': 'إِذَا (الفجائية)',
  maE: 'مَع (ظرف)', maE2: 'مَع (حرف)',
  Hayov: 'حَيْث (ظرف)', Hayov2: 'حَيْث (شرط)',
  '>awofaY`': 'أَوْفَىٰ (فعل)', '>awofaY`2': 'أَوْفَىٰ (اسم تفضيل)',
  EaSaA: 'عَصَىٰ (فعل)', EaSaA2: 'عَصَا (العصا)',
  'Sa`liH': 'صَٰلِح (الصالح)', 'Sa`liH2': 'صَٰلِح عليه السلام',
  huwd: 'هُود عليه السلام', huwd2: 'هُود (اليهود)',
  EaAd: 'عَاد (المعتدي)', EaAd2: 'عَاد (القوم)',
  baEol: 'بَعْل (الزوج)', baEol2: 'بَعْل (الصنم)',
  'ja`hiliy~ap': 'جَٰهِلِيَّة (اسم)', 'ja`hiliy~ap2': 'جَٰهِلِيَّة (علم)',
  jawaAb: 'جَوَاب (الرد)', jawaAb2: 'جَوَاب (الأحواض)',
  yugaAvu: 'يُغَاث (من الغوث)', yugaAvu2: 'يُغَاث (من الغيث)',
  '>aHoSaY`': 'أَحْصَىٰ (فعل)', '>aHoSaY`2': 'أَحْصَىٰ (اسم تفضيل)',
  EaSof: 'عَصْف (التبن)', EaSof2: 'عَصْف (الهبوب)',
};

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
    for (const lemma of group) {
      names.set(lemma, group.length === 1 ? word : SHARED_SPELLINGS[lemma] ?? `${word} ${num(Number(/\d+$/.exec(lemma)?.[0] ?? 1))}`);
    }
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

/** Every word that holds each lemma, in mushaf order, as "surah:ayah:word" joined by spaces. */
export function lemmaPlaces(morphology: string): Record<string, string> {
  const places = new Map<string, string[]>();
  for (const { word, lemma } of segments(morphology)) {
    if (!lemma) continue;
    const list = places.get(lemma) ?? [];
    if (list[list.length - 1] !== word) list.push(word);
    places.set(lemma, list);
  }
  const names = lemmaNames(places.keys());
  return Object.fromEntries([...places].map(([lemma, words]) => [names.get(lemma)!, words.join(' ')]));
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

/**
 * The app's word data: the counted lemmas as countLemmas gives them, and for each ayah (surah by surah) one entry per
 * corpus word, the places in that list of the lemmas the word holds, joined by "+" ("" for a word with none).
 */
export function wordLemmas(morphology: string): { lemmas: LemmaCount[]; ayat: string[][] } {
  const { lemmas } = countLemmas(morphology);
  const ids = new Map<string, number>();
  const names = lemmaNames(new Set([...segments(morphology)].flatMap(({ lemma }) => (lemma ? [lemma] : []))));
  lemmas.forEach(([name], i) => ids.set(name, i));
  const ayat: string[][][] = [];
  for (const { word, lemma } of segments(morphology)) {
    const [surah, ayah, at] = word.split(':').map(Number);
    const words = ((ayat[surah - 1] ??= [])[ayah - 1] ??= []);
    words[at - 1] ??= '';
    if (!lemma) continue;
    const id = String(ids.get(names.get(lemma)!));
    if (!words[at - 1].split('+').includes(id)) words[at - 1] = words[at - 1] ? `${words[at - 1]}+${id}` : id;
  }
  return { lemmas, ayat: ayat.map(surah => surah.map(words => words.join(' '))) };
}
