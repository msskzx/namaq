import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BranchAyah } from '../../src/lib/quran/branches';
import type { MushafPage } from '../../src/lib/quran/readerPage';

const root = join(__dirname, '../..');
const ayat: BranchAyah[] = JSON.parse(readFileSync(join(root, 'src/app/quran/branches/trees.json'), 'utf8')).ayat;
const reader = new Map<string, string[]>();
let surah = 0;
let ayah = 1;
const separated: Record<string, string> = { 'لَّوۡمَا': 'لَّوۡ مَا', 'وَمَالِيَ': 'وَمَا لِيَ', 'مَالِيَ': 'مَا لِيَ' };
for (let page = 1; page <= 604; page++) {
  const data: MushafPage = JSON.parse(readFileSync(join(root, `src/app/quran/read/mushaf/${page}.json`), 'utf8'));
  for (const item of data.items) {
    if ('surah' in item) [surah, ayah] = [item.surah, 1];
    if (!('line' in item)) continue;
    for (const token of item.line) {
      if (typeof token === 'number') { ayah = token + 1; continue; }
      if (!token || token === '۞') continue;
      const key = `${surah}:${ayah}`;
      const words = (separated[token] ?? token).split(/\s+/);
      reader.set(key, [...(reader.get(key) ?? []), ...words]);
    }
  }
}

const words = new Map<string, string>();
for (const entry of ayat) {
  const source = entry.words.flatMap(word => word === 'بَعْدَ مَا' || word === 'إِلْ يَاسِينَ' ? word.split(' ') : [word]);
  const target = reader.get(entry.key)!;
  if (source.length !== target.length) throw new Error(`${entry.key}: word counts differ`);
  source.forEach((word, index) => {
    const display = target[index].replace(/[\u06D6-\u06DC\u06DE\u06E4\u06E9]/g, '');
    if (words.has(word) && words.get(word) !== display) throw new Error(`${entry.key}: ambiguous word ${word}`);
    words.set(word, display);
  });
}
writeFileSync(join(root, 'src/lib/quran/mushafWords.json'), `${JSON.stringify(Object.fromEntries([...words].sort(([a], [b]) => a.localeCompare(b))))}\n`);
console.log(`Matched ${words.size} word forms across ${ayat.length} ayat.`);
