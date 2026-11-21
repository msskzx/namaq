/**
 * Writes each downloadable Quran book (shared/books.ts) as plain JSON under data/books/, the files the phone downloads
 * from GitHub (bookUrl). Run after rebuilding any of these books: npx tsx scripts/books/writeBookFiles.ts
 * The Sahihayn need no copy: their files under data/hadith/sahih/ are downloaded as they are.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { BOOK_DATA } from './bookData';

const dir = path.join(process.cwd(), 'data', 'books');
mkdirSync(dir, { recursive: true });
void (async () => {
  for (const [id, load] of Object.entries(BOOK_DATA)) {
    writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(await load!()));
    console.log(`data/books/${id}.json`);
  }
})();
