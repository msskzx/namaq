import { normalizeWord } from './normalize';

/**
 * How often each word of the Quran occurs, from the Quranic Arabic Corpus (built by scripts/quran/buildLemmas.ts).
 * A word is counted by its lemma; prefixes, separate pronouns and the opening letters carry none. docs/plans/word-counts-app.md
 */
export type WordsData = {
  /** Name, count and root of each lemma, most frequent first; a lemma's id is its place here. */
  lemmas: [name: string, count: number, root: string][];
  /** Surah by surah, ayah by ayah: one entry per corpus word, its lemma ids joined by "+", entries joined by spaces. */
  ayat: string[][];
};

/** The source the counts come from (shared/sources.ts), shown from the words page's books icon. */
export const WORDS_SOURCE = 'quranic-arabic-corpus';

/** How the words page counts, under its source. */
export const WORDS_COUNTING = [
  'تُعدّ الكلمة بمدخلها المعجمي في المدوّنة القرآنية العربية، فـ«والله» و«لله» تحت «ٱللَّه». وأعدادنا تطابق أعدادها.',
  'لا تُعدّ الحروف المتصلة بالكلمة كالواو والفاء والباء واللام وأل، ولا الضمائر المنفصلة كـ«هو» و«هم»، ولا الحروف المقطعة في أوائل السور. والبسملة تُعدّ مرة واحدة، في الفاتحة.',
  'وإذا اتفقت كلمتان في الرسم واختلفتا في المعنى عُدّت كل منهما وحدها، وبجانبها ما يميّزها، مثل «عصا» و«عصى».',
];

export type WordPlace = { key: string; words: number[] };

/** Lemma ids of one corpus word (from 0) of an ayah. */
export function lemmasOfWord(data: WordsData, key: string, word: number): number[] {
  const [surah, ayah] = key.split(':').map(Number);
  const entry = data.ayat[surah - 1]?.[ayah - 1]?.split(' ')[word];
  return entry ? entry.split('+').map(Number) : [];
}

const indexes = new WeakMap<WordsData, WordPlace[][]>();

/** The ayat that hold a lemma, in mushaf order, each with its words (from 0) that hold it. */
export function placesOf(data: WordsData, id: number): WordPlace[] {
  let index = indexes.get(data);
  if (!index) {
    const built: WordPlace[][] = data.lemmas.map(() => []);
    data.ayat.forEach((surah, s) => surah.forEach((text, a) => {
      const key = `${s + 1}:${a + 1}`;
      text.split(' ').forEach((entry, word) => {
        if (!entry) return;
        for (const lemma of entry.split('+').map(Number)) {
          const places = built[lemma];
          const last = places[places.length - 1];
          if (last?.key === key) last.words.push(word);
          else places.push({ key, words: [word] });
        }
      });
    }));
    indexes.set(data, (index = built));
  }
  return index[id] ?? [];
}

export const SURAHS = 114;

/** How many times a word occurs in each surah (index 0 is al-Fatiha), from its places. */
export function countsBySurah(places: WordPlace[]): number[] {
  const counts = new Array<number>(SURAHS).fill(0);
  for (const { key, words } of places) counts[Number(key.split(':')[0]) - 1] += words.length;
  return counts;
}

/** The surah (from 0) nearest to `index` in which the word occurs, so a finger between bars lands on one. */
export function nearestSurah(counts: number[], index: number): number {
  const at = Math.min(SURAHS - 1, Math.max(0, index));
  for (let step = 0; step < SURAHS; step++) {
    if (counts[at - step]) return at - step;
    if (counts[at + step]) return at + step;
  }
  return at;
}

/** The next surah (from 0) after `from` in which the word occurs, toward al-Nas (1) or al-Fatiha (-1); `from` when there is none. */
export function stepSurah(counts: number[], from: number, by: 1 | -1): number {
  for (let i = from + by; i >= 0 && i < SURAHS; i += by) if (counts[i]) return i;
  return from;
}

/** Lemmas whose name holds the query, ignoring vowel marks, most frequent first. */
export function searchWords(data: WordsData, query: string, limit: number): number[] {
  const needle = normalizeWord(query.trim());
  if (!needle) return [];
  const found: number[] = [];
  for (let id = 0; id < data.lemmas.length && found.length < limit; id++) {
    if (normalizeWord(data.lemmas[id][0]).includes(needle)) found.push(id);
  }
  return found;
}

/**
 * The 1441 Madinah mushaf the reader draws spaces seven ayat differently from the corpus (Tanzil) text: «بعد ما» is one
 * corpus word where the mushaf has two, «مالي» two where it has one. `at` is the mushaf word where the difference starts.
 */
const SPACING: Record<string, { at: number; mushaf: 'two' | 'one' }> = {
  '2:181': { at: 2, mushaf: 'two' },
  '8:6': { at: 3, mushaf: 'two' },
  '13:37': { at: 7, mushaf: 'two' },
  '37:130': { at: 2, mushaf: 'two' },
  '15:7': { at: 0, mushaf: 'one' },
  '27:20': { at: 3, mushaf: 'one' },
  '36:22': { at: 0, mushaf: 'one' },
};

/** The corpus words (from 0) under one mushaf word of an ayah, counting the mushaf's words without the ۞ mark. */
export function corpusWords(key: string, mushafWord: number): number[] {
  const spacing = SPACING[key];
  if (!spacing || mushafWord < spacing.at) return [mushafWord];
  if (spacing.mushaf === 'two') return [mushafWord <= spacing.at + 1 ? spacing.at : mushafWord - 1];
  return mushafWord === spacing.at ? [spacing.at, spacing.at + 1] : [mushafWord + 1];
}

/** Lemma ids under one mushaf word, in the word's order. */
export const lemmasAtMushafWord = (data: WordsData, key: string, mushafWord: number) =>
  [...new Set(corpusWords(key, mushafWord).flatMap(word => lemmasOfWord(data, key, word)))];
