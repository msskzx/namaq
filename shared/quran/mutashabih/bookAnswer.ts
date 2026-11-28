import type { MutashabihBookData } from '../../readerBooks';
import { beforeComma, leading, OPENING, unbalancedAt } from '../opening';


export type AnswerBook = 'K' | 'I' | 'G';
export const answerBookOf = (id: string): AnswerBook | null => (/^([KIG])-?\d/.exec(id)?.[1] as AnswerBook | undefined) ?? null;

export type BookAnswer = { text: string; cut: boolean; page: string };
export type AnswerCitation = { id: string; quote: string; locator: string };

const HEAD: Record<AnswerBook, RegExp> = { K: /\n(?=قَ?وْ?له)/g, I: /\n(?=\s*الآية )/g, G: /\n(?=\s*الآية )/g };
const ANSWER: Record<AnswerBook, RegExp> = {
  K: /^[^﴾]*﴾\s*/,
  I: /(?:^|[\s.:])(?=فالجواب|والجواب|الجواب|وجوابه|ووجهه|ووجه ذلك)/,
  G: /(?:^|[\s.:])(?=فالجواب|والجواب|الجواب|وجوابه|ووجهه|ووجه ذلك)/,
};

function fold(char: string): string {
  if (/[ً-ٰٟـ]/.test(char)) return '';
  if (/[أإآٱ]/.test(char)) return 'ا';
  if (char === 'ى' || char === 'ئ') return 'ي';
  if (char === 'ة') return 'ه';
  if (char === 'ؤ') return 'و';
  return /[ء-ي]/.test(char) ? char : '';
}

const skeletons = new Map<string, { letters: string; at: number[] }>();
function skeleton(text: string): { letters: string; at: number[] } {
  const known = skeletons.get(text);
  if (known) return known;
  const made = skeletonOf(text);
  if (text.length > 2000) skeletons.set(text, made);
  return made;
}
function skeletonOf(text: string): { letters: string; at: number[] } {
  let letters = '';
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const letter = fold(text[i]);
    if (letter) { letters += letter; at.push(i); }
  }
  return { letters, at };
}

const MATCHED = 30;

function locate(quote: string, text: string, from: number): [number, number] | null {
  const pieces = quote.split('…').map(piece => skeleton(piece).letters.slice(0, MATCHED)).filter(piece => piece.length >= 3);
  if (!pieces.length) return null;
  const book = skeleton(text);
  let at = book.at.findIndex(position => position >= from);
  if (at < 0) return null;
  let first = -1;
  let last = -1;
  for (const piece of pieces) {
    const found = book.letters.indexOf(piece, at);
    if (found < 0) return null;
    if (first < 0) first = found;
    last = found + piece.length - 1;
    at = last + 1;
  }
  return [book.at[first], book.at[last] + 1];
}

const printedOf = (locator: string): [number, number] | null => {
  const page = /ص\s*(\d+)/.exec(locator);
  if (page) return [Number(/ج\s*(\d+)/.exec(locator)?.[1] ?? 1), Number(page[1])];
  const pair = /^(\d+):(\d+)/.exec(locator) ?? /^p\.\s*()(\d+)/.exec(locator);
  return pair ? [Number(pair[1] || 1), Number(pair[2])] : null;
};
const entryWords = (locator: string) => /قوله:\s*([^،;]+)/.exec(locator)?.[1].trim();

function pageAt(data: MutashabihBookData, entry: number, offset: number): string {
  let found = data.breaks[0];
  for (const row of data.breaks) if (row[0] < entry || (row[0] === entry && row[1] <= offset)) found = row;
  return `${found[2]}:${found[3]}`;
}

export function bookAnswer(citation: AnswerCitation, book: AnswerBook, data: MutashabihBookData): BookAnswer | null {
  const printed = printedOf(citation.locator);
  const found = sectionOf(citation, book, data, printed);
  if (!found) return null;
  const answer = ANSWER[book].exec(found.section);
  if (!answer) return null;
  const from = answer.index + answer[0].length;
  const rest = found.section.slice(from).replace(/^\s+/, '').replace(/:\s*\n\s*/g, ': ');
  let words = leading(rest, OPENING) || atSpace(rest, OPENING);
  for (;;) {
    const open = (words.match(/"/g) ?? []).length % 2 ? words.lastIndexOf('"') : unbalancedAt(words);
    if (open < 0) break;
    words = (beforeComma(words, open) || words.slice(0, Math.max(0, words.lastIndexOf(' ', open)))).replace(/[،,:\s]+$/, '');
  }
  if (!words) return null;
  return { text: words, cut: rest.replace(/[.\s]+$/, '').length > words.replace(/\.$/, '').length, page: found.page(from) };
}

function atSpace(text: string, max: number): string {
  if (text.length <= max) return '';
  const head = text.slice(0, max);
  const clause = Math.max(...[...head.matchAll(/ (?=[وف][\u064B-\u0652]?[\u0621-\u064A])(?!ف[\u064B-\u0652]?ي)/g)].map(found => found.index), -1);
  let words = text.slice(0, clause > max / 2 ? clause : text.lastIndexOf(' ', max));
  const open = unbalancedAt(words);
  if (open >= 0) words = words.slice(0, words.lastIndexOf(' ', open));
  return words.trim();
}

export function sectionOf(citation: AnswerCitation, book: AnswerBook, data: MutashabihBookData, printed: [number, number] | null) {
  const start = printed ? data.breaks.find(([, , part, page]) => part === printed[0] && page === printed[1]) : undefined;
  const tries: [number, number][] = start ? [[start[0], Math.max(0, start[1] - 50)], [start[0], 0]] : [];
  tries.push(...data.entries.map((_, entry) => [entry, 0] as [number, number]));
  for (const [entry, from] of tries) {
    const text = data.entries[entry][1];
    const named = entryWords(citation.locator);
    const anchor = named ? locate(named, text, from) : null;
    if (named && !anchor) continue;
    const found = locate(citation.quote, text, anchor ? anchor[0] : from);
    if (!found) continue;
    const heads = [...text.matchAll(HEAD[book])].map(head => head.index);
    const end = heads.find(head => head >= found[1]) ?? text.length;
    const start = book === 'K' ? Math.max(0, ...heads.filter(head => head < found[0]).map(head => head + 1)) : found[0];
    return { section: text.slice(start, end), page: (at: number) => pageAt(data, entry, start + at) };
  }
  return printed ? { section: citation.quote, page: () => `${printed[0]}:${printed[1]}` } : null;
}

export type AnswersData = Record<string, [string, 0 | 1, string]>;

export function buildAnswers(cases: AnswerCitation[], books: Record<AnswerBook, MutashabihBookData>): AnswersData {
  const answers: AnswersData = {};
  for (const citation of cases) {
    const book = answerBookOf(citation.id);
    const answer = book && bookAnswer(citation, book, books[book]);
    if (answer) answers[citation.id] = [answer.text, answer.cut ? 1 : 0, answer.page];
  }
  return answers;
}

export const ANSWER_BOOKS: { book: AnswerBook; name: string; title: string; reader: 'iskafi' | 'kirmani' | 'zubayr' }[] = [
  { book: 'I', name: 'الإسكافي', title: 'درة التنزيل وغرة التأويل', reader: 'iskafi' },
  { book: 'K', name: 'الكرماني', title: 'أسرار التكرار في القرآن', reader: 'kirmani' },
  { book: 'G', name: 'ابن الزبير', title: 'ملاك التأويل', reader: 'zubayr' },
];

export type CardAnswer = (typeof ANSWER_BOOKS)[number] & { id: string; text: string; cut: boolean; page: string };

export function cardAnswers(citations: { id: string }[], answers: AnswersData): CardAnswer[] {
  return ANSWER_BOOKS.flatMap(each => {
    const own = citations.filter(citation => answerBookOf(citation.id) === each.book && answers[citation.id]);
    const best = own.sort((a, b) => answers[b.id][0].length - answers[a.id][0].length)[0];
    if (!best) return [];
    const [text, cut, page] = answers[best.id];
    return [{ ...each, id: best.id, text, cut: !!cut, page }];
  });
}
