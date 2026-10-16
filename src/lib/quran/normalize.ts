// docs/plans/quran-relations-page.md
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ⁠࣓-ࣿ]/g;
const BASMALA = 'بسم الله الرحمن الرحيم';

export const bareWord = (token: string) => token.replace(MARKS, '').replace(/ٱ/g, 'ا').replace(/ی/g, 'ي').replace(/ک/g, 'ك');

export function normalizeWord(token: string): string {
  return bareWord(token)
    .replace(/[أإآٲٳ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
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
