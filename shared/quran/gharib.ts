import { num } from './arabicNumber';

// see docs/plans/alfaz-al-quran.md

export type GharibPlace = [ayah: number, from: number, to: number];
export type GharibEntry = [surah: number, page: number, id: number, text: string, places: GharibPlace[]];
export type MufradatEntry = [heading: string, first: number, last: number, id: number, text: string];

export type MeaningQuestion = [asked: number, a: number, b: number, c: number];
export type GharibData = { source: { book: number; sha: string }; entries: GharibEntry[]; questions: MeaningQuestion[]; meanings: Record<string, string> };
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

export function wordsOf(entry: GharibEntry, ayah: number): [number, number][] {
  const runs: [number, number][] = [];
  for (const [, from, to] of entry[4].filter(place => place[0] === ayah).sort((a, b) => a[1] - b[1])) {
    const run = runs.at(-1);
    if (run && from <= run[1] + 1) run[1] = Math.max(run[1], to);
    else runs.push([from, to]);
  }
  return runs;
}

export function gharibAt(data: GharibData, key: string): GharibAt[] {
  const ayah = Number(key.split(':')[1]);
  return (indexOf(data).get(key) ?? []).map(at => {
    const [, page, id, text] = data.entries[at];
    return { at, page, id, text, words: wordsOf(data.entries[at], ayah) };
  });
}

export const gharibOfWord = (entries: GharibAt[], word: number) => entries.filter(entry => entry.words.some(([from, to]) => word >= from && word <= to));

export function mufradatOf(data: MufradatData, key: string, word: number): (MufradatEntry & { at: number }) | null {
  const at = data.words[key]?.[word] ?? -1;
  return at < 0 ? null : Object.assign([...data.entries[at]] as MufradatEntry, { at });
}

export type GharibPlaced = GharibAt & { key: string; phrase?: boolean };

export type GharibWord = [ayah: number, word: number];
export type GharibWordsData = { source: { book: number; sha: string }; words: Record<string, GharibWord[]>; phrases: number[] };

export function explainedBy(data: GharibData, marks: GharibWordsData, at: number): GharibWord[] {
  const places = data.entries[at][4];
  if (places.length === 1 && places[0][1] === places[0][2]) return [[places[0][0], places[0][1]]];
  return marks.words[at] ?? [];
}

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
      if ((!phrases.has(entry.at) && quoted.every(word => words.includes(word))) || explainedBy(data, marks, entry.at).some(([at, word]) => at === ayah && words.includes(word))) own.push({ ...entry, key });
      else if (phrases.has(entry.at) && quoted.some(word => words.includes(word))) inPhrase.push({ ...entry, key, phrase: true });
      else continue;
      seen.add(entry.at);
    }
  }
  return [...own, ...inPhrase];
}

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
