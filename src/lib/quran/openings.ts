import type { Data, Surah } from './curatedShifts';
import { ayahWords, plainName } from './normalize';

export const SPANS: Record<number, { to: number; answer?: number; sourced?: boolean }> = {
  81: { to: 14, answer: 14, sourced: true },
  82: { to: 5, answer: 5 },
  84: { to: 6 },
};

export const OPENING_SURAHS = Object.keys(SPANS).map(Number);

export const NOTES = [
  'تبدأ السور الثلاث بـ«إذا» ثم اسم (الشمس أو السماء)، ثم فعل ماضٍ يدل على انقلاب في الكون: كُوِّرت، انفطرت، انشقت.',
  'الانفطار والانشقاق متقاربان في المعنى، وبينهما اشتراك في «السماء»، وكلا الفعلين على وزن انفعل. أما التكوير فيخص الشمس وفعله مبني للمجهول.',
  'في التكوير قال الطبري والقرطبي إن «علمت نفس ما أحضرت» جواب «إذا» وما بعدها. ونقرأ «علمت نفس ما قدمت وأخرت» في الانفطار جوابًا على النسق نفسه، وهذه قراءتنا ولم نجد من نص عليها. وفي الانشقاق اختلف المفسرون في الجواب فلم نحدد آية له.',
  'تقع المطففين بين الانفطار والانشقاق وتبدأ بـ«ويل للمطففين»، فيُقطع تتابع الافتتاح ثم يعود.',
];

export const DISPUTE = {
  title: 'الجواب في الانشقاق',
  views: [
    'محذوف يُفهم من السياق، أي أن الإنسان يرى ما قدم: الطبري والبغوي والقرطبي، وهو ما رجّحه الطبري',
    '«يا أيها الإنسان إنك كادح…» على التقديم والتأخير: بعض نحويي البصرة',
    '«وأذنت» والواو زائدة: الفراء، وغلّطه ابن الأنباري',
    'ما دل عليه «فملاقيه»: قول بلا اسم عند القرطبي',
    'في الكلام تقديم وتأخير: المبرد',
    '«فأما من أوتي كتابه بيمينه»: الكسائي، وقال النحاس: أصح ما قيل فيه',
  ],

  src: [
    { title: 'الطبري والبغوي والقرطبي في تفسير الانشقاق ٥ (جامعة الملك سعود)', url: 'https://quran.ksu.edu.sa/tafseer/ibn-baghawy-tabary-qortobi/sura84-aya5.html' },
  ],
};

export const ANSWER_SRC = { title: 'الطبري والقرطبي في تفسير التكوير ١٤ (جامعة الملك سعود)', url: 'https://quran.ksu.edu.sa/tafseer/ibn-tabary-qortobi-saadi/sura81-aya14.html' };

export type Role = 'condition' | 'answer' | 'disputed';
export type OpeningLine = { ayah: number; text: string; role: Role; sourced: boolean };
export type OpeningView = { surah: Surah; lines: OpeningLine[] };

export function buildOpenings({ names, ayat }: Data): OpeningView[] {
  return OPENING_SURAHS.map(number => {
    const { to, answer, sourced } = SPANS[number];
    const lines = Array.from({ length: to }, (_, k): OpeningLine => {
      const ayah = k + 1;
      const text = ayat[`${number}:${ayah}`];
      if (text === undefined) throw new Error(`${number}:${ayah} is missing from the data`);
      const role: Role = answer === undefined ? (ayah === to ? 'disputed' : 'condition') : ayah === answer ? 'answer' : 'condition';
      return { ayah, text: ayahWords(text, false).display.join(' '), role, sourced: sourced === true };
    });
    return { surah: { number, name: names[number] ?? '', plain: plainName(names[number] ?? '') }, lines };
  });
}
