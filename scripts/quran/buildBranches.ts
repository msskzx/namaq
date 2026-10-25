import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readerAyat, sharedOpenings, withConjunctions, withNext, withRoots } from '../../src/lib/quran/branches';
import { chapterFamilies } from '../../src/lib/quran/chapterFamilies';
import { mushafPages, type MushafPage, type ReaderPageData } from '../../src/lib/quran/readerPage';

// docs/plans/quran-shared-openings.md
const READER = join(__dirname, '../../src/app/quran/read/data');
const MUSHAF = join(__dirname, '../../src/app/quran/read/mushaf');
const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/branches/ayat.json');

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(READER, `${i + 1}.json`), 'utf8')));
const mushaf: MushafPage[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(MUSHAF, `${i + 1}.json`), 'utf8')));
const morphology = readFileSync(MORPHOLOGY, 'utf8');
const read = withRoots(withConjunctions(readerAyat(pages, mushafPages(mushaf)), morphology), morphology);
const groups = sharedOpenings(read);
const byKey = new Map(read.map(ayah => [ayah.key, ayah]));
const families = chapterFamilies(read).map(family => [family.id, family.keys.map(key => byKey.get(key)!)] as const);
const ayat = withNext(new Map([...groups, ...families]), read);
writeFileSync(OUT, `${JSON.stringify(ayat)}\n`);
console.log(`openings ${groups.size}, ayat ${ayat.length}`);
