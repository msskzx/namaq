// The iltifat page's seven examples (owner, 2026-11-13): each card draws its own picture. docs/plans/quran-within-surah.md
import data from '../data/quran/iltifat.json';
import surahs from '../data/quran/surahs.json';
import { num } from './arabicNumber';
import { ayahWords } from './normalize';

/** هو (غيبة), نحن or أنا (تكلم), أنت (خطاب). */
export type Voice = 'he' | 'we' | 'you';
export type Range = [number, number];
/** A phrase in the normalized words of its ayah; `within` places it when it occurs more than once. */
export type Mark = [phrase: string, voice: Voice, within?: string];
export type Step = { voice: Voice; label: string; at?: Range; note?: string; count?: number };
/** Words of one ayah, from the first word of `from` to the last word of `to`; either end left out runs to the ayah's edge. */
export type Span = { ayah: number; from?: string; to?: string };
export type Turn =
  | { cut: string }
  | { narration: Span[] }
  | { who: string; voice: Voice; side: 'start' | 'end'; spans: Span[]; said?: boolean };

type Base = { surah: number; from: number; to: number; source: string };
export type Example = Base & (
  | { kind: 'strip'; steps: Step[]; marks: Record<number, Mark[]> }
  | { kind: 'tree'; trunk: string; leaves: { ayah: number; who: string }[] }
  | { kind: 'dialog'; turns: Turn[]; marks: Record<number, Mark[]> }
);

const BURHAN = 'البرهان للزركشي والإتقان للسيوطي';

export const EXAMPLES: Example[] = [
  {
    kind: 'strip', surah: 1, from: 2, to: 7, source: BURHAN,
    steps: [{ voice: 'he', label: 'هو', at: [2, 4] }, { voice: 'you', label: 'أنت', at: [5, 7] }],
    marks: { 2: [['لله رب', 'he']], 3: [['الرحمن الرحيم', 'he']], 4: [['ملك', 'he']], 5: [['اياك', 'you'], ['واياك', 'you']], 7: [['انعمت', 'you']] },
  },
  {
    kind: 'strip', surah: 10, from: 22, to: 22, source: BURHAN,
    steps: [{ voice: 'you', label: 'أنتم' }, { voice: 'he', label: 'هم' }, { voice: 'we', label: '«نحن»', note: 'دعاؤهم' }],
    marks: { 22: [['يسيركم', 'you'], ['كنتم', 'you'], ['بهم', 'he', 'وجرين بهم'], ['وفرحوا', 'he'], ['وجاءهم', 'he'], ['وظنوا انهم', 'he'], ['بهم دعوا', 'he'], ['لين انجيتنا', 'we'], ['لنكونن', 'we']] },
  },
  {
    kind: 'strip', surah: 35, from: 9, to: 9, source: BURHAN,
    steps: [{ voice: 'he', label: 'هو' }, { voice: 'we', label: 'نحن' }],
    marks: { 9: [['ارسل', 'he'], ['فسقنه', 'we'], ['فاحيينا', 'we']] },
  },
  {
    kind: 'strip', surah: 17, from: 1, to: 1, source: 'التحرير والتنوير لابن عاشور',
    steps: [{ voice: 'he', label: 'هو' }, { voice: 'we', label: 'نحن' }, { voice: 'he', label: 'هو' }],
    marks: { 1: [['اسري بعبده', 'he'], ['بركنا', 'we'], ['لنريه', 'we'], ['ءايتنا', 'we'], ['انه هو', 'he']] },
  },
  {
    kind: 'strip', surah: 48, from: 8, to: 9, source: 'تفسير القرطبي: قرأ ابن كثير وأبو عمرو «ليؤمنوا» بالياء، فلا يقع التحول في قراءتهما',
    steps: [{ voice: 'you', label: 'أنتَ', at: [8, 8], count: 1 }, { voice: 'you', label: 'أنتم', at: [9, 9], count: 3 }],
    marks: { 8: [['ارسلنك', 'you']], 9: [['لتؤمنوا', 'you'], ['وتعزروه وتوقروه وتسبحوه', 'you']] },
  },
  {
    kind: 'tree', surah: 43, from: 22, to: 23, source: 'ليس من أمثلة كتب الالتفات: دعوى واحدة يقولها فريقان',
    trunk: 'انا وجدنا ءاباءنا علي امه وانا علي ءاثرهم',
    leaves: [{ ayah: 22, who: 'قالوا' }, { ayah: 23, who: 'قال مترفوها' }],
  },
  {
    kind: 'dialog', surah: 12, from: 80, to: 83, source: 'من تدبر صاحب الموقع، لا من كتب الالتفات',
    turns: [
      { narration: [{ ayah: 80, to: 'قال كبيرهم' }] },
      { who: 'كبيرهم، لإخوته', voice: 'he', side: 'start', spans: [{ ayah: 80, from: 'الم تعلموا' }, { ayah: 81, to: 'فقولوا' }] },
      { cut: 'عند أبيهم' },
      { who: 'إخوته، لأبيهم', voice: 'we', side: 'start', said: true, spans: [{ ayah: 81, from: 'يابانا' }, { ayah: 82 }] },
      { narration: [{ ayah: 83, to: 'قال' }] },
      { who: 'أبوهم، يرد', voice: 'you', side: 'end', spans: [{ ayah: 83, from: 'بل' }] },
    ],
    marks: { 81: [['فقولوا', 'we']] },
  },
];

const find = (hay: string[], needle: string[]) => hay.flatMap((_, i) => (needle.every((w, k) => hay[i + k] === w) ? [i] : []));

/** The word positions of a marked phrase; it must occur exactly once. */
export function resolve(norm: string[], [phrase, , within = phrase]: readonly [string, unknown, string?]): number[] {
  if (phrase === '*') return norm.map((_, i) => i);
  const [outer, inner] = [within.split(' '), phrase.split(' ')];
  const at = find(norm, outer);
  const off = find(outer, inner);
  if (at.length !== 1 || off.length !== 1) throw new Error(`«${phrase}» in «${within}» found ${at.length}×${off.length} times, not once`);
  return inner.map((_, k) => at[0] + off[0] + k);
}

export type Word = { text: string; voice?: Voice };
/** Words of one ayah; `end` is set when the line reaches the ayah's last word, where its number goes. */
export type Line = { ayah: number; words: Word[]; end: boolean };
export type TurnView =
  | { cut: string }
  | { narration: Line[] }
  | { who: string; voice: Voice; side: 'start' | 'end'; said: boolean; lines: Line[] };
export type ExampleView = { key: string; surah: number; name: string; from: number; to: number; source: string } & (
  | { kind: 'strip'; steps: Step[]; lines: Line[] }
  | { kind: 'tree'; trunk: string; leaves: { ayah: number; who: string; word: string }[] }
  | { kind: 'dialog'; turns: TurnView[] }
);

const ayat: Record<string, string> = data.ayat;
const names: Record<number, string> = Object.fromEntries(surahs.map(row => [row.number, row.name]));

function wordsOf(surah: number, ayah: number) {
  const text = ayat[`${surah}:${ayah}`];
  if (text === undefined) throw new Error(`${surah}:${ayah} is missing from the data`);
  return ayahWords(text, false);
}

function voiced(surah: number, ayah: number, marks: Record<number, Mark[]>): Word[] {
  const { display, norm } = wordsOf(surah, ayah);
  const voices: (Voice | undefined)[] = display.map(() => undefined);
  for (const mark of marks[ayah] ?? []) for (const i of resolve(norm, mark)) voices[i] = mark[1];
  return display.map((text, i) => (voices[i] ? { text, voice: voices[i] } : { text }));
}

function spanLine(surah: number, { ayah, from, to }: Span, marks: Record<number, Mark[]>): Line {
  const { norm } = wordsOf(surah, ayah);
  const start = from ? resolve(norm, [from, 'he'])[0] : 0;
  const stop = to ? resolve(norm, [to, 'he']).at(-1)! + 1 : norm.length;
  return { ayah, words: voiced(surah, ayah, marks).slice(start, stop), end: stop === norm.length };
}

/** «٢–٧», or «٢٢» for one ayah. */
export const rangeLabel = ({ from, to }: { from: number; to: number }) => (from === to ? num(from) : `${num(from)}–${num(to)}`);

export const exampleKey = (example: { surah: number; from: number }) => `${example.surah}:${example.from}`;

export function exampleView(example: Example): ExampleView {
  const base = { key: exampleKey(example), surah: example.surah, name: names[example.surah], from: example.from, to: example.to, source: example.source };
  if (example.kind === 'strip') {
    const lines = Array.from({ length: example.to - example.from + 1 }, (_, k) => example.from + k)
      .map(ayah => ({ ayah, words: voiced(example.surah, ayah, example.marks), end: true }));
    return { ...base, kind: 'strip', steps: example.steps, lines };
  }
  if (example.kind === 'tree') {
    const trunk = example.trunk.split(' ');
    const leaves = example.leaves.map(({ ayah, who }) => {
      const { display, norm } = wordsOf(example.surah, ayah);
      const at = resolve(norm, [example.trunk, 'he']);
      return { ayah, who, word: display[at.at(-1)! + 1], trunk: display.slice(at[0], at[0] + trunk.length).join(' ') };
    });
    return { ...base, kind: 'tree', trunk: leaves[0].trunk, leaves: leaves.map(({ ayah, who, word }) => ({ ayah, who, word })) };
  }
  const turns = example.turns.map((turn): TurnView => {
    if ('cut' in turn) return turn;
    if ('narration' in turn) return { narration: turn.narration.map(span => spanLine(example.surah, span, example.marks)) };
    return { who: turn.who, voice: turn.voice, side: turn.side, said: !!turn.said, lines: turn.spans.map(span => spanLine(example.surah, span, example.marks)) };
  });
  return { ...base, kind: 'dialog', turns };
}

/** In mushaf order. */
export const examples = (): ExampleView[] => [...EXAMPLES].sort((a, b) => a.surah - b.surah || a.from - b.from).map(exampleView);

/** The two words split into the letters they share and the letter that differs, each letter with its marks. */
export function letterDiff(a: string, b: string): [before: string, differ: string, after: string][] {
  const letters = (word: string) => word.match(/[^ً-ٰٟۖ-ۭ࣓-ࣿ][ً-ٰٟۖ-ۭ࣓-ࣿ]*/gu) ?? [];
  const [x, y] = [letters(a), letters(b)];
  const strip = (letter: string) => letter[0];
  let start = 0;
  while (start < x.length && start < y.length && strip(x[start]) === strip(y[start])) start++;
  let end = 0;
  while (end < x.length - start && end < y.length - start && strip(x[x.length - 1 - end]) === strip(y[y.length - 1 - end])) end++;
  const split = (l: string[]) => [l.slice(0, start).join(''), l.slice(start, l.length - end).join(''), l.slice(l.length - end).join('')] as [string, string, string];
  return [split(x), split(y)];
}
