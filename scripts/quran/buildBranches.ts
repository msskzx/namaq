import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readerAyat, sharedOpenings, withConjunctions } from '../../src/lib/quran/branches';
import type { ReaderPageData } from '../../src/lib/quran/readerPage';

// docs/plans/quran-shared-openings.md
const READER = join(__dirname, '../../src/app/quran/read/data');
const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/branches/ayat.json');

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(READER, `${i + 1}.json`), 'utf8')));
const groups = sharedOpenings(withConjunctions(readerAyat(pages), readFileSync(MORPHOLOGY, 'utf8')));
const ayat = [...groups.values()].flat();
writeFileSync(OUT, `${JSON.stringify(ayat)}\n`);
console.log(`openings ${groups.size}, ayat ${ayat.length}`);
