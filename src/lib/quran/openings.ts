import { resolve, type Data, type Surah } from './curatedShifts';
import { ayahWords, plainName } from './normalize';

export const SPANS: Record<number, { to: number; answer?: number; sourced?: boolean }> = {
  81: { to: 14, answer: 14, sourced: true },
  82: { to: 5, answer: 5 },
  84: { to: 6 },
};

export const OPENING_SURAHS = Object.keys(SPANS).map(Number);
export const TASBIH_SURAHS = [17, 57, 59, 61, 62, 64, 87];
export const OPENING_GROUPS = [OPENING_SURAHS, TASBIH_SURAHS];

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

export type TasbihRole = 'verb' | 'scope' | 'closing';

const THE_SKIES = 'لله ما في السموت وما في الارض';
export const TASBIH_MARKS: Record<number, [TasbihRole, string][]> = {
  17: [['verb', 'سبحن'], ['scope', 'الذي اسري بعبده ليلا من المسجد الحرام الي المسجد الاقصا الذي بركنا حوله لنريه من ءايتنا'], ['closing', 'انه هو السميع البصير']],
  57: [['verb', 'سبح'], ['scope', 'لله ما في السموت والارض'], ['closing', 'وهو العزيز الحكيم']],
  59: [['verb', 'سبح'], ['scope', THE_SKIES], ['closing', 'وهو العزيز الحكيم']],
  61: [['verb', 'سبح'], ['scope', THE_SKIES], ['closing', 'وهو العزيز الحكيم']],
  62: [['verb', 'يسبح'], ['scope', THE_SKIES], ['closing', 'الملك القدوس العزيز الحكيم']],
  64: [['verb', 'يسبح'], ['scope', THE_SKIES], ['closing', 'له الملك وله الحمد وهو علي كل شيء قدير']],
  87: [['verb', 'سبح'], ['scope', 'اسم ربك'], ['closing', 'الاعلي']],
};

export const TASBIH_NOTES = [
  'المسبّحات سبع سور تبدأ بلفظ التسبيح: الإسراء والحديد والحشر والصف والجمعة والتغابن والأعلى. وجاء التسبيح فيها على أربع صيغ.',
  'سبحان في الإسراء، وسبّح الماضي في الحديد والحشر والصف، ويسبّح المضارع في الجمعة والتغابن، وسبّح الأمر في الأعلى.',
  'الآية الأولى من الحشر والصف واحدة بلفظها، وتخلو الحديد من «وما» قبل «الأرض». تختم الحديد والحشر والصف بـ«العزيز الحكيم»، وتزيد الجمعة قبلها «الملك القدوس». وتختم التغابن بالملك والحمد وقدرته على كل شيء.',
  'في الأعلى يؤمر المخاطب بتسبيح اسم ربه، وليس في آيتها الأولى «ما في السماوات والأرض». وتصف آية الإسراء الذي أسرى بعبده ثم تختم بـ«السميع البصير».',
];

export const TASBIH_SRC = { title: 'موضوع: فضل قراءة سور المسبحات (حديث العرباض بن سارية)', url: 'https://mawdoo3.com/%D9%81%D8%B6%D9%84_%D9%82%D8%B1%D8%A7%D8%A1%D8%A9_%D8%B3%D9%88%D8%B1_%D8%A7%D9%84%D9%85%D8%B3%D8%A8%D8%AD%D8%A7%D8%AA' };

export type TasbihWord = { text: string; role?: TasbihRole };
export type TasbihView = { surah: Surah; ayah: number; words: TasbihWord[] };

export function buildTasbih({ names, ayat }: Data): TasbihView[] {
  return TASBIH_SURAHS.map(number => {
    const text = ayat[`${number}:1`];
    if (text === undefined) throw new Error(`${number}:1 is missing from the data`);
    const w = ayahWords(text, false);
    const roles: Record<number, TasbihRole> = {};
    for (const [role, phrase] of TASBIH_MARKS[number]) for (const j of resolve(w.norm, [phrase, 'third'])) roles[j] = role;
    return {
      surah: { number, name: names[number] ?? '', plain: plainName(names[number] ?? '') },
      ayah: 1,
      words: w.display.map((t, j) => ({ text: t, role: roles[j] })),
    };
  });
}
