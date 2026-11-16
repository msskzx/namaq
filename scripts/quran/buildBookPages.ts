import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cleanPage } from './kashshaf';
import { clean as cleanUkbari } from './irabUkbari';
import { FIRST_PAGE, LAST_PAGE, cleanPiece } from './sadiClean';
import { pageBreaks, type PageBreak, type RawPage } from './bookPages';
import sadi from '../../shared/data/quran/tafsirSadi.json';
import kashshaf from '../../shared/data/quran/kashshaf';
import ukbari from '../../shared/data/quran/irabUkbari';

// docs/plans/book-reader.md: the printed pages of the books the book reader turns, written to
// shared/data/quran/bookPages.json. Reads the same Quranpedia dumps the books were built from (run their builders first
// to fetch them).
type Piece = { text: string; part: string; page: number | null };
type Dump = { license: { version: string }; ayahs: { surah: number; ayah: number; content: Piece[] }[] };
const dump = (name: string): Dump => JSON.parse(readFileSync(join(tmpdir(), `${name}.json`), 'utf8'));

/** The dump's pieces in page order, each kept once (a piece repeats under every ayah its passage holds). */
function pagesOf(data: Dump, keep: (piece: Piece) => boolean, cleanText: (html: string) => string): RawPage[] {
  const pieces = new Map<string, { part: number; page: number; owner: number; text: string }>();
  for (const row of data.ayahs) for (const piece of row.content) {
    if (piece.page === null || !keep(piece)) continue;
    const part = /^\d+$/.test(piece.part) ? Number(piece.part) : 1;
    const id = `${part}|${piece.page}|${piece.text}`;
    const owner = row.surah * 1000 + row.ayah;
    const known = pieces.get(id);
    if (!known || owner < known.owner) pieces.set(id, { part, page: piece.page, owner, text: piece.text });
  }
  const sorted = [...pieces.values()].sort((a, b) => a.part - b.part || a.page - b.page || a.owner - b.owner);
  const pages: RawPage[] = [];
  for (const piece of sorted) {
    const last = pages.at(-1);
    const text = cleanText(piece.text);
    if (last && last.part === piece.part && last.page === piece.page) last.text += `\n${text}`;
    else pages.push({ part: piece.part, page: piece.page, text });
  }
  return pages;
}

const out: Record<string, PageBreak[]> = {};
const books: [string, string[], RawPage[]][] = [
  ['sadi', (sadi.passages as unknown[][]).map(row => row[5] as string),
    pagesOf(dump('quranpedia-sadi-2026-08-10'), piece => piece.page! >= FIRST_PAGE && piece.page! <= LAST_PAGE, cleanPiece)],
  ['kashshaf', kashshaf.entries.map(entry => entry[6]),
    pagesOf(dump('quranpedia-tafsir-book-346-2026-08-10'), piece => /^\d+$/.test(piece.part), cleanPage)],
  ['ukbari', ukbari.entries.map(entry => entry[5]), pagesOf(dump('quranpedia-e3rab-book-309-2026-08-10'), () => true, cleanUkbari)],
];
for (const [id, texts, pages] of books) {
  const { breaks, lost } = pageBreaks(texts, pages);
  out[id] = breaks;
  console.log(`${id}: ${pages.length} pages, ${breaks.length} found, ${lost.length} joined to the page before: ${lost.slice(0, 40).map(p => `${p.part}/${p.page}`).join(' ')}`);
}
writeFileSync(join(__dirname, '../../shared/data/quran/bookPages.json'), `${JSON.stringify(out)}\n`);
