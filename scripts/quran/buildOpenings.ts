import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { OPENING_SURAHS } from '../../src/lib/quran/openings';
import { ayahWords } from '../../src/lib/quran/normalize';

const OUT = join(__dirname, '../../src/app/quran/openings/ayat.json');

async function main() {
  const surahs = await prisma.surah.findMany({ where: { number: { in: OPENING_SURAHS } }, select: { number: true, name: true }, orderBy: { number: 'asc' } });
  const rows = await prisma.ayah.findMany({
    where: { number: 1, surah: { number: { in: OPENING_SURAHS } } },
    select: { number: true, text: true, surah: { select: { number: true } } },
    orderBy: { surah: { number: 'asc' } },
  });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:1`, ayahWords(r.text, true).display.join(' ')]));
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  writeFileSync(OUT, `${JSON.stringify({ names, ayat }, null, 1)}\n`);
  console.log(`surahs ${surahs.length}, ayat ${rows.length}`);
}

main().finally(() => prisma.$disconnect());
