import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BOOKS, bookFile } from '@shared/books';
import { BOOK_DATA } from './bookData';

const downloaded = BOOKS.filter(book => !book.builtIn);

// The phone downloads these files from GitHub (shared/books.ts bookUrl), so each must be there and match the book.
describe('downloadable book files', () => {
  it.each(downloaded.map(book => book.id))('%s has its file in the repository', id => {
    expect(existsSync(path.join(process.cwd(), bookFile(id)))).toBe(true);
  });

  it.each(downloaded.filter(book => book.kind !== 'hadith').map(book => book.id))('%s file matches the book (else run npm run books:files)', async id => {
    const file = JSON.parse(readFileSync(path.join(process.cwd(), bookFile(id)), 'utf8'));
    expect(file).toEqual(await BOOK_DATA[id]!());
  });
});
