import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import type { TopicRecord } from '../../src/lib/quran/topicTypes';

const DATA_DIR = join(__dirname, '../../data/quran/topics');
const RANGE_SPAN_WARNING = 15;
const AYAH_TOPIC_COUNT_WARNING = 4;

const apply = process.argv.includes('--apply');

function loadSurahFiles(): Map<number, TopicRecord[]> {
  const files = readdirSync(DATA_DIR).filter((f) => /^\d+\.json$/.test(f));
  const bySurah = new Map<number, TopicRecord[]>();
  for (const file of files) {
    const surah = Number(file.replace('.json', ''));
    const records = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')) as TopicRecord[];
    bySurah.set(surah, records);
  }
  return bySurah;
}

async function ayahTextBySurah(surahs: number[]): Promise<Map<number, Map<number, string>>> {
  const rows = await prisma.ayah.findMany({
    where: { surah: { number: { in: surahs } } },
    select: { number: true, text: true, surah: { select: { number: true } } },
  });
  const bySurah = new Map<number, Map<number, string>>();
  for (const row of rows) {
    const bySurahNumber = bySurah.get(row.surah.number) ?? new Map<number, string>();
    bySurahNumber.set(row.number, row.text);
    bySurah.set(row.surah.number, bySurahNumber);
  }
  return bySurah;
}

function rangeText(ayat: Map<number, string> | undefined, from: number, to: number): string | null {
  if (!ayat) return null;
  const parts: string[] = [];
  for (let n = from; n <= to; n++) {
    const text = ayat.get(n);
    if (text === undefined) return null;
    parts.push(text);
  }
  return parts.join(' ');
}

async function main() {
  const bySurah = loadSurahFiles();
  const ayat = await ayahTextBySurah([...bySurah.keys()]);

  const errors: string[] = [];
  const warnings: string[] = [];
  let total = 0;

  for (const [surah, records] of bySurah) {
    const topicsPerAyah = new Map<number, number>();
    const seenSlugs = new Set<string>();

    for (const record of records) {
      total += 1;
      if (seenSlugs.has(record.slug)) {
        errors.push(`${surah}:${record.slug} — duplicate slug within this surah's file`);
      }
      seenSlugs.add(record.slug);

      const full = rangeText(ayat.get(surah), record.ayahFrom, record.ayahTo);
      if (full === null) {
        errors.push(`${surah}:${record.slug} — ayah range ${record.ayahFrom}-${record.ayahTo} not found`);
      } else if (!full.includes(record.excerptAr)) {
        errors.push(`${surah}:${record.slug} — excerptAr is not a verbatim substring of ${record.ayahFrom}-${record.ayahTo}`);
      }

      const span = record.ayahTo - record.ayahFrom + 1;
      if (span > RANGE_SPAN_WARNING) {
        warnings.push(`${surah}:${record.slug} — range spans ${span} ayat (> ${RANGE_SPAN_WARNING})`);
      }
      for (let n = record.ayahFrom; n <= record.ayahTo; n++) {
        topicsPerAyah.set(n, (topicsPerAyah.get(n) ?? 0) + 1);
      }
    }

    for (const [ayah, count] of topicsPerAyah) {
      if (count > AYAH_TOPIC_COUNT_WARNING) {
        warnings.push(`${surah}:${ayah} — ${count} topics stacked (> ${AYAH_TOPIC_COUNT_WARNING})`);
      }
    }
  }

  console.log(`Quran topics sync (${apply ? 'apply' : 'dry run'})`);
  console.log(`Surahs: ${bySurah.size}, topic records: ${total}`);
  if (warnings.length) {
    console.log(`Warnings: ${warnings.length}`);
    for (const warning of warnings) console.log(`  ${warning}`);
  }

  if (errors.length) {
    console.error(`Errors: ${errors.length}`);
    for (const error of errors) console.error(`  ${error}`);
    process.exitCode = 1;
    return;
  }

  if (!apply) return;

  for (const [surah, records] of bySurah) {
    await prisma.$transaction([
      prisma.quranTopic.deleteMany({ where: { surah } }),
      ...(records.length === 0
        ? []
        : [
            prisma.quranTopic.createMany({
              data: records.map((record) => ({
                surah,
                slug: record.slug,
                labelAr: record.labelAr,
                themeId: record.themeId ?? null,
                ayahFrom: record.ayahFrom,
                ayahTo: record.ayahTo,
                excerptAr: record.excerptAr,
                alternativeOf: record.alternativeOf ?? null,
              })),
            }),
          ]),
    ]);
  }
  console.log('Applied.');
}

main().finally(() => prisma.$disconnect());
