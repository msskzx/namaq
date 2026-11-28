// see docs/plans/quran-relations-page.md
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ⁠࣓-ࣿ]/g;
const BASMALA = 'بسم الله الرحمن الرحيم';

export const seated = (word: string) => word
  .replace(/[يى]([\u064B-\u0652]*)[\u0654\u0655]/g, 'ئ$1')
  .replace(/و([\u064B-\u0652]*)[\u0654\u0655]/g, 'ؤ$1');

const normalized = new Map<string, string>();
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

const TYPED_ARTICLE = /^[اٱ]ل/;
const SHORTEST_WITH_ARTICLE = 5;

export type SearchTerm = { term: string; bare?: string };

export function searchTerm(typed: string, normalized: string): SearchTerm {
  const article = TYPED_ARTICLE.test(typed.trim()) && normalized.length >= SHORTEST_WITH_ARTICLE;
  return article ? { term: normalized, bare: normalized.slice(2) } : { term: normalized };
}

export const holdsWord = (normalizedHay: string, { term, bare }: SearchTerm) => normalizedHay.includes(term) || (!!bare && normalizedHay.includes(bare));

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
