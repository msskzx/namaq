import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { EXAMPLES } from '../../shared/quran/iltifat';
import { ayahWords } from '../../shared/quran/normalize';

// The text of the iltifat page's examples, read by the website and the app (shared/quran/iltifat.ts).
const OUT = join(__dirname, '../../shared/data/quran/iltifat.json');

async function main() {
  const rows = await prisma.ayah.findMany({
    where: { OR: EXAMPLES.map(e => ({ surah: { number: e.surah }, number: { gte: e.from, lte: e.to } })) },
    select: { number: true, text: true, surah: { select: { number: true } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
  });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1 && r.surah.number !== 1 && r.surah.number !== 9).display.join(' ')]));
  writeFileSync(OUT, `${JSON.stringify({ ayat }, null, 1)}\n`);
  console.log(`ayat ${rows.length}`);
}

main().finally(() => prisma.$disconnect());
