import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MushafPage } from '../../shared/quran/readerPage';
import { ayahWordsOf } from '../../shared/quran/quranText/ayahWords';

const root = join(__dirname, '../..');
const pages: MushafPage[] = Array.from({ length: 604 }, (_, at) => JSON.parse(readFileSync(join(root, `shared/data/quran/mushaf/${at + 1}.json`), 'utf8')));
const words = ayahWordsOf(pages);
writeFileSync(join(root, 'shared/data/quran/ayahWords.json'), `${JSON.stringify(words)}\n`);
console.log(`Wrote ${Object.keys(words).length} ayat from the Madina pages.`);
