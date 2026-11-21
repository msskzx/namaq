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
export type GharibPlaced = GharibAt & { key: string; phrase?: boolean };

/** [ayah, mushaf word]: a word of the entry's surah. */
export type GharibWord = [ayah: number, word: number];
/**
 * The words each of his entries quoting more than one word explains (owner, 2026-11-21), by entry index: «﴿وَالنَّخْلَ
 * بَاسِقَاتٍ﴾ أي طوالا» explains باسقات alone. Two agents marked every such entry blind of each other; only the ones both
 * marked alike, and the owner's answers where they differed, are here. An entry explaining the phrase as a whole («﴿أَعْجَازُ
 * نَخْلٍ﴾ أي أصولُ نخل») or that neither could pin to a word has none. Built by scripts/quran/gharibWords.ts.
 */
export type GharibWordsData = { source: { book: number; sha: string }; words: Record<string, GharibWord[]>; phrases: number[] };

/** The words an entry explains: the one word it quotes, or the ones marked for it. */
export function explainedBy(data: GharibData, marks: GharibWordsData, at: number): GharibWord[] {
  const places = data.entries[at][4];
  if (places.length === 1 && places[0][1] === places[0][2]) return [[places[0][0], places[0][1]]];
  return marks.words[at] ?? [];
}

/**
 * His entries on a word wherever the Quran uses it (the words page, owner 2026-11-21): `places` are the word's ayat in
 * mushaf order, each with its mushaf words. First the entries that explain this word: quoting it alone (one word, or a
 * phrase all of this word: «﴿وَأَنْفُسَنَا وَأَنْفُسَكُمْ﴾»), or quoting a phrase with this word marked as the one he explains
 * (`marks`). Then, marked `phrase`, the entries explaining as a whole a phrase this word is in («﴿أَعْجَازُ نَخْلٍ﴾ أي
 * أصولُ نخل» on نخل), shown under «في عبارة» so his meaning is never read as this word's own. An entry found twice shows
 * once, at its first ayah.
 */
export function gharibOfPlaces(data: GharibData, marks: GharibWordsData, places: { key: string; words: number[] }[]): GharibPlaced[] {
  const phrases = new Set(marks.phrases);
  const seen = new Set<number>();
  const own: GharibPlaced[] = [];
  const inPhrase: GharibPlaced[] = [];
  for (const { key, words } of places) {
    const ayah = Number(key.split(':')[1]);
    for (const entry of gharibAt(data, key)) {
      if (seen.has(entry.at)) continue;
      const quoted = entry.words.flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => from + i));
      if (quoted.every(word => words.includes(word)) || explainedBy(data, marks, entry.at).some(([at, word]) => at === ayah && words.includes(word))) own.push({ ...entry, key });
      else if (phrases.has(entry.at) && quoted.some(word => words.includes(word))) inPhrase.push({ ...entry, key, phrase: true });
      else continue;
      seen.add(entry.at);
    }
  }
  return [...own, ...inPhrase];
}

/**
 * Al-Raghib's article on a word, from its places: the one most of its words link to (a word has one root). A stray link
 * (a mushaf word that also holds another word) is outvoted. Empty when no place links to one.
 */
export function mufradatOfPlaces(data: MufradatData, places: { key: string; words: number[] }[]): (MufradatEntry & { at: number })[] {
  const votes = new Map<number, { article: MufradatEntry & { at: number }; count: number }>();
  for (const { key, words } of places) for (const word of words) {
    const article = mufradatOf(data, key, word);
    if (article) votes.set(article.at, { article, count: (votes.get(article.at)?.count ?? 0) + 1 });
  }
  const best = [...votes.values()].sort((a, b) => b.count - a.count)[0];
  return best ? [best.article] : [];
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
