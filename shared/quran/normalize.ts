// docs/plans/quran-relations-page.md
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ⁠࣓-ࣿ]/g;
const BASMALA = 'بسم الله الرحمن الرحيم';

/** The page writes a hamza on a seat as the seat with a hamza mark (يٕ, وٕ); typed text and older texts as one letter (ئ, ؤ). */
export const seated = (word: string) => word
  .replace(/[يى]([\u064B-\u0652]*)[\u0654\u0655]/g, 'ئ$1')
  .replace(/و([\u064B-\u0652]*)[\u0654\u0655]/g, 'ؤ$1');

/** Words already normalized: the same Quran words are asked for again and again (search, trees, quizzes). */
const normalized = new Map<string, string>();
/** Enough for every distinct word of the Quran; past it (long typed texts) the memory starts again. */
const NORMALIZED_MAX = 60_000;

export function normalizeWord(token: string): string {
  let value = normalized.get(token);
  if (value === undefined) {
    if (normalized.size >= NORMALIZED_MAX) normalized.clear();
    normalized.set(token, (value = normalizeUncached(token)));
  }
  return value;
}

function normalizeUncached(token: string): string {
  return seated(token)
    .replace(/\u200f/g, '')
    .replace(MARKS, '')
    .replace(/[أإآٱٲٳ]/g, 'ا')
    .replace(/[ىی]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ک/g, 'ك');
}

export type AyahWords = { display: string[]; norm: string[] };

export function ayahWords(text: string, stripBasmala: boolean): AyahWords {
  const tokens: string[] = [];
  for (const token of text.trim().split(/\s+/)) {
    if (token.startsWith('ٰ') && tokens.length > 0) tokens[tokens.length - 1] += token;
    else tokens.push(token);
  }
  const body = stripBasmala && tokens.slice(0, 4).map(normalizeWord).join(' ') === BASMALA ? tokens.slice(4) : tokens;
  const display = body.filter(token => normalizeWord(token) !== '');
  return { display, norm: display.map(normalizeWord) };
}

export const plainName = (name: string) => name.replace(/[ً-ٟـٰۖ-ۭ]/g, '').replace(/ٱ/g, 'ا');
