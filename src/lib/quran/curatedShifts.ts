// docs/plans/quran-within-surah.md
import { ayahWords, plainName } from './normalize';
import { findShifts } from './shifts';

export type Range = [number, number];
export type Mode = 'third' | 'first' | 'second';
export type Mark = [phrase: string, mode: Mode, within?: string];
export type Curated = { surah: number; parts: Range[]; note: string; marks: Record<number, Mark[]>; speakers?: Partial<Record<Mode, string>> };

export const MODES: Record<Mode, { label: string; sample: string; slot: number }> = {
  third: { label: 'غيبة: الحديث عن غائب', sample: 'هو، هم', slot: 1 },
  first: { label: 'تكلم: المتكلم عن نفسه', sample: 'أنا، نحن', slot: 2 },
  second: { label: 'خطاب: توجيه الكلام إلى مخاطب', sample: 'أنت، أنتم', slot: 3 },
};

export const CURATED: Curated[] = [
  { surah: 43, parts: [[22, 22], [23, 23]], note: 'دعوى واحدة يقولها فريقان: «قالوا» في ٢٢ و«قال مترفوها» في ٢٣. تتطابق العبارة المشتركة ويختلف الحرف الأخير: «مهتدون» و«مقتدون».', marks: { 22: [['مهتدون', 'first']], 23: [['مقتدون', 'first']] } },
  {
    surah: 12, parts: [[80, 80], [81, 83]], note: 'في ٨٠ يتكلم كبيرهم عن «أبيكم». من «ألم تعلموا» في ٨٠ إلى «فقولوا» في ٨١ كلام كبيرهم، ومن «يا أبانا» في ٨١ إلى ٨٢ كلام الإخوة لأبيهم الذي علّمهم إياه، فيتداخل الكلامان وينتقل المشهد بلا فاصل. في ٨٣ يرد الأب بـ«لكم».',
    speakers: { first: 'كبير الإخوة: كلامه لهم', third: 'الإخوة: ما يقولونه لأبيهم', second: 'الأب: رده عليهم' },
    marks: {
      80: [['الم تعلموا ان اباكم قد اخذ عليكم موثقا من الله ومن قبل ما فرطتم في يوسف فلن ابرح الارض حتي ياذن لي ابي او يحكم الله لي وهو خير الحكمين', 'first']],
      81: [['ارجعوا الي ابيكم فقولوا', 'first'], ['يابانا ان ابنك سرق وما شهدنا الا بما علمنا وما كنا للغيب حفظين', 'third']],
      82: [['*', 'third']],
      83: [['*', 'second']],
    },
  },
  {
    surah: 1, parts: [[2, 4], [5, 7]], note: 'في ٢–٤ الكلام عن الله بضمير الغائب: «لله» و«رب» و«مالك». في ٥ يصير خطابًا: «إياك نعبد»، ويبقى إلى «أنعمت» في ٧.',
    marks: {
      2: [['لله رب', 'third']],
      3: [['الرحمن الرحيم', 'third']],
      4: [['ملك', 'third']],
      5: [['اياك', 'second'], ['واياك', 'second']],
      7: [['انعمت', 'second']],
    },
  },
  {
    surah: 48, parts: [[8, 8], [9, 9]], note: '«أرسلناك» للمفرد في ٨ ثم «لتؤمنوا» للجمع في ٩. هذا في قراءة حفص، وفي قراءات أخرى «ليؤمنوا» فلا يقع التحول.',
    marks: {
      8: [['انا ارسلنك', 'first']],
      9: [['لتؤمنوا', 'second'], ['ورسوله', 'third'], ['وتعزروه وتوقروه وتسبحوه', 'second']],
    },
  },
  {
    surah: 10, parts: [[22, 22]], note: 'يخاطبهم الله بـ«يسيركم» و«كنتم»، ثم ينتقل إلى الحديث عنهم في «بهم» و«فرحوا» و«جاءهم» و«ظنوا»، ثم يحكي دعاءهم بلسانهم: «لئن أنجيتنا» و«لنكونن». كل هذا في آية واحدة.',
    speakers: { third: 'الخطاب لهم', first: 'الحديث عنهم', second: 'كلامهم هم' },
    marks: { 22: [['يسيركم', 'third'], ['كنتم', 'third'], ['بهم', 'first', 'وجرين بهم'], ['وفرحوا', 'first'], ['وجاءهم', 'first'], ['وظنوا انهم', 'first'], ['بهم دعوا', 'first'], ['لين انجيتنا', 'second'], ['لنكونن', 'second']] },
  },
  {
    surah: 35, parts: [[9, 9]], note: '«أرسل الرياح» غيبة ثم «فسقناه» و«فأحيينا» تكلم بنون العظمة.',
    marks: { 9: [['ارسل', 'third'], ['فسقنه', 'first'], ['فاحيينا', 'first']] },
  },
  {
    surah: 17, parts: [[1, 1]], note: '«أسرى بعبده» غيبة، ثم «باركنا» و«لنريه» تكلم، ثم «إنه هو السميع» غيبة.',
    marks: { 1: [['اسري بعبده', 'third'], ['بركنا', 'first'], ['لنريه', 'first'], ['ءايتنا', 'first'], ['انه هو', 'third']] },
  },
];

export const USED_MODES = (Object.keys(MODES) as Mode[]).filter(m => CURATED.some(c => Object.values(c.marks).flat().some(([, mode]) => mode === m)));

const find = (hay: string[], needle: string[]) => hay.flatMap((_, i) => (needle.every((w, k) => hay[i + k] === w) ? [i] : []));

export function resolve(norm: string[], [phrase, , within = phrase]: Mark): number[] {
  if (phrase === '*') return norm.map((_, i) => i);
  const [outer, inner] = [within.split(' '), phrase.split(' ')];
  const at = find(norm, outer);
  const off = find(outer, inner);
  if (at.length !== 1 || off.length !== 1) throw new Error(`«${phrase}» in «${within}» found ${at.length}×${off.length} times, not once`);
  return inner.map((_, k) => at[0] + off[0] + k);
}

export type Data = { names: Record<string, string>; ayat: Record<string, string> };
export type Surah = { number: number; name: string; plain: string };
export type CuratedView = { surah: Surah; note: string; speakers?: Curated['speakers']; parts: { from: number; to: number; ayat: { text: string; slots?: Record<number, number> }[] }[] };

export function buildCurated({ names, ayat }: Data): CuratedView[] {
  return CURATED.map(c => {
    const [lo, hi] = [c.parts[0][0], c.parts[c.parts.length - 1][1]];
    const words = Array.from({ length: hi - lo + 1 }, (_, k) => {
      const text = ayat[`${c.surah}:${lo + k}`];
      if (text === undefined) throw new Error(`${c.surah}:${lo + k} is missing from the data`);
      return ayahWords(text, false);
    });
    const slots = words.map((): Record<number, number> => ({}));
    for (const { a, b, len } of findShifts(words).arcs) {
      for (const at of [a, b]) for (let k = 0; k < len; k++) slots[at.ayah - 1][at.word + k] = 0;
    }
    for (const [ayah, marks] of Object.entries(c.marks)) {
      for (const m of marks) for (const i of resolve(words[Number(ayah) - lo].norm, m)) slots[Number(ayah) - lo][i] = MODES[m[1]].slot;
    }
    const name = names[c.surah] ?? '';
    return {
      surah: { number: c.surah, name, plain: plainName(name) },
      note: c.note,
      speakers: c.speakers,
      parts: c.parts.map(([from, to]) => ({
        from,
        to,
        ayat: words.slice(from - lo, to - lo + 1).map((w, k) => {
          const s = slots[from - lo + k];
          return { text: w.display.join(' '), slots: Object.keys(s).length ? s : undefined };
        }),
      })),
    };
  });
}
