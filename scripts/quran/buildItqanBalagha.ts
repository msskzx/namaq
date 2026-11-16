import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { skeleton } from './irabUkbari';
import { entryOf, firstWords, placeQuotes, readParagraphs, type MushafWord, type TurathPage } from './itqanBalagha';
import type { ItqanData } from '../../shared/quran/itqanBalagha';

// docs/plans/balagha.md: al-Itqan's chapters on balagha for the reader's balagha sheet, built into the app. Turath's
// export of Shamela 11728 (Abu al-Fadl Ibrahim's edition), pinned by its hash like scripts/quran/verifyOrderQuotes.ts.
const BOOK = 11728;
const SHA = '56e52b86c23a0d363a6e51d8fee677eec4f582ceb580e14d2beb8c851400d9f9';
const OUT = join(__dirname, '../../shared/data/quran');
// Shamela pages 884 to 1095: kind 52 (al-haqiqa wa-l-majaz, 3/120) to the end of kind 58 (bada'i', 3/331). Page 942 is
// left out: a stray piece under a second title of kind 55, numbered 3/68, whose text the export cut («...»).
const FIRST = 884;
const LAST = 1095;
const STRAY = 942;

const path = join(tmpdir(), `turath-${BOOK}.json`);
if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${BOOK}.json`], { maxBuffer: 32 * 1024 * 1024 }));
const raw = readFileSync(path);
const sha = createHash('sha256').update(raw).digest('hex');
if (SHA && sha !== SHA) throw new Error(`Turath ${BOOK}: sha ${sha}, expected ${SHA}`);
const book: { pages: TurathPage[] } = JSON.parse(raw.toString('utf8'));

const pages = book.pages.map((page, i) => ({ ...page, id: i + 1 })).filter(page => page.id >= FIRST && page.id <= LAST && page.id !== STRAY);
const { paragraphs, kinds } = readParagraphs(pages);
if (Object.keys(kinds).length !== 7) throw new Error(`kinds found: ${Object.keys(kinds).join(', ')}`);

const mushaf: MushafWord[] = [];
let surah = 0;
let next = 1;
let at = 0;
for (let page = 1; page <= 604; page++) {
  for (const item of JSON.parse(readFileSync(join(OUT, 'mushaf', `${page}.json`), 'utf8')).items as { surah?: number; line?: (string | number)[] }[]) {
    if (item.surah) [surah, next, at] = [item.surah, 1, 0];
    for (const token of item.line ?? []) {
      if (typeof token === 'number') { [next, at] = [token + 1, 0]; continue; }
      if (token === '۞') continue;
      mushaf.push({ surah, ayah: next, at: at++, skeleton: skeleton(token) });
    }
  }
}
const first = firstWords(mushaf);

const entries = paragraphs.map(paragraph => entryOf(paragraph, placeQuotes(paragraph.text, mushaf, first))).filter(entry => entry[7].length);
const data: ItqanData = { source: { book: BOOK, sha }, kinds, entries };
writeFileSync(join(OUT, 'itqanBalagha.js'), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
writeFileSync(join(OUT, 'itqanBalagha.d.ts'), `// Generated next to this file by \`npm run quran:itqan-balagha\`.\nimport type { ItqanData } from '../../quran/itqanBalagha';\ndeclare const data: ItqanData;\nexport default data;\n`);

const quotes = paragraphs.flatMap(paragraph => [...paragraph.text.matchAll(/﴿/g)]).length;
const ayat = new Set(entries.flatMap(entry => entry[7].map(([s, a]) => `${s}:${a}`)));
const shared = entries.flatMap(entry => entry[7]).filter(place => place[4] > 1).length;
console.log(`itqan: ${paragraphs.length} paragraphs, ${quotes} quotes; ${entries.length} paragraphs placed on ${ayat.size} ayat, ${shared} places shared by a quote that fits several; sha ${sha}`);
