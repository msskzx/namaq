import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sharedOpenings, withConjunctions, withNext, withRoots } from '../../shared/quran/branches';
import { chapterFamilies } from '../../shared/quran/chapterFamilies';
import { mushafPages, type MushafPage } from '../../shared/quran/readerPage';
import { buildTreeGroups, phrasePieces } from '../../shared/quran/phraseTrees';
import { buildSubtrees } from '../../shared/quran/subtrees';

// docs/plans/quran-shared-openings.md
const MUSHAF = join(__dirname, '../../shared/data/quran/mushaf');
const MORPHOLOGY = join(__dirname, '../../data/quran/quranic-corpus-morphology-0.4.txt');
const OUT = join(__dirname, '../../shared/data/quran/trees.json');

const mushaf: MushafPage[] = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(MUSHAF, `${i + 1}.json`), 'utf8')));
const morphology = readFileSync(MORPHOLOGY, 'utf8');
const pageOf = mushafPages(mushaf);
const stored: { key: string; words: string[] }[] = JSON.parse(readFileSync(OUT, 'utf8')).ayat;
const read = withRoots(withConjunctions(stored.map(({ key, words }) => ({ key, page: pageOf.get(key)!, words })), morphology), morphology);
const started = performance.now();
const byKey = new Map(read.map(ayah => [ayah.key, ayah]));
const continuations = withNext(new Map([
  ...sharedOpenings(read),
  ...chapterFamilies(read).map(family => [family.id, family.keys.map(key => byKey.get(key)!)] as const),
]), read);
const continued = new Map(continuations.map(ayah => [ayah.key, ayah]));
const ayat = read.map(ayah => continued.get(ayah.key) ?? ayah);
const { trees, subtrees } = buildSubtrees(buildTreeGroups(ayat), ayat);
const serialized = `${JSON.stringify({ ayat, trees, subtrees })}\n`;
writeFileSync(OUT, serialized);
const entries = trees.flatMap(group => phrasePieces(group, ayat));
console.log(`trees ${trees.length}, subtrees ${subtrees.length}, ayat ${ayat.length}, entries ${entries.length}, repeated occurrences ${trees.filter(group => group.occurrences.length > new Set(group.occurrences.map(o => o.key)).size).length}`);
console.log(`phrase generation ${Math.round(performance.now() - started)} ms, artifact ${Buffer.byteLength(serialized)} bytes, largest piece ${Math.max(...entries.map(group => new Set(group.occurrences.map(o => o.key)).size))} ayat`);
