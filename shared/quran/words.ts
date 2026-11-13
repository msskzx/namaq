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
