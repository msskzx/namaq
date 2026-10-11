import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { HOPS } from '../../src/lib/quran/surahOrder';
import { ayahWords } from '../../src/lib/quran/normalize';

const OUT = join(__dirname, '../../src/app/quran/order/ayat.json');

async function main() {
  const wanted = HOPS.flatMap(h => [
    { surah: h.from, range: h.tail },
    { surah: h.from + 1, range: h.head },
  ]);
  const [lo, hi] = [HOPS[0].from, HOPS[HOPS.length - 1].from + 1];
  const surahs = await prisma.surah.findMany({ where: { number: { gte: lo, lte: hi } }, select: { number: true, name: true, numberOfAyat: true }, orderBy: { number: 'asc' } });
  const rows = await prisma.ayah.findMany({
    where: { OR: wanted.map(w => ({ surah: { number: w.surah }, number: { gte: w.range[0], lte: w.range[1] } })) },
    select: { number: true, text: true, surah: { select: { number: true } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
  });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1 && r.surah.number !== 1 && r.surah.number !== 9).display.join(' ')]));
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  const counts = Object.fromEntries(surahs.map(s => [s.number, s.numberOfAyat]));
  writeFileSync(OUT, `${JSON.stringify({ names, counts, ayat }, null, 1)}\n`);
  console.log(`surahs ${surahs.length}, ayat ${rows.length}`);
}

main().finally(() => prisma.$disconnect());
