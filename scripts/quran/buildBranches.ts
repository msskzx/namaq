import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readerAyat, sharedOpenings, withConjunctions, withNext, withRoots } from '../../src/lib/quran/branches';
import { chapterFamilies } from '../../src/lib/quran/chapterFamilies';
import { mushafPages, type MushafPage, type ReaderPageData } from '../../src/lib/quran/readerPage';
import { buildTreeGroups, phrasePieces } from '../../src/lib/quran/phraseTrees';

// docs/plans/quran-shared-openings.md
const READER = join(__dirname, '../../src/app/quran/read/data');
const MUSHAF = join(__dirname, '../../src/app/quran/read/mushaf');
const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../src/app/quran/branches/trees.json');

const pages: ReaderPageData[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(READER, `${i + 1}.json`), 'utf8')));
const mushaf: MushafPage[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(MUSHAF, `${i + 1}.json`), 'utf8')));
const morphology = readFileSync(MORPHOLOGY, 'utf8');
const read = withRoots(withConjunctions(readerAyat(pages, mushafPages(mushaf)), morphology), morphology);
const started = performance.now();
const byKey = new Map(read.map(ayah => [ayah.key, ayah]));
const continuations = withNext(new Map([
  ...sharedOpenings(read),
  ...chapterFamilies(read).map(family => [family.id, family.keys.map(key => byKey.get(key)!)] as const),
]), read);
const continued = new Map(continuations.map(ayah => [ayah.key, ayah]));
const ayat = read.map(ayah => continued.get(ayah.key) ?? ayah);
const trees = buildTreeGroups(ayat);
const serialized = `${JSON.stringify({ ayat, trees })}\n`;
writeFileSync(OUT, serialized);
const entries = trees.flatMap(group => phrasePieces(group, ayat));
console.log(`trees ${trees.length}, ayat ${ayat.length}, entries ${entries.length}, repeated occurrences ${trees.filter(group => group.occurrences.length > new Set(group.occurrences.map(o => o.key)).size).length}`);
console.log(`phrase generation ${Math.round(performance.now() - started)} ms, artifact ${Buffer.byteLength(serialized)} bytes, largest piece ${Math.max(...entries.map(group => new Set(group.occurrences.map(o => o.key)).size))} ayat`);
