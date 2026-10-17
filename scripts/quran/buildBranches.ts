import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readerAyat, sharedOpenings } from '../../src/lib/quran/branches';
import type { ReaderPageData } from '../../src/lib/quran/readerPage';

// docs/plans/quran-shared-openings.md
const READER = join(__dirname, '../../src/app/quran/read/data');
const OUT = join(__dirname, '../../src/app/quran/branches/ayat.json');

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(READER, `${i + 1}.json`), 'utf8')));
const groups = sharedOpenings(readerAyat(pages));
const ayat = [...groups.values()].flat();
writeFileSync(OUT, `${JSON.stringify(ayat)}\n`);
console.log(`openings ${groups.size}, ayat ${ayat.length}`);
