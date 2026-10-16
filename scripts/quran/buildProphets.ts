import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { STORIES } from '../../src/lib/quran/prophets/stories';
import { ayahWords } from '../../src/lib/quran/normalize';

const DIR = join(__dirname, '../../src/app/quran/prophets/ayat');

async function main() {
  mkdirSync(DIR, { recursive: true });
  for (const [slug, { events }] of Object.entries(STORIES)) {
    const segments = events.flatMap(e => e.segments);
    const surahs = await prisma.surah.findMany({
      where: { number: { in: [...new Set(segments.map(g => g.surah))] } },
      select: { number: true, name: true },
      orderBy: { number: 'asc' },
    });
    const rows = await prisma.ayah.findMany({
      where: { OR: segments.map(g => ({ surah: { number: g.surah }, number: { gte: g.range[0], lte: g.range[1] } })) },
      select: { number: true, text: true, surah: { select: { number: true } } },
      orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
    });
    const ayat = Object.fromEntries(rows.map(r => [`${r.surah.number}:${r.number}`, ayahWords(r.text, r.number === 1).display.join(' ')]));
    const names = Object.fromEntries(surahs.map(x => [x.number, x.name]));
    writeFileSync(join(DIR, `${slug}.json`), `${JSON.stringify({ names, ayat }, null, 1)}\n`);
    console.log(`${slug}: surahs ${surahs.length}, ayat ${rows.length}`);
  }
}

main().finally(() => prisma.$disconnect());
