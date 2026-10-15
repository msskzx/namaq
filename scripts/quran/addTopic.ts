import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import type { TopicRecord } from '../../src/lib/quran/topicTypes';

const DATA_DIR = process.env.QURAN_TOPICS_DIR ?? join(__dirname, '../../data/quran/topics');

function usage(): never {
  console.error(
    'usage: tsx scripts/quran/addTopic.ts <surah> <slug> <labelAr> <themeId|-> <ayahFrom> <ayahTo> <startWord> <endWord> [alternativeOf]\n' +
      '  startWord/endWord are 1-based word positions counted across the whole ayahFrom..ayahTo range (space-separated tokens).\n' +
      '  excerptAr is sliced verbatim from the real ayah text — never type it by hand.',
  );
  process.exit(1);
}

async function main() {
  const [surahArg, slug, labelAr, themeIdArg, fromArg, toArg, startArg, endArg, alternativeOf] = process.argv.slice(2);
  if (!surahArg || !slug || !labelAr || !fromArg || !toArg || !startArg || !endArg) usage();

  const surah = Number(surahArg);
  const ayahFrom = Number(fromArg);
  const ayahTo = Number(toArg);
  const startWord = Number(startArg);
  const endWord = Number(endArg);
  const themeId = themeIdArg === '-' ? null : themeIdArg;

  const rows = await prisma.ayah.findMany({
    where: { surah: { number: surah }, number: { gte: ayahFrom, lte: ayahTo } },
    select: { number: true, text: true },
    orderBy: { number: 'asc' },
  });
  if (rows.length !== ayahTo - ayahFrom + 1) {
    console.error(`ayah range ${ayahFrom}-${ayahTo} not fully found for surah ${surah}`);
    process.exit(1);
  }

  const words = rows.map((r) => r.text).join(' ').split(' ');
  if (startWord < 1 || endWord < startWord || endWord > words.length) {
    console.error(`word range ${startWord}-${endWord} out of bounds (range has ${words.length} words)`);
    process.exit(1);
  }
  const excerptAr = words.slice(startWord - 1, endWord).join(' ');

  mkdirSync(DATA_DIR, { recursive: true });
  const file = join(DATA_DIR, `${surah}.json`);
  const records: TopicRecord[] = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
  if (records.some((r) => r.slug === slug)) {
    console.error(`slug "${slug}" already exists in surah ${surah}'s file`);
    process.exit(1);
  }
  records.push({ slug, labelAr, themeId, ayahFrom, ayahTo, excerptAr, alternativeOf: alternativeOf ?? null });
  records.sort((a, b) => a.ayahFrom - b.ayahFrom);
  writeFileSync(file, `${JSON.stringify(records, null, 2)}\n`);
  console.log(`added ${slug} (${surah}:${ayahFrom}-${ayahTo}): ${excerptAr}`);
}

main().finally(() => prisma.$disconnect());
