import { normalizeWord, seated } from './normalize';


const MARK = '[\u064B-\u065F\u06D6-\u06ED]';
const DAGGER = new RegExp(`ـٰ|(ىٰ)(?=${MARK}*[ء-ي])|ىٰ|وٰ|ٰ`, 'g');
const DAGGER_FORMS: Record<string, [string, string]> = { 'ـٰ': ['', 'ا'], 'ىٰ': ['ى', 'ى'], 'وٰ': ['و', 'ا'], 'ٰ': ['', 'ا'] };
const MAX_SPOTS = 4;

const smallLetters = (word: string) =>
  word
    .replace(/هِۦ/g, 'هِ')
    .replace(/[ۦۧ]/g, 'ي')
    .replace(/هُۥ/g, 'هُ')
    .replace(/ۥ/g, 'و')
    .replace(/ٱلَّيْل/g, 'ٱللَّيْل');

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

export const plainSpelling = (word: string) => spellings(word).at(-1)!;

const withoutSilent = (word: string) => word.replace(/[اوي]۟/g, '');

const key = (word: string) => normalizeWord(seated(word).replace(/[\u0654\u0655]/g, 'ء')).replace(/[^ء-ي]/g, '').replace(/ا+/g, 'ا');
const seatKey = (word: string) => key(word.replace(/[أإؤئ\u0654\u0655]/g, 'ء'));
const textSeatKeys = (word: string) => {
  const value = seatKey(word);
  return value.endsWith('و') ? [value, `${value}ا`] : [value];
};
const asText = (word: string) => word.normalize('NFC').replace(/آ/g, 'ا');
const asQuery = (word: string) => word.normalize('NFC').replace(/آ/g, 'ءا');
const loosen = (value: string) => value.replace(/[ءؤئ]/g, 'ا').replace(/ا+/g, 'ا').replace(/وا$/, 'و');

export type WordKeys = { strict: string[]; seat: string[]; loose: string[] };

const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

export function wordKeys(word: string): WordKeys {
  const forms = spellings(word);
  const written = [word, ...forms, withoutSilent(forms.at(-1)!)].map(asText);
  const strict = unique(written.map(key));
  return { strict, seat: unique(written.flatMap(textSeatKeys)), loose: unique(strict.map(loosen)) };
}

export type SearchQuery = { strict: string[]; seat: string[]; loose: string[] };

export function searchQuery(text: string): SearchQuery {
  const words = text.normalize('NFC').trim().split(/\s+/).map(asQuery).filter(word => key(word));
  const joined: string[] = [];
  for (let at = 0; at < words.length; at++) {
    const word = words[at];
    if ((key(word) === 'يا' || key(word) === 'ها') && at + 1 < words.length) joined.push(`${word}${words[++at]}`);
    else joined.push(word);
  }
  const strict = joined.map(key);
  return { strict, seat: joined.map(seatKey), loose: strict.map(loosen) };
}

export const searchable = (query: string) => searchQuery(query).strict.join('').length >= 2;

export type TextMatch = { from: number; to: number };
export type Level = 'strict' | 'loose';

export const levels = (query: SearchQuery): Level[] => (!query.strict.length ? [] : query.loose.join('').length >= 2 ? ['strict', 'loose'] : ['strict']);

const any = (keys: string[], test: (key: string) => boolean) => keys.some(test);

const afterLam = (word: string) => (word.length >= 4 && word.startsWith('ال') ? `ل${word.slice(1)}` : null);
const ends = (key: string, word: string) => key.endsWith(word) || (!!afterLam(word) && key.endsWith(afterLam(word)!));
const holds = (key: string, word: string) => key.includes(word) || (!!afterLam(word) && key.includes(afterLam(word)!));

function matchAt(words: WordKeys[], query: string[], at: number, field: keyof WordKeys, start: boolean): boolean {
  const n = query.length;
  if (at + n > words.length) return false;
  if (n === 1) return any(words[at][field], key => (start ? key.startsWith(query[0]) : holds(key, query[0])));
  if (!any(words[at][field], key => (start ? key === query[0] : ends(key, query[0])))) return false;
  for (let i = 1; i < n - 1; i++) if (!words[at + i][field].includes(query[i])) return false;
  return any(words[at + n - 1][field], key => key.startsWith(query[n - 1]));
}

export function findText(words: WordKeys[], query: SearchQuery, level: Level = 'strict', start = false): TextMatch | null {
  const fields: (keyof WordKeys)[] = level === 'strict' ? ['strict', 'seat'] : ['loose'];
  const n = query.strict.length;
  if (!n) return null;
  const last = start ? 0 : words.length - 1;
  for (let at = 0; at <= last; at++) if (fields.some(field => matchAt(words, query[field], at, field, start))) return { from: at, to: at + n - 1 };
  return null;
}

export function firstLevel<T>(query: SearchQuery, find: (level: Level) => T[]): T[] {
  for (const level of levels(query)) {
    const found = find(level);
    if (found.length) return found;
  }
  return [];
}

const keyedTexts = new Map<string, WordKeys[]>();

export function textKeys(text: string): WordKeys[] {
  let keys = keyedTexts.get(text);
  if (!keys) keyedTexts.set(text, keys = text.normalize('NFC').trim().split(/\s+/).map(wordKeys).filter(word => word.strict.length > 0));
  return keys;
}

const fold = (value: string) => value.replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء/g, '').replace(/ا+/g, 'ا');

export function compactKeys(text: string): string[] {
  const keys = unique([text, ...spellings(text)].map(asText).map(key));
  return unique([...keys, ...keys.map(fold)]);
}

export function compactQuery(text: string): string[] {
  const typed = key(asQuery(text));
  return typed ? unique([typed, fold(typed)]) : [];
}
