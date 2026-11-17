// docs/plans/quran-relations-page.md
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ⁠࣓-ࣿ]/g;
const BASMALA = 'بسم الله الرحمن الرحيم';

export function normalizeWord(token: string): string {
  return token
    // The page writes a hamza on a seat as the seat with a hamza mark (يٕ, ؤ); the older text as one letter (ئ, ؤ).
    .replace(/[يى]([\u064B-\u0652]*)[\u0654\u0655]/g, 'ئ$1')
    .replace(/و([\u064B-\u0652]*)\u0654/g, 'ؤ$1')
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
