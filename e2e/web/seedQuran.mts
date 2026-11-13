// Fills an empty local database with the surahs and ayat the website's pages read (e2e/cloud-db.sh).
// Text and names come from the quran-json package; pages and juz from the bundled mushaf.
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '../../src/generated/prisma/index.js';

const url = process.env.DATABASE_URL ?? '';
if (!/@(127\.0\.0\.1|localhost)[:/]/.test(url)) throw new Error('seedQuran wipes the surah and ayah tables, so it runs only against a local DATABASE_URL (e2e/cloud-db.sh sets one).');

type Surah = { id: number; name: string; transliteration: string; total_verses: number; verses: { id: number; text: string }[] };

const quran: Surah[] = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const mushaf = path.resolve(import.meta.dirname, '../../shared/data/quran/mushaf');
const where = new Map<string, { page: number; juz: number }>();
let surah = 1;
for (let page = 1; page <= 604; page++) {
  const data = JSON.parse(fs.readFileSync(`${mushaf}/${page}.json`, 'utf8'));
  for (const item of data.items) {
    if (item.surah) surah = item.surah;
    for (const token of item.line ?? []) if (typeof token === 'number') where.set(`${surah}:${token}`, { page, juz: data.juz });
  }
}

const prisma = new PrismaClient();
await prisma.ayah.deleteMany();
await prisma.surah.deleteMany();
for (const entry of quran) {
  const row = await prisma.surah.create({
    data: { name: `سُورَةُ ${entry.name}`, number: entry.id, nameTransliterated: entry.transliteration, numberOfAyat: entry.total_verses, page: where.get(`${entry.id}:1`)?.page },
  });
  await prisma.ayah.createMany({
    data: entry.verses.map(verse => {
      const place = where.get(`${entry.id}:${verse.id}`) ?? { page: 1, juz: 1 };
      return { surahId: row.id, number: verse.id, text: verse.text, juz: place.juz, page: place.page, manzil: 1, ruku: 1, hizbQuarter: 1, sajda: false };
    }),
  });
}
console.log(`seeded ${await prisma.surah.count()} surahs, ${await prisma.ayah.count()} ayat (${where.size} placed on mushaf pages)`);
await prisma.$disconnect();
