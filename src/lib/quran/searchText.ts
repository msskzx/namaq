import { normalizeWord } from './normalize';

/**
 * One way to search Quran text, shared by the reader search and the branches
 * phrase search. Every Uthmani word gets two spellings: its rasm (صرط,
 * الصلوة, ذلك) and the common modern spelling (صراط, الصلاة, ذالك). A query
 * word matches when it matches either, so people can type صراط or صرط, and
 * ذلك الكتاب still matches ذَٰلِكَ ٱلْكِتَـٰبُ word by word.
 *
 * Two levels: `strict` keeps hamza as typed, `loose` treats every hamza form
 * as alif (هؤلاء = هاولا = هالا), so missing or misplaced hamzas still find
 * the ayah. Callers rank strict matches first.
 */

const MARK = '[ً-ٟۖ-ۭ]';
const DAGGER_YA_MID = new RegExp(`ىٰ(?=${MARK}*[ء-ي])`, 'g');

/**
 * Uthmani word → common spelling: dagger alif as alif, waw-for-alif (الصلوٰة)
 * as alif, small ya / waw as ya / waw except the silah after هِ / هُ (بِهِۦ,
 * كِتَـٰبَهُۥ), and the lam the mushaf drops in ٱلَّيْل.
 */
export function plainSpelling(word: string): string {
  return word
    .normalize('NFC')
    .replace(/ـٰ/g, 'ا')
    .replace(DAGGER_YA_MID, 'ا')
    .replace(/ىٰ/g, 'ى')
    .replace(/وٰ/g, 'ا')
    .replace(/ٰ/g, 'ا')
    .replace(/هِۦ/g, 'هِ')
    .replace(/[ۦۧ]/g, 'ي')
    .replace(/هُۥ/g, 'هُ')
    .replace(/ۥ/g, 'و')
    .replace(/ٱلَّيْل/g, 'ٱللَّيْل');
}

/** Common spelling without the letters the mushaf marks silent (يَدْعُوا۟ → يدعو, سَأُو۟رِيكُمْ → سأريكم). */
const withoutSilent = (word: string) => plainSpelling(word).replace(/[اوي]۟/g, '');

const strictKey = (word: string) =>
  normalizeWord(word.normalize('NFC').replace(/آ/g, 'ءا').replace(/[\u0654\u0655]/g, 'ء'))
    .replace(/[^ء-ي]/g, '')
    .replace(/ا+/g, 'ا');
const loosen = (key: string) => key.replace(/[ءؤئ]/g, 'ا').replace(/ا+/g, 'ا').replace(/وا$/, 'و');

export type WordKeys = { strict: string[]; loose: string[] };

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

/** Search keys of one Uthmani (or plain) word. */
export function wordKeys(word: string): WordKeys {
  const strict = unique([strictKey(word), strictKey(plainSpelling(word)), strictKey(withoutSilent(word))]);
  return { strict, loose: unique(strict.map(loosen)) };
}

export type SearchQuery = { strict: string[]; loose: string[] };

/** Query words, with vocative يا / ها joined to the next word as the mushaf writes them (يا أيها → يايها, يا قوم → ياقوم). */
export function searchQuery(text: string): SearchQuery {
  const words = text.normalize('NFC').trim().split(/\s+/).map(strictKey).filter(Boolean);
  const joined: string[] = [];
  for (let at = 0; at < words.length; at++) {
    const word = words[at];
    if ((word === 'يا' || word === 'ها') && at + 1 < words.length) joined.push(`${word}${words[++at]}`.replace(/ا+/g, 'ا'));
    else joined.push(word);
  }
  return { strict: joined, loose: joined.map(loosen) };
}

export const searchable = (query: string) => searchQuery(query).strict.join('').length >= 2;

export type TextMatch = { from: number; to: number; strict: boolean };

const any = (keys: string[], test: (key: string) => boolean) => keys.some(test);

function matchAt(words: WordKeys[], query: string[], at: number, level: 'strict' | 'loose', start: boolean): boolean {
  const n = query.length;
  if (at + n > words.length) return false;
  if (n === 1) return any(words[at][level], key => (start ? key.startsWith(query[0]) : key.includes(query[0])));
  if (!any(words[at][level], key => (start ? key === query[0] : key.endsWith(query[0])))) return false;
  for (let i = 1; i < n - 1; i++) if (!words[at + i][level].includes(query[i])) return false;
  return any(words[at + n - 1][level], key => key.startsWith(query[n - 1]));
}

/**
 * First place the query occurs in a run of words, as if the words were joined
 * by spaces: the first query word may end a word, the last may begin one.
 * With `start`, the query must open the run (first word whole, or a prefix
 * when the query is one word). A strict match anywhere wins over a loose one.
 */
export function findText(words: WordKeys[], query: SearchQuery, start = false): TextMatch | null {
  if (!query.strict.length) return null;
  const last = start ? 0 : words.length - 1;
  for (let at = 0; at <= last; at++) if (matchAt(words, query.strict, at, 'strict', start)) return { from: at, to: at + query.strict.length - 1, strict: true };
  if (query.loose.join('').length < 2) return null;
  for (let at = 0; at <= last; at++) if (matchAt(words, query.loose, at, 'loose', start)) return { from: at, to: at + query.loose.length - 1, strict: false };
  return null;
}

/** Keys of free text (a phrase, an alias): each word as written, punctuation dropped. */
export const textKeys = (text: string): WordKeys[] => text.normalize('NFC').trim().split(/\s+/).map(wordKeys).filter(word => word.strict.length > 0);
