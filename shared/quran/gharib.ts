import { num } from './arabicNumber';

/**
 * Word meanings (owner, 2026-11-18; docs/plans/alfaz-al-quran.md), in two books. Ibn Qutaybah's «تفسير غريب القرآن»
 * gives a word's meaning in its ayah; al-Raghib's «المفردات» gives the whole article on its root. Both are the authors'
 * own words, without the editors' notes. Built by scripts/quran/buildGharib.ts.
 */

/** [ayah, first word, last word]: words of the entry's surah it quotes, mushaf words from 0. */
export type GharibPlace = [ayah: number, from: number, to: number];
/** [surah, printed page, Shamela page id, text, places]: one of Ibn Qutaybah's entries, whole; quotes are ﴿…﴾. */
export type GharibEntry = [surah: number, page: number, id: number, text: string, places: GharibPlace[]];
/** [his heading, first printed page, last printed page, Shamela page id, text]: one of al-Raghib's articles, whole. */
export type MufradatEntry = [heading: string, first: number, last: number, id: number, text: string];

/** «ما معنى؟» (owner, 2026-11-18): [asked, three others], entries whose short meaning is the right choice and the wrong ones. */
export type MeaningQuestion = [asked: number, a: number, b: number, c: number];
/** `meanings`: for each entry in a question, his words after the quote (the choice's text), by the entry's index. */
export type GharibData = { source: { book: number; sha: string }; entries: GharibEntry[]; questions: MeaningQuestion[]; meanings: Record<string, string> };
/** `words`: for each ayah (`surah:ayah`), the article of each of its page words (-1 for none), from the Quranic Arabic
 * Corpus root of the word when exactly one of his headings fits it. */
export type MufradatData = { source: { book: number; sha: string }; entries: MufradatEntry[]; words: Record<string, number[]> };

export type GharibAt = { at: number; page: number; id: number; text: string; words: [number, number][] };

const indexes = new WeakMap<GharibData, Map<string, number[]>>();

function indexOf(data: GharibData) {
  let index = indexes.get(data);
  if (index) return index;
  index = new Map();
  data.entries.forEach(([surah, , , , places], at) => {
    for (const [ayah] of places) {
      const list = index!.get(`${surah}:${ayah}`) ?? [];
      if (list.at(-1) !== at) list.push(at);
      index!.set(`${surah}:${ayah}`, list);
    }
  });
  indexes.set(data, index);
  return index;
}

/** The ayah's words an entry quotes, as runs [first, last]. */
export function wordsOf(entry: GharibEntry, ayah: number): [number, number][] {
  const runs: [number, number][] = [];
  for (const [, from, to] of entry[4].filter(place => place[0] === ayah).sort((a, b) => a[1] - b[1])) {
    const run = runs.at(-1);
    if (run && from <= run[1] + 1) run[1] = Math.max(run[1], to);
    else runs.push([from, to]);
  }
  return runs;
}

/** Ibn Qutaybah's entries on an ayah, in his order, each with the ayah's words it quotes. */
export function gharibAt(data: GharibData, key: string): GharibAt[] {
  const ayah = Number(key.split(':')[1]);
  return (indexOf(data).get(key) ?? []).map(at => {
    const [, page, id, text] = data.entries[at];
    return { at, page, id, text, words: wordsOf(data.entries[at], ayah) };
  });
}

/** The entries that quote one word of the ayah, the pressed one first in the list. */
export const gharibOfWord = (entries: GharibAt[], word: number) => entries.filter(entry => entry.words.some(([from, to]) => word >= from && word <= to));

/** Al-Raghib's article on the root of a page word, if one heading of his fits it. */
export function mufradatOf(data: MufradatData, key: string, word: number): (MufradatEntry & { at: number }) | null {
  const at = data.words[key]?.[word] ?? -1;
  return at < 0 ? null : Object.assign([...data.entries[at]] as MufradatEntry, { at });
}

/** One of Ibn Qutaybah's entries found through a word's place: the ayah it was found in, and the words it quotes there. */
export type GharibPlaced = GharibAt & { key: string };

/**
 * His entries on a word wherever the Quran uses it (the words page, owner 2026-11-21): `places` are the word's ayat in
 * mushaf order, each with its mushaf words. An entry counts only when it quotes the word alone: one quoting a phrase
 * («﴿أَعْجَازُ نَخْلٍ﴾ أي أصولُ نخل») may explain another word of it, which is not this word's meaning. An entry found
 * twice shows once, at its first ayah.
 */
export function gharibOfPlaces(data: GharibData, places: { key: string; words: number[] }[]): GharibPlaced[] {
  const seen = new Set<number>();
  const found: GharibPlaced[] = [];
  for (const { key, words } of places) {
    for (const entry of gharibAt(data, key)) {
      if (seen.has(entry.at) || !entry.words.every(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => from + i).every(word => words.includes(word)))) continue;
      seen.add(entry.at);
      found.push({ ...entry, key });
    }
  }
  return found;
}

/** Al-Raghib's articles on a word's places, each once, in the order they are first met (one, for nearly every word). */
export function mufradatOfPlaces(data: MufradatData, places: { key: string; words: number[] }[]): (MufradatEntry & { at: number })[] {
  const found = new Map<number, MufradatEntry & { at: number }>();
  for (const { key, words } of places) for (const word of words) {
    const article = mufradatOf(data, key, word);
    if (article && !found.has(article.at)) found.set(article.at, article);
  }
  return [...found.values()];
}

export const GHARIB_BOOK = 'تفسير غريب القرآن';
export const GHARIB_EDITION = 'ابن قتيبة الدينوري (ت ٢٧٦هـ)، تحقيق السيد أحمد صقر، دار الكتب العلمية، ١٣٩٨هـ/١٩٧٨م';
export const GHARIB_SHORT = 'غريب القرآن لابن قتيبة';
export const gharibCredit = (entry: { page: number }) => `${GHARIB_SHORT}، ص ${num(entry.page)}`;
export const gharibPage = (entry: { id: number }) => `https://shamela.ws/book/3259/${entry.id}`;

export const MUFRADAT_BOOK = 'المفردات في غريب القرآن';
export const MUFRADAT_EDITION = 'الراغب الأصفهاني (ت ٥٠٢هـ)، تحقيق صفوان عدنان الداودي، دار القلم والدار الشامية، الطبعة الأولى ١٤١٢هـ';
export const MUFRADAT_SHORT = 'المفردات للراغب';
export const mufradatCredit = (entry: MufradatEntry) =>
  `${MUFRADAT_SHORT}، ص ${num(entry[1])}${entry[2] !== entry[1] ? `–${num(entry[2])}` : ''}`;
export const mufradatPage = (entry: MufradatEntry) => `https://shamela.ws/book/23636/${entry[3]}`;
