import { normalizeWord } from './normalize';

/**
 * Every oath in the Quran (owner, 2026-11-13: the oaths page covers the whole Quran, app and website).
 * An oath counts when the text swears with an oath form: و / ت / ب before what is sworn by, «لا أقسم», «فلا وربك»,
 * «لعمرك», «فوربك», «قل إي وربي». Reported oaths with no form («وأقسموا بالله», «يحلفون بالله», 5:106-107) and a bare
 * lam of oath («لنبلونكم») are left out. docs/plans/quran-oaths-full.md
 */
export type OathKind = 'allah' | 'others';
export type Oath = { surah: number; range: [number, number]; by: string[]; who?: string };

/**
 * Allah's oaths, in mushaf order. `by` names what is sworn by, as the text writes it (a test finds each in its range).
 * Oaths by participles with no noun (الذاريات، المرسلات، النازعات، العاديات، الخنس) keep their own words: what they are
 * is a tafsir question the page does not answer. An oath by the Lord («فورب»، «وربك») carries «رب». A word sworn by more
 * than once in one oath («وما» in 91:5-7) is listed as often; only that many of its first occurrences are coloured, so
 * «ٱلطَّارِقُ» in the question of 86:2 stays plain.
 */
export const ALLAH_OATHS: Oath[] = [
  { surah: 4, range: [65, 65], by: ['رب'] },
  { surah: 10, range: [53, 53], by: ['رب'], who: 'النبي ﷺ بأمر ربه' },
  { surah: 15, range: [72, 72], by: ['عمر'] },
  { surah: 15, range: [92, 92], by: ['رب'] },
  { surah: 16, range: [56, 56], by: ['الله'] },
  { surah: 16, range: [63, 63], by: ['الله'] },
  { surah: 19, range: [68, 68], by: ['رب'] },
  { surah: 34, range: [3, 3], by: ['رب'], who: 'النبي ﷺ بأمر ربه' },
  { surah: 36, range: [2, 2], by: ['القرآن'] },
  { surah: 37, range: [1, 3], by: ['الصافات', 'الزاجرات', 'التاليات'] },
  { surah: 38, range: [1, 1], by: ['القرآن'] },
  { surah: 43, range: [2, 2], by: ['الكتاب'] },
  { surah: 44, range: [2, 2], by: ['الكتاب'] },
  { surah: 50, range: [1, 1], by: ['القرآن'] },
  { surah: 51, range: [1, 4], by: ['الذاريات', 'الحاملات', 'الجاريات', 'المقسمات'] },
  { surah: 51, range: [7, 7], by: ['السماء'] },
  { surah: 51, range: [23, 23], by: ['رب'] },
  { surah: 52, range: [1, 6], by: ['الطور', 'الكتاب', 'البيت', 'السقف', 'البحر'] },
  { surah: 53, range: [1, 1], by: ['النجم'] },
  { surah: 56, range: [75, 75], by: ['النجوم'] },
  { surah: 64, range: [7, 7], by: ['رب'], who: 'النبي ﷺ بأمر ربه' },
  { surah: 68, range: [1, 1], by: ['القلم', 'ما'] },
  { surah: 69, range: [38, 39], by: ['ما', 'ما'] },
  { surah: 70, range: [40, 40], by: ['رب'] },
  { surah: 74, range: [32, 34], by: ['القمر', 'الليل', 'الصبح'] },
  { surah: 75, range: [1, 2], by: ['اليوم', 'القيامة', 'النفس'] },
  { surah: 77, range: [1, 6], by: ['المرسلات', 'العاصفات', 'الناشرات', 'الفارقات', 'الملقيات'] },
  { surah: 79, range: [1, 5], by: ['النازعات', 'الناشطات', 'السابحات', 'السابقات', 'المدبرات'] },
  { surah: 81, range: [15, 18], by: ['الخنس', 'الجوار', 'الكنس', 'الليل', 'الصبح'] },
  { surah: 84, range: [16, 18], by: ['الشفق', 'الليل', 'ما', 'القمر'] },
  { surah: 85, range: [1, 3], by: ['السماء', 'اليوم', 'شاهد', 'مشهود'] },
  { surah: 86, range: [1, 3], by: ['السماء', 'الطارق'] },
  { surah: 86, range: [11, 12], by: ['السماء', 'الأرض'] },
  { surah: 89, range: [1, 4], by: ['الفجر', 'ليال', 'الشفع', 'الوتر', 'الليل'] },
  { surah: 90, range: [1, 3], by: ['البلد', 'والد', 'ما'] },
  { surah: 91, range: [1, 7], by: ['الشمس', 'الضحى', 'القمر', 'النهار', 'الليل', 'السماء', 'ما', 'الأرض', 'ما', 'النفس', 'ما'] },
  { surah: 92, range: [1, 3], by: ['الليل', 'النهار', 'ما'] },
  { surah: 93, range: [1, 2], by: ['الضحى', 'الليل'] },
  { surah: 95, range: [1, 3], by: ['التين', 'الزيتون', 'الطور', 'البلد'] },
  { surah: 100, range: [1, 5], by: ['العاديات', 'الموريات', 'المغيرات'] },
  { surah: 103, range: [1, 1], by: ['العصر'] },
];

/** Oaths the Quran quotes from others, in mushaf order; `who` is the speaker, as the ayah or the ayat before it say. */
export const OTHER_OATHS: Oath[] = [
  { surah: 6, range: [23, 23], by: ['الله'], who: 'المشركون يوم القيامة' },
  { surah: 6, range: [30, 30], by: ['رب'], who: 'الكافرون إذ وقفوا على ربهم' },
  { surah: 12, range: [73, 73], by: ['الله'], who: 'إخوة يوسف عليه السلام' },
  { surah: 12, range: [85, 85], by: ['الله'], who: 'إخوة يوسف عليه السلام' },
  { surah: 12, range: [91, 91], by: ['الله'], who: 'إخوة يوسف عليه السلام' },
  { surah: 12, range: [95, 95], by: ['الله'], who: 'أهل يعقوب عليه السلام' },
  { surah: 21, range: [57, 57], by: ['الله'], who: 'إبراهيم عليه السلام' },
  { surah: 26, range: [44, 44], by: ['عزة'], who: 'سحرة فرعون' },
  { surah: 26, range: [97, 97], by: ['الله'], who: 'أهل النار' },
  { surah: 37, range: [56, 56], by: ['الله'], who: 'رجل من أهل الجنة' },
  { surah: 38, range: [82, 82], by: ['عزة'], who: 'إبليس' },
  { surah: 46, range: [34, 34], by: ['رب'], who: 'الكافرون إذ عرضوا على النار' },
];

/** The page's help, the same on the website and in the app; the last paragraph is the note shown muted. */
export const OATHS_HELP = [
  'كل موضع في القرآن جاء فيه القسم بلفظه: بالواو أو التاء أو الباء، أو «لا أقسم»، أو «فلا وربك»، أو «لعمرك»، أو «قل إي وربي». وما أُخبر فيه عن قسم بغير لفظه، كـ«وأقسموا بالله جهد أيمانهم»، لم يدخل.',
  'الكلمة الملوّنة ما أُقسم به. وما أقسم الله به بوصف بلا اسم، كالذاريات والمرسلات والنازعات والعاديات، يبقى بألفاظه ولا نقول ما هو، فذلك من التفسير. ويُعرض القسم وحده دون جوابه.',
  'لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص، وفي «لا أقسم» (القيامة ١) قراءة أخرى لم تدخل هنا.',
];

export const OATHS: Record<OathKind, Oath[]> = { allah: ALLAH_OATHS, others: OTHER_OATHS };

/** Each oath's surah names and ayat as the mushaf writes them (shared/data/quran/oaths.json, `npm run quran:oaths`). */
export type OathData = { names: Record<string, string>; ayat: Record<string, string> };
export type OathWord = { text: string; sworn: boolean };
export type OathView = { id: string; kind: OathKind; surah: number; name: string; range: [number, number]; who?: string; by: string[]; lines: { ayah: number; words: OathWord[] }[] };
/** A chip: a word sworn by in two oaths or more of one kind. */
export type OathChip = { word: string; count: number };

/** A word reduced to its letters for matching: the article set apart, long vowels and hamza dropped, a final ta' marbuta read as ta'. */
const skeleton = (x: string) => {
  const n = normalizeWord(x).replace(/ء/g, '');
  const art = n.startsWith('ال');
  return { art, core: (art ? n.slice(2) : n).replace(/[اي]/g, '').replace(/^لل/, 'ل').replace(/ه$/, 'ت') };
};

/** A token with its attached letters taken off: و ف ب ل ك (and ت of «تالله») before, a pronoun after. */
const variants = (token: string) => {
  const n = normalizeWord(token).replace(/ء/g, '');
  const ends = [n, n.replace(/(ها|نا|كم|ك|ي)$/, '')];
  const fronts = (v: string) => [v, ...[1, 2].filter(k => /^[وفبلكت]+$/.test(v.slice(0, k)) && (!v.slice(0, k).includes('ت') || v.slice(k).startsWith('الله'))).map(k => v.slice(k))];
  return ends.flatMap(fronts);
};

/** Whether a token of the text is the word sworn by, written with its attached letters. */
export function isSworn(token: string, word: string) {
  const b = skeleton(word);
  return variants(token).some(v => {
    const a = skeleton(v);
    return a.core === b.core && (a.art === b.art || a.core.length > 1);
  });
}

/** The oaths of one kind with their words, and the chips: words sworn by in two oaths or more, the most frequent first. */
export function buildOaths(kind: OathKind, { names, ayat }: OathData): { oaths: OathView[]; chips: OathChip[] } {
  const oaths = OATHS[kind].map(({ surah, range: [lo, hi], by, who }) => ({
    id: `${surah}:${lo}`,
    kind,
    surah,
    name: names[surah] ?? '',
    range: [lo, hi] as [number, number],
    who,
    by,
    lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
      const text = ayat[`${surah}:${lo + k}`];
      if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
      return { ayah: lo + k, words: text.split(' ').filter(word => normalizeWord(word) !== '').map(word => ({ text: word, sworn: false })) };
    }),
  })).map(oath => {
    // Each listed word colours its first unmarked occurrence.
    const words = oath.lines.flatMap(l => l.words);
    for (const w of oath.by) {
      const hit = words.find(word => !word.sworn && isSworn(word.text, w));
      if (hit) hit.sworn = true;
    }
    return oath;
  });
  const counts = new Map<string, number>();
  for (const o of oaths) for (const w of new Set(o.by)) counts.set(w, (counts.get(w) ?? 0) + 1);
  const chips = [...counts].filter(([, count]) => count > 1).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);
  return { oaths, chips };
}

/** The oaths a chip leaves showing: all of them with no chip, else those sworn by its word. */
export const oathsWith = (oaths: OathView[], word: string | null) => (word ? oaths.filter(o => o.by.includes(word)) : oaths);

/** An oath's place, as «الطور ١–٦». */
export const oathPlace = (o: Pick<OathView, 'name' | 'range'>, num: (n: number) => string) =>
  `${o.name} ${num(o.range[0])}${o.range[1] > o.range[0] ? `–${num(o.range[1])}` : ''}`;

/** The text an oath is shared as: its ayat, then its place. */
export const oathShareText = (o: OathView, num: (n: number) => string) =>
  `${o.lines.map(l => l.words.map(w => w.text).join(' ')).join(' ')}\n${oathPlace(o, num)}`;
