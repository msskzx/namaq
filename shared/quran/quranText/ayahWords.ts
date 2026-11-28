import type { MushafPage } from '../readerPage';

export type AyahWords = Record<string, string[]>;

export const HIZB = '۞';

export type AyahWordsOf = (key: string) => readonly string[] | undefined;

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

export const SPLITS: Record<string, number[][]> = {
  '2:181': [[0], [1], [2, 3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13]],
  '8:6': [[0], [1], [2], [3, 4], [5], [6], [7], [8], [9], [10], [11]],
  '13:37': [[0], [1], [2], [3], [4], [5], [6], [7, 8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19]],
  '15:7': [[0], [0], [1], [2], [3], [4], [5], [6]],
  '27:20': [[0], [1], [2], [3], [3], [4], [5], [6], [7], [8], [9], [10]],
  '36:22': [[0], [0], [1], [2], [3], [4], [5], [6]],
  '37:130': [[0], [1], [2, 3]],
};

export const pageWordsAt = (key: string, at: number): number[] => SPLITS[key]?.[at] ?? [at];

export const wordsOnly = (tokens: readonly string[]) => tokens.filter(token => token !== HIZB);

export function corpusWordsAt(key: string, at: number): number[] {
  const rows = SPLITS[key];
  if (!rows) return [at];
  const covering = rows.flatMap((pages, old) => (pages.includes(at) ? [old] : []));
  return covering.filter(old => rows[old][0] === at);
}

export const SIGNS = /[\u06D6-\u06DC\u06DE\u06E4\u06E9]/g;

export const bare = (word: string) => word.replace(SIGNS, '');
