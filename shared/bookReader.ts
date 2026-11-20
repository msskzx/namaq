import { num } from './quran/arabicNumber';

/**
 * The book reader (docs/plans/book-reader.md): a book's passages turned page by page as the printed edition runs.
 * scripts/quran/buildBookPages.ts finds where each printed page starts inside the passages (bookPages.json); a page is
 * the run of text from its start to the next page's.
 */
export type ReaderBookId = 'sadi' | 'kashshaf' | 'ukbari' | 'kirmani' | 'iskafi' | 'zubayr';
/** A passage: the ayat it is on and its text, Quran quotes in ﴿…﴾. `from` 0 is a chapter on its whole surah, surah 0 the author's preface. */
export type BookEntry = { surah: number; from: number; to: number; text: string };
/** [passage, offset in its text, part (volume), page]. */
export type PageBreak = [number, number, number, number];
/** Part of a passage's text: [from, to) of passage `entry`. */
export type Slice = { entry: number; from: number; to: number };
export type BookPage = { part: number; page: number; slices: Slice[] };
/** A place in a book: a passage and an offset in its text (a paragraph's start). */
export type Spot = { entry: number; at: number };

/** The printed pages, in order. Text before the first break is the first page's. */
export function bookPagesOf(entries: BookEntry[], breaks: PageBreak[]): BookPage[] {
  if (!entries.length) return [];
  const sorted = [...breaks].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const starts = sorted.length ? sorted : [[0, 0, 1, 1] as PageBreak];
  return starts.map(([entry, at, part, page], i) => {
    const next = starts[i + 1];
    const from: Spot = i === 0 ? { entry: 0, at: 0 } : { entry, at };
    const to: Spot = next ? { entry: next[0], at: next[1] } : { entry: entries.length - 1, at: entries[entries.length - 1].text.length };
    const slices: Slice[] = [];
    for (let e = from.entry; e <= to.entry; e++) {
      const start = e === from.entry ? from.at : 0;
      const end = e === to.entry ? to.at : entries[e].text.length;
      if (end > start) slices.push({ entry: e, from: start, to: end });
    }
    return { part, page, slices };
  });
}

const before = (a: Spot, b: Spot) => a.entry < b.entry || (a.entry === b.entry && a.at < b.at);

/** The page (index in `pages`) that holds a spot. */
export function pageOfSpot(pages: BookPage[], spot: Spot): number {
  let lo = 0;
  for (let hi = pages.length - 1; lo < hi;) {
    const mid = (lo + hi + 1) >> 1;
    const first = pages[mid].slices[0];
    if (!first || before(spot, { entry: first.entry, at: first.from })) hi = mid - 1;
    else lo = mid;
  }
  return lo;
}

/**
 * The passage on an ayah: the first that holds it, or else the nearest one before it. A book's passages need not run
 * in ayah order (al-'Ukbari goes back now and then), so the whole book is looked through.
 */
export function entryOfAyah(entries: BookEntry[], surah: number, ayah: number): number {
  const holds = entries.findIndex(entry => entry.surah === surah && entry.from <= ayah && ayah <= entry.to);
  if (holds >= 0) return holds;
  let found = 0;
  entries.forEach((entry, i) => {
    const best = entries[found];
    const before = entry.surah < surah || (entry.surah === surah && entry.from <= ayah);
    if (before && (entry.surah > best.surah || (entry.surah === best.surah && entry.from > best.from))) found = i;
  });
  return found;
}

/** A slice in paragraphs (the text's own line breaks), each with where it starts in the passage. */
export function paragraphsOf(text: string, slice: Slice): { at: number; end: number }[] {
  const out: { at: number; end: number }[] = [];
  let at = slice.from;
  while (at < slice.to) {
    const stop = text.indexOf('\n', at);
    const end = stop < 0 || stop >= slice.to ? slice.to : stop;
    if (text.slice(at, end).trim()) out.push({ at, end });
    at = end + 1;
  }
  return out;
}

/** A stretch of a passage in runs, Quran quotes apart: a quote cut by a page break stays a quote on both pages. */
export function runsIn(text: string, from: number, to: number): { text: string; quran: boolean }[] {
  const runs: { text: string; quran: boolean }[] = [];
  const open = text.lastIndexOf('﴿', from);
  let quran = open >= 0 && open < from && text.lastIndexOf('﴾', from - 1) < open;
  let at = from;
  while (at < to) {
    const mark = text.indexOf(quran ? '﴾' : '﴿', at);
    const end = mark < 0 || mark >= to ? to : quran ? mark + 1 : mark;
    if (end > at) runs.push({ text: text.slice(at, end), quran });
    at = end;
    quran = !quran;
  }
  return runs;
}

/** The pill over a passage's start: its surah and ayat, or the surah alone over a chapter on all of it. */
export const entryLabel = (entry: Pick<BookEntry, 'from' | 'to'>, surahName: string) =>
  !entry.from ? surahName : `${surahName} ${entry.from === entry.to ? num(entry.from) : `${num(entry.from)}–${num(entry.to)}`}`;

/** The ayah a passage opens at in the mushaf: its first, or a whole surah's first; none for a preface. */
export const entryAyah = (entry: Pick<BookEntry, 'surah' | 'from'>): string | null => (entry.surah ? `${entry.surah}:${entry.from || 1}` : null);

/** The page (index in `pages`) printed with this part and page number, or the nearest before it. */
export function pageOfPrinted(pages: BookPage[], part: number, page: number): number {
  let found = 0;
  pages.forEach((item, i) => { if (item.part < part || (item.part === part && item.page <= page)) found = i; });
  return found;
}

const MARKS = '[\\u064B-\\u065F\\u0670\\u0640\\u06D6-\\u06ED]*';
const LETTERS: Record<string, string> = { 'ا': '[اأإآٱ]', 'أ': '[اأإآٱ]', 'إ': '[اأإآٱ]', 'آ': '[اأإآٱ]', 'ٱ': '[اأإآٱ]', 'ه': '[هة]', 'ة': '[هة]', 'ي': '[يى]', 'ى': '[يى]' };
const escape = (c: string) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The pattern that finds a query in a vocalized text: marks between letters ignored, alif and ta marbuta forms alike. */
export function searchPattern(query: string): RegExp | null {
  const letters = [...query.replace(new RegExp(MARKS, 'g'), '').trim().replace(/\s+/g, ' ')];
  if (letters.filter(c => c !== ' ').length < 2) return null;
  return new RegExp(`${letters.map(c => (c === ' ' ? '\\s+' : LETTERS[c] ?? escape(c))).join(MARKS)}${MARKS}`, 'g');
}

export type BookHit = { page: number; entry: number; at: number; length: number; before: string; match: string; after: string };

/** Where a query is in the book, in page order, with a few words either side; at most `limit` places. */
export function searchBook(entries: BookEntry[], pages: BookPage[], query: string, limit = 200): { hits: BookHit[]; more: boolean } {
  const pattern = searchPattern(query);
  const hits: BookHit[] = [];
  if (!pattern) return { hits, more: false };
  for (let entry = 0; entry < entries.length; entry++) {
    const text = entries[entry].text;
    pattern.lastIndex = 0;
    for (let m; (m = pattern.exec(text));) {
      if (hits.length === limit) return { hits, more: true };
      const at = m.index;
      const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, at - 40)));
      const stop = text.indexOf(' ', Math.min(text.length, at + m[0].length + 40));
      hits.push({
        page: pageOfSpot(pages, { entry, at }), entry, at, length: m[0].length,
        before: `${start > 0 ? '…' : ''}${text.slice(start, at).replace(/\s+/g, ' ').trimStart()}`,
        match: m[0],
        after: `${text.slice(at + m[0].length, stop < 0 ? text.length : stop).replace(/\s+/g, ' ')}${stop < 0 ? '' : '…'}`,
      });
    }
  }
  return { hits, more: false };
}
