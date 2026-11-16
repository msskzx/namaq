import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { skeleton } from './irabUkbari';
import { entryOf, litSentences, markQuran, readPassages, type Dump, type Exclusion } from './kashshaf';
import surahs from '../../shared/data/quran/surahs.json';
import type { KashshafData } from '../../shared/quran/kashshaf';

// docs/plans/balagha.md: al-Kashshaf for the reader's balagha sheet, a book the phone downloads and the website reads
// on its server. Quranpedia's dump of book 346 (Dar al-Kitab al-Arabi, 3rd ed. 1407), pinned by version.
const VERSION = '2026-08-10';
const URL = 'https://quranpedia.net/dumps/tafsir-book-346.json.gz';
const OUT = join(__dirname, '../../shared/data/quran');

const path = join(tmpdir(), `quranpedia-tafsir-book-346-${VERSION}.json`);
if (!existsSync(path)) execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${path}"`]);
const dump: Dump & { license: { version: string } } = JSON.parse(readFileSync(path, 'utf8'));
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);

type Item = { surah?: number; line?: (string | number)[] };
const words = new Map<string, string[]>();
let surah = 0;
let next = 1;
for (let page = 1; page <= 604; page++) {
  const items: Item[] = JSON.parse(readFileSync(join(OUT, 'mushaf', `${page}.json`), 'utf8')).items;
  for (const item of items) {
    if (item.surah) [surah, next] = [item.surah, 1];
    for (const token of item.line ?? []) {
      if (typeof token === 'number') { next = token + 1; continue; }
      if (token === '۞') continue;
      const key = `${surah}:${next}`;
      words.set(key, [...(words.get(key) ?? []), token]);
    }
  }
}
const quranWords = new Set([...words.values()].flat().map(skeleton));
const exclusions: Exclusion[] = JSON.parse(readFileSync(join(__dirname, 'kashshafExclusions.json'), 'utf8'));

const passages = readPassages(dump, number => surahs.find(row => row.number === number)?.numberOfAyat ?? 0);
const entries = passages.map(passage => {
  const text = markQuran(passage.text, quranWords);
  return entryOf(passage, text, litSentences({ ...passage, text }, key => words.get(key) ?? [], exclusions));
});

// Every ayah must fall in a passage; a grouped passage may cover ayat the dump keys nowhere.
const missing: string[] = [];
for (const row of surahs) for (let ayah = 1; ayah <= row.numberOfAyat; ayah++) {
  if (!entries.some(([s, from, to]) => s === row.number && from <= ayah && ayah <= to)) missing.push(`${row.number}:${ayah}`);
}
if (missing.length) throw new Error(`ayat in no passage: ${missing.join(', ')}`);
// And in one passage only, with text: the reader shows the first passage holding an ayah, so a second would be lost.
const twice = entries.flatMap((entry, i) => entries.slice(i + 1).filter(other => other[0] === entry[0] && other[1] <= entry[2] && entry[1] <= other[2]).map(other => `${entry[0]}:${entry[1]}-${entry[2]} / ${other[1]}-${other[2]}`));
if (twice.length) throw new Error(`ayat in two passages: ${twice.join(', ')}`);
const empty = entries.filter(entry => !entry[6].trim()).map(([s, from]) => `${s}:${from}`);
if (empty.length) throw new Error(`empty passages: ${empty.join(', ')}`);

const data: KashshafData = { source: { version: VERSION, book: 346, from: 'الموسوعة القرآنية https://quranpedia.net' }, entries };
writeFileSync(join(OUT, 'kashshaf.js'), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
writeFileSync(join(OUT, 'kashshaf.d.ts'), `// Generated next to this file by \`npm run quran:kashshaf\`.\nimport type { KashshafData } from '../../quran/kashshaf';\ndeclare const data: KashshafData;\nexport default data;\n`);
const lit = entries.flatMap(entry => entry[7]);
console.log(`kashshaf: ${entries.length} passages, ${new Set(lit.map(([s], i) => `${i}:${s}`)).size} lit devices in ${entries.filter(e => e[7].length).length} passages, ${lit.filter(l => l[3]).length} placed on ayah words`);
