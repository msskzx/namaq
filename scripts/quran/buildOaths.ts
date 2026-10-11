import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { OATHS } from '../../src/lib/quran/oaths';
import { ayahWords } from '../../src/lib/quran/normalize';

const OUT = join(__dirname, '../../src/app/quran/oaths/ayat.json');

async function main() {
  const surahs = await prisma.surah.findMany({
    where: { number: { in: [...new Set(OATHS.map(o => o.surah))] } },
    select: { number: true, name: true },
    orderBy: { number: 'asc' },
  });
  const rows = await prisma.ayah.findMany({
    where: { OR: OATHS.map(o => ({ surah: { number: o.surah }, number: { gte: o.range[0], lte: o.range[1] } })) },
    select: { number: true, text: true, surah: { select: { number: true } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
  });
  const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1).display.join(' ')]));
  const names = Object.fromEntries(surahs.map(s => [s.number, s.name]));
  mkdirSync(join(OUT, '..'), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ names, ayat }, null, 1)}\n`);
  console.log(`surahs ${surahs.length}, ayat ${rows.length}`);
}

main().finally(() => prisma.$disconnect());
