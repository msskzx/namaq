import { normalizeWord } from './normalize';

/**
 * One way to search Quran text, shared by the reader search and the branches
 * phrase search. Every Uthmani word gets its rasm (صرط, الصلوة, ذلك), its
 * common modern spelling (صراط, الصلاة, ذالك) and the spellings between them
 * (السموات for ٱلسَّمَـٰوَٰتِ). A query word matches when it matches any, so
 * people can type صراط or صرط, and ذلك الكتاب still matches ذَٰلِكَ ٱلْكِتَـٰبُ.
 *
 * Two levels: `strict` keeps the hamza as typed; `loose` treats every hamza
 * form as alif (هؤلاء = هالا) and is only tried when nothing matches strictly.
 */

const MARK = '[\u064B-\u065F\u06D6-\u06ED]';
/** Each dagger-alif spot, with its rasm and its full spelling. */
const DAGGER = new RegExp(`ـٰ|(ىٰ)(?=${MARK}*[ء-ي])|ىٰ|وٰ|ٰ`, 'g');
const DAGGER_FORMS: Record<string, [string, string]> = { 'ـٰ': ['', 'ا'], 'ىٰ': ['ى', 'ى'], 'وٰ': ['و', 'ا'], 'ٰ': ['', 'ا'] };
const MAX_SPOTS = 4;

/** Small ya / waw as letters except the silah after هِ / هُ (بِهِۦ, كِتَـٰبَهُۥ), and the lam the mushaf drops in ٱلَّيْل. */
const smallLetters = (word: string) =>
  word
    .replace(/هِۦ/g, 'هِ')
    .replace(/[ۦۧ]/g, 'ي')
    .replace(/هُۥ/g, 'هُ')
    .replace(/ۥ/g, 'و')
    .replace(/ٱلَّيْل/g, 'ٱللَّيْل');

/**
 * Spellings of a Uthmani word from rasm to modern: each dagger alif either
 * left out or written as alif (waw-for-alif الصلوٰة → الصلاة; ىٰ inside a word
 * → alif, at its end → ى). Words with many spots get only both ends.
 */
export function spellings(word: string): string[] {
  const text = word.normalize('NFC');
  const spots = [...text.matchAll(DAGGER)];
  const forms = spots.map(match => (match[1] ? ['ى', 'ا'] : DAGGER_FORMS[match[0]]));
  const masks = spots.length <= MAX_SPOTS ? Array.from({ length: 2 ** spots.length }, (_, mask) => mask) : [0, 2 ** spots.length - 1];
  return masks.map(mask => {
    let out = '';
    let at = 0;
    spots.forEach((match, index) => {
      out += text.slice(at, match.index) + forms[index][(mask >> index) & 1];
      at = match.index! + match[0].length;
    });
    return smallLetters(out + text.slice(at));
  });
}

/** The fully modern spelling (صِرَٰطَ → صراط). */
export const plainSpelling = (word: string) => spellings(word).at(-1)!;

/** Without the letters the mushaf marks silent (يَدْعُوا۟ → يدعو, سَأُو۟رِيكُمْ → سأريكم). */
const withoutSilent = (word: string) => word.replace(/[اوي]۟/g, '');

const key = (word: string) => normalizeWord(word.replace(/[\u0654\u0655]/g, 'ء')).replace(/[^ء-ي]/g, '').replace(/ا+/g, 'ا');
/** In the mushaf آ is a long alif (جَآءَ); typed, it is hamza + alif (القرآن = ٱلْقُرْءَان). */
const textKey = (word: string) => key(word.normalize('NFC').replace(/آ/g, 'ا'));
const queryKey = (word: string) => key(word.normalize('NFC').replace(/آ/g, 'ءا'));
const loosen = (value: string) => value.replace(/[ءؤئ]/g, 'ا').replace(/ا+/g, 'ا').replace(/وا$/, 'و');

export type WordKeys = { strict: string[]; loose: string[] };

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

/** Search keys of one Uthmani (or plain) word. */
export function wordKeys(word: string): WordKeys {
  const forms = spellings(word);
  const strict = unique([textKey(word), ...forms.map(textKey), textKey(withoutSilent(forms.at(-1)!))]);
  return { strict, loose: unique(strict.map(loosen)) };
}

export type SearchQuery = { strict: string[]; loose: string[] };

/** Query words, with vocative يا / ها joined to the next word as the mushaf writes them (يا أيها → يايها, يا قوم → ياقوم). */
export function searchQuery(text: string): SearchQuery {
  const words = text.normalize('NFC').trim().split(/\s+/).map(queryKey).filter(Boolean);
  const joined: string[] = [];
  for (let at = 0; at < words.length; at++) {
    const word = words[at];
    if ((word === 'يا' || word === 'ها') && at + 1 < words.length) joined.push(`${word}${words[++at]}`.replace(/ا+/g, 'ا'));
    else joined.push(word);
  }
  return { strict: joined, loose: joined.map(loosen) };
}

export const searchable = (query: string) => searchQuery(query).strict.join('').length >= 2;

export type TextMatch = { from: number; to: number };
export type Level = 'strict' | 'loose';

/** Levels to try in turn: loose only for a query with two letters left after folding hamza. */
export const levels = (query: SearchQuery): Level[] => (!query.strict.length ? [] : query.loose.join('').length >= 2 ? ['strict', 'loose'] : ['strict']);

const any = (keys: string[], test: (key: string) => boolean) => keys.some(test);

function matchAt(words: WordKeys[], query: string[], at: number, level: Level, start: boolean): boolean {
  const n = query.length;
  if (at + n > words.length) return false;
  if (n === 1) return any(words[at][level], key => (start ? key.startsWith(query[0]) : key.includes(query[0])));
  if (!any(words[at][level], key => (start ? key === query[0] : key.endsWith(query[0])))) return false;
  for (let i = 1; i < n - 1; i++) if (!words[at + i][level].includes(query[i])) return false;
  return any(words[at + n - 1][level], key => key.startsWith(query[n - 1]));
}

/**
 * First place the query occurs in a run of words at one level, as if the words
 * were joined by spaces: the first query word may end a word, the last may
 * begin one. With `start`, the query must open the run (first word whole, or a
 * prefix when the query is one word).
 */
export function findText(words: WordKeys[], query: SearchQuery, level: Level = 'strict', start = false): TextMatch | null {
  const wanted = query[level];
  if (!wanted.length) return null;
  const last = start ? 0 : words.length - 1;
  for (let at = 0; at <= last; at++) if (matchAt(words, wanted, at, level, start)) return { from: at, to: at + wanted.length - 1 };
  return null;
}

/** Run `find` at each level until one finds something. */
export function firstLevel<T>(query: SearchQuery, find: (level: Level) => T[]): T[] {
  for (const level of levels(query)) {
    const found = find(level);
    if (found.length) return found;
  }
  return [];
}

const keyedTexts = new Map<string, WordKeys[]>();

/** Keys of free text (a phrase, an alias): each word as written, punctuation dropped. */
export function textKeys(text: string): WordKeys[] {
  let keys = keyedTexts.get(text);
  if (!keys) keyedTexts.set(text, keys = text.normalize('NFC').trim().split(/\s+/).map(wordKeys).filter(word => word.strict.length > 0));
  return keys;
}
