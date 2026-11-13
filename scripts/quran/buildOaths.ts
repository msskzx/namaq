import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALLAH_OATHS, OTHER_OATHS } from '../../shared/quran/oaths';
import { ayahWords, type MushafPage } from '../../shared/quran/readerPage';
import surahs from '../../shared/data/quran/surahs.json';

// Reads every oath's ayat from the bundled mushaf pages (no database), for the oaths page on the website and in the app.
const DATA = join(__dirname, '../../shared/data/quran');
const OUT = join(DATA, 'oaths.json');
const page = (n: number) => JSON.parse(readFileSync(join(DATA, 'mushaf', `${n}.json`), 'utf8')) as MushafPage;

const oaths = [...ALLAH_OATHS, ...OTHER_OATHS];
const keys = oaths.flatMap(o => Array.from({ length: o.range[1] - o.range[0] + 1 }, (_, k) => `${o.surah}:${o.range[0] + k}`));
const ayat: Record<string, string> = {};
for (const key of keys) {
  const surah = Number(key.split(':')[0]);
  const first = surahs.find(s => s.number === surah)!.page;
  for (let n = first; n <= 604 && !ayat[key]; n++) {
    const before = surahs.findLast(s => s.page != null && s.page < n)?.number;
    const words = ayahWords(key, page(n), before);
    if (words.length) ayat[key] = words.join(' ');
  }
  if (!ayat[key]) throw new Error(`${key} is not in the mushaf pages`);
}
const names = Object.fromEntries([...new Set(oaths.map(o => o.surah))].sort((a, b) => a - b).map(n => [n, surahs.find(s => s.number === n)!.name]));
writeFileSync(OUT, `${JSON.stringify({ names, ayat: Object.fromEntries(Object.entries(ayat).sort(([a], [b]) => {
  const [sa, aa] = a.split(':').map(Number);
  const [sb, ab] = b.split(':').map(Number);
  return sa - sb || aa - ab;
})) }, null, 1)}\n`);
console.log(`surahs ${Object.keys(names).length}, ayat ${keys.length}`);
