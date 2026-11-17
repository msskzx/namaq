import type { MushafPage } from '../readerPage';

/**
 * The one Quran text (AGENTS.md, "Quran text"): every ayah's words exactly as the Madina page prints them, in page order.
 * A word keeps its own waqf and sajda signs (27:26 «ٱلۡعَظِيمِ۩»); a hizb mark «۞» is a token of its own before the word it
 * stands at. The ayah number is not a token: it is the ayah's key, drawn as the page's medallion after the last word.
 */
export type AyahWords = Record<string, string[]>;

export const HIZB = '۞';

export function ayahWordsOf(pages: readonly MushafPage[]): AyahWords {
  const words: AyahWords = {};
  let surah = 0;
  let ayah = 1;
  for (const page of pages) {
    for (const item of page.items) {
      if ('surah' in item) [surah, ayah] = [item.surah, 1];
      if (!('line' in item)) continue;
      for (const token of item.line) {
        if (typeof token === 'number') ayah = token + 1;
        else if (token) (words[`${surah}:${ayah}`] ??= []).push(token);
      }
    }
  }
  return words;
}

/**
 * Where the older text (trees.json, the tree and matrix data) splits words differently from the page: for each of its words,
 * the page words it covers. Everywhere else the two line up one to one (shared/quran/quranText/ayahWords.test.ts).
 */
export const SPLITS: Record<string, number[][]> = {
  '2:181': [[0], [1], [2, 3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13]],
  '8:6': [[0], [1], [2], [3, 4], [5], [6], [7], [8], [9], [10], [11]],
  '13:37': [[0], [1], [2], [3], [4], [5], [6], [7, 8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19]],
  '15:7': [[0], [0], [1], [2], [3], [4], [5], [6]],
  '27:20': [[0], [1], [2], [3], [3], [4], [5], [6], [7], [8], [9], [10]],
  '36:22': [[0], [0], [1], [2], [3], [4], [5], [6]],
  '37:130': [[0], [1], [2, 3]],
};

/** The page words (indexes among the ayah's words, hizb marks left out) that the older text's word `at` stands for. */
export const pageWordsAt = (key: string, at: number): number[] => SPLITS[key]?.[at] ?? [at];

/** The ayah's words without its hizb mark: the words a tree, the matrix or a quiz counts. */
export const wordsOnly = (tokens: readonly string[]) => tokens.filter(token => token !== HIZB);

/**
 * The older text's words (and so the Quranic Arabic Corpus words, which split the ayah the same way) that page word `at` stands
 * for: one word, or two where the page writes them as one (15:7 «لَّوۡمَا»). A page word that only continues an older word
 * split in two on the page (2:181 «مَا» after «بَعۡدَ») gets none: the older word belongs to its first part.
 */
export function corpusWordsAt(key: string, at: number): number[] {
  const rows = SPLITS[key];
  if (!rows) return [at];
  const covering = rows.flatMap((pages, old) => (pages.includes(at) ? [old] : []));
  return covering.filter(old => rows[old][0] === at);
}

/** The page's signs around a word: waqf signs, the hizb mark, the sajda and the line over a sajda's words (U+06E4). Drawn with the word, never part of how it is written. */
export const SIGNS = /[\u06D6-\u06DC\u06DE\u06E4\u06E9]/g;

/** A page word as it is written, its signs left out: words that differ only by a waqf or sajda sign are the same word. */
export const bare = (word: string) => word.replace(SIGNS, '');
