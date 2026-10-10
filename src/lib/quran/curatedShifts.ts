// docs/plans/quran-within-surah.md
import { ayahWords, plainName } from './normalize';
import { findShifts } from './shifts';

export type Range = [number, number];
export type Mode = 'third' | 'first' | 'second';
export type Mark = [phrase: string, mode: Mode, within?: string];
export type Curated = { surah: number; parts: Range[]; note: string; marks: Record<number, Mark[]> };

export const MODES: Record<Mode, { label: string; sample: string; slot: number }> = {
  third: { label: 'غيبة: الحديث عن غائب', sample: 'هو، هم', slot: 1 },
  first: { label: 'تكلم: المتكلم عن نفسه', sample: 'أنا، نحن', slot: 2 },
  second: { label: 'خطاب: توجيه الكلام إلى مخاطب', sample: 'أنت، أنتم', slot: 3 },
};

export const CURATED: Curated[] = [
  { surah: 43, parts: [[22, 22], [23, 23]], note: 'دعوى واحدة يقولها فريقان: «قالوا» في ٢٢ و«قال مترفوها» في ٢٣. تتطابق العبارة المشتركة ويختلف الحرف الأخير: «مهتدون» و«مقتدون».', marks: {} },
  {
    surah: 12, parts: [[80, 80], [81, 83]], note: 'في ٨٠ يتكلم كبيرهم عن «أبيكم». في ٨١ تصير الكلمات كلام الإخوة: «يا أبانا». في ٨٣ يرد الأب بـ«لكم». يمتد التحول من ٨٠ إلى ٨٣.',
    marks: {
      80: [['استيسوا منه خلصوا', 'third'], ['قال كبيرهم', 'third'], ['تعلموا', 'second'], ['اباكم', 'second'], ['عليكم', 'second'], ['اخذ', 'third'], ['فرطتم', 'second'], ['ابرح', 'first'], ['ياذن', 'third'], ['يحكم', 'third'], ['لي ابي', 'first'], ['لي', 'first', 'الله لي'], ['وهو', 'third']],
      81: [['ارجعوا', 'second'], ['ابيكم', 'second'], ['فقولوا', 'second'], ['يابانا', 'first'], ['ابنك', 'second'], ['سرق', 'third'], ['شهدنا', 'first'], ['علمنا', 'first'], ['كنا', 'first']],
      82: [['وسل', 'second'], ['كنا', 'first'], ['فيها', 'third', 'كنا فيها'], ['اقبلنا', 'first'], ['فيها', 'third', 'اقبلنا فيها'], ['وانا', 'first']],
      83: [['قال', 'third'], ['سولت', 'third'], ['لكم انفسكم', 'second'], ['عسي', 'third'], ['ياتيني بهم', 'third'], ['انه هو', 'third']],
    },
  },
  {
    surah: 1, parts: [[2, 4], [5, 7]], note: 'في ٢–٤ الكلام عن الله بضمير الغائب: «لله» و«رب» و«مالك». في ٥ يصير خطابًا: «إياك نعبد»، ويبقى إلى «أنعمت» في ٧، ثم يعود إلى الغيبة في «عليهم».',
    marks: {
      2: [['لله رب', 'third']],
      3: [['الرحمن الرحيم', 'third']],
      4: [['ملك', 'third']],
      5: [['اياك', 'second'], ['نعبد', 'first'], ['واياك', 'second'], ['نستعين', 'first']],
      6: [['اهدنا', 'first']],
      7: [['انعمت', 'second'], ['عليهم', 'third', 'انعمت عليهم'], ['عليهم', 'third', 'المغضوب عليهم']],
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
    surah: 10, parts: [[22, 22]], note: '«كنتم في الفلك» خطاب ثم «وجرين بهم» غيبة، في آية واحدة.',
    marks: { 22: [['هو', 'third'], ['يسيركم', 'third'], ['كنتم', 'second'], ['بهم', 'third', 'وجرين بهم'], ['وجرين', 'third'], ['وفرحوا بها جاءتها', 'third'], ['وجاءهم', 'third'], ['وظنوا انهم احيط بهم دعوا', 'third'], ['له', 'third'], ['انجيتنا', 'second'], ['لنكونن', 'first']] },
  },
  {
    surah: 35, parts: [[9, 9]], note: '«أرسل الرياح» غيبة ثم «فسقناه» و«فأحيينا» تكلم بنون العظمة.',
    marks: { 9: [['ارسل', 'third'], ['فتثير', 'third'], ['فسقنه', 'first'], ['فاحيينا', 'first'], ['به', 'third'], ['موتها', 'third']] },
  },
  {
    surah: 17, parts: [[1, 1]], note: '«أسرى بعبده» غيبة، ثم «باركنا» و«لنريه» تكلم، ثم «إنه هو السميع» غيبة.',
    marks: { 1: [['اسري بعبده', 'third'], ['بركنا', 'first'], ['حوله', 'third'], ['لنريه', 'first'], ['ءايتنا', 'first'], ['انه هو', 'third']] },
  },
  {
    surah: 40, parts: [[26, 26]], note: 'في آية واحدة يتحول كلام فرعون: «ذروني» خطاب لقومه، و«أقتل» و«إني أخاف» تكلم عن نفسه، و«وليدع ربه» غيبة عن موسى، ثم «دينكم» خطاب من جديد.',
    marks: { 26: [['وقال', 'third'], ['ذروني', 'second'], ['اقتل', 'first'], ['وليدع', 'third'], ['ربه', 'third'], ['اني', 'first'], ['اخاف', 'first'], ['يبدل', 'third'], ['دينكم', 'second'], ['يظهر', 'third']] },
  },
];

export const USED_MODES = (Object.keys(MODES) as Mode[]).filter(m => CURATED.some(c => Object.values(c.marks).flat().some(([, mode]) => mode === m)));

const find = (hay: string[], needle: string[]) => hay.flatMap((_, i) => (needle.every((w, k) => hay[i + k] === w) ? [i] : []));

export function resolve(norm: string[], [phrase, , within = phrase]: Mark): number[] {
  const [outer, inner] = [within.split(' '), phrase.split(' ')];
  const at = find(norm, outer);
  const off = find(outer, inner);
  if (at.length !== 1 || off.length !== 1) throw new Error(`«${phrase}» in «${within}» found ${at.length}×${off.length} times, not once`);
  return inner.map((_, k) => at[0] + off[0] + k);
}

export type Data = { names: Record<string, string>; ayat: Record<string, string> };
export type Surah = { number: number; name: string; plain: string };
export type CuratedView = { surah: Surah; note: string; parts: { from: number; to: number; ayat: { text: string; slots?: Record<number, number> }[] }[] };

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
