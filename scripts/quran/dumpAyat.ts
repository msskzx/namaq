import { prisma } from '../../src/lib/prisma';

async function main() {
  const surah = Number(process.argv[2]);
  if (!surah) {
    console.error('usage: tsx scripts/quran/dumpAyat.ts <surahNumber>');
    process.exitCode = 1;
    return;
  }
  const rows = await prisma.ayah.findMany({
    where: { surah: { number: surah } },
    select: { number: true, text: true },
    orderBy: { number: 'asc' },
  });
  for (const row of rows) console.log(`${row.number}\t${row.text}`);
}

main().finally(() => prisma.$disconnect());
