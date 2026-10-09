import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import { ayahWords } from '../../src/lib/quran/normalize';
import { findPassages, MIN_WORDS } from '../../src/lib/quran/passages';

// docs/plans/quran-relations-page.md
const OUT = join(__dirname, '../../src/app/quran/data');

async function main() {
  const rows = await prisma.ayah.findMany({
    select: { number: true, text: true, surah: { select: { number: true, name: true, numberOfAyat: true } } },
    orderBy: [{ surah: { number: 'asc' } }, { number: 'asc' }],
  });
  const ayat = rows.map(r => ({ surah: r.surah.number, ayah: r.number, text: r.text }));
  const surahs = [...new Map(rows.map(r => [r.surah.number, r.surah])).values()].map(s => ({ n: s.number, name: s.name, count: s.numberOfAyat }));
  const passages = findPassages(ayat);

  const wanted = new Set<string>();
  for (const p of passages) {
    for (const side of [p.a, p.b]) {
      for (let a = side.from.ayah; a <= side.to.ayah; a++) wanted.add(`${side.from.surah}:${a}`);
    }
  }
  const text: Record<string, string> = {};
  for (const r of ayat) {
    const key = `${r.surah}:${r.ayah}`;
    if (wanted.has(key)) text[key] = ayahWords(r.text, r.ayah === 1 && r.surah !== 1 && r.surah !== 9).display.join(' ');
  }

  writeFileSync(join(OUT, 'runs.json'), JSON.stringify({ minWords: MIN_WORDS, surahs, passages }));
  writeFileSync(join(OUT, 'ayat.json'), JSON.stringify(text));
  console.log(`ayat ${ayat.length}, passages ${passages.length}, ayat shown ${wanted.size}`);
}

main().finally(() => prisma.$disconnect());
