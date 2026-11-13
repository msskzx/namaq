import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ORDER_AIMS, ORDER_LINKS } from '../../shared/quran/surahOrder';
import { ayahWords, type MushafPage } from '../../shared/quran/readerPage';
import surahs from '../../shared/data/quran/surahs.json';

// Reads the opening ayat of each surah on /quran/order and the ayat its links name from the bundled mushaf pages (no database).
const DATA = join(__dirname, '../../shared/data/quran');
const OUT = join(DATA, 'surahOrder.json');
const page = (n: number) => JSON.parse(readFileSync(join(DATA, 'mushaf', `${n}.json`), 'utf8')) as MushafPage;

const ayat: Record<string, string> = {};
const read = (key: string) => {
  if (ayat[key]) return ayat[key];
  const surah = Number(key.split(':')[0]);
  const first = surahs.find(s => s.number === surah)!.page;
  for (let n = first; n <= 604 && !ayat[key]; n++) {
    const before = surahs.findLast(s => s.page != null && s.page < n)?.number;
    const words = ayahWords(key, page(n), before);
    if (words.length) ayat[key] = words.join(' ');
  }
  if (!ayat[key]) throw new Error(`${key} is not in the mushaf pages`);
  return ayat[key];
};

// The opening: whole ayat from the first until ten words, four ayat or the surah's end.
const numbers = Object.keys(ORDER_AIMS).map(Number);
const openings: Record<number, string[]> = {};
for (const surah of numbers) {
  const keys: string[] = [];
  let count = 0;
  const last = surahs.find(s => s.number === surah)!.numberOfAyat;
  for (let a = 1; a <= last && count < 10 && keys.length < 4; a++) {
    const key = `${surah}:${a}`;
    count += read(key).split(' ').length;
    keys.push(key);
  }
  openings[surah] = keys;
}
for (const link of Object.values(ORDER_LINKS)) for (const pair of link.pairs) pair.forEach(read);

const named = new Set(Object.keys(ayat).map(key => Number(key.split(':')[0])));
const pick = <T>(f: (s: (typeof surahs)[number]) => T) => Object.fromEntries(surahs.filter(s => named.has(s.number)).map(s => [s.number, f(s)]));
const sorted = Object.fromEntries(Object.entries(ayat).sort(([a], [b]) => {
  const [sa, aa] = a.split(':').map(Number);
  const [sb, ab] = b.split(':').map(Number);
  return sa - sb || aa - ab;
}));
writeFileSync(OUT, `${JSON.stringify({ names: pick(s => s.name), counts: pick(s => s.numberOfAyat), openings, ayat: sorted }, null, 1)}\n`);
console.log(`surahs ${numbers.length}, ayat ${Object.keys(ayat).length}`);
