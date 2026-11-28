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
