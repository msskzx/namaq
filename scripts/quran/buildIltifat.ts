import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { CURATED } from '../../src/lib/quran/curatedShifts';
import { ayahWords } from '../../src/lib/quran/normalize';

// docs/plans/quran-within-surah.md
const OUT = join(__dirname, '../../src/app/quran/iltifat/ayat.json');

async function main() {
  const rows = await prisma.ayah.findMany({
    where: { OR: CURATED.map(c => ({ surah: { number: c.surah }, number: { gte: c.parts[0][0], lte: c.parts[c.parts.length - 1][1] } })) },
    select: { number: true, text: true, surah: { select: { number: true, name: true } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
  });
  const names = Object.fromEntries(rows.map(r => [r.surah.number, r.surah.name]));
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1 && r.surah.number !== 1 && r.surah.number !== 9).display.join(' ')]));
  writeFileSync(OUT, `${JSON.stringify({ names, ayat }, null, 1)}\n`);
  console.log(`ayat ${rows.length}`);
}

main().finally(() => prisma.$disconnect());
