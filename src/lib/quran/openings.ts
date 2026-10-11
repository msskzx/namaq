import { resolve, type Data, type Surah } from './curatedShifts';
import { ayahWords, plainName } from './normalize';

export const OPENING_SURAHS = [81, 82, 84];

export const SHARED: { phrase: string; surahs: number[] }[] = [
  { phrase: 'اذا', surahs: [81, 82, 84] },
  { phrase: 'السماء', surahs: [82, 84] },
];

export const NOTES = [
  'تبدأ السور الثلاث بـ«إذا» ثم اسم (الشمس أو السماء)، ثم فعل ماضٍ يدل على انقلاب في الكون: كُوِّرت، انفطرت، انشقت.',
  'الانفطار والانشقاق متقاربان في المعنى، وبينهما اشتراك في «السماء»، وكلا الفعلين على وزن انفعل. أما التكوير فيخص الشمس وفعله مبني للمجهول.',
  'تقع المطففين بين الانفطار والانشقاق وتبدأ بـ«ويل للمطففين»، فيُقطع تتابع الافتتاح ثم يعود.',
];

export type OpeningView = { surah: Surah; text: string; slots?: Record<number, number> };

export function buildOpenings({ names, ayat }: Data): OpeningView[] {
  return OPENING_SURAHS.map(number => {
    const text = ayat[`${number}:1`];
    if (text === undefined) throw new Error(`${number}:1 is missing from the data`);
    const w = ayahWords(text, false);
    const slots: Record<number, number> = {};
    SHARED.forEach((s, i) => {
      if (s.surahs.includes(number)) for (const j of resolve(w.norm, [s.phrase, 'third'])) slots[j] = i + 1;
    });
    return { surah: { number, name: names[number] ?? '', plain: plainName(names[number] ?? '') }, text: w.display.join(' '), slots };
  });
}
