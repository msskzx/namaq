import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah } from '../../shared/quran/branches';
import { sourceAyat, wordPairs } from '../../shared/quran/quranSource';
import type { MushafPage } from '../../shared/quran/readerPage';

const root = join(__dirname, '../..');
const ayat: BranchAyah[] = JSON.parse(readFileSync(join(root, 'shared/data/quran/trees.json'), 'utf8')).ayat;
const reader = sourceAyat(Array.from({ length: 604 }, (_, page): MushafPage => JSON.parse(readFileSync(join(root, `shared/data/quran/mushaf/${page + 1}.json`), 'utf8'))));

const words = new Map<string, string>();
for (const entry of ayat) {
  const pairs = wordPairs(entry.words, reader.get(entry.key)!);
  if (!pairs) throw new Error(`${entry.key}: word counts differ`);
  for (const [word, display] of pairs) {
    if (words.has(word) && words.get(word) !== display) throw new Error(`${entry.key}: ambiguous word ${word}`);
    words.set(word, display);
  }
}
writeFileSync(join(root, 'shared/data/quran/mushafWords.json'), `${JSON.stringify(Object.fromEntries([...words].sort(([a], [b]) => a.localeCompare(b))))}\n`);
console.log(`Matched ${words.size} word forms across ${ayat.length} ayat.`);
