import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { prisma } from '../../src/lib/prisma';
import type { ReaderItem, ReaderPageData } from '../../src/lib/quran/readerPage';

// docs/data-pipelines.md
const OUT = join(__dirname, '../../src/app/quran/read/data');
const SAJDA = '۩';

type ApiWord = { position: number; char_type_name: string; line_number: number; text_uthmani: string };
type ApiVerse = { verse_key: string; verse_number: number; juz_number: number; sajdah_number: number | null; words: ApiWord[] };

async function fetchPage(page: number): Promise<ApiVerse[]> {
  const url = `https://api.quran.com/api/v4/verses/by_page/${page}?words=true&word_fields=line_number,text_uthmani&per_page=50&mushaf=2`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(url);
    if (response.ok) return (await response.json()).verses;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
  throw new Error(`page ${page} failed`);
}

function build(verses: ApiVerse[], lengths: Map<number, number>): ReaderPageData {
  const byLine = new Map<number, { tokens: (string | number)[]; startsSurah: number | null; endsSurah: boolean }>();
  for (const verse of verses) {
    const surah = Number(verse.verse_key.split(':')[0]);
    for (const word of verse.words) {
      const line = byLine.get(word.line_number) ?? { tokens: [], startsSurah: null, endsSurah: false };
      byLine.set(word.line_number, line);
      if (word.char_type_name === 'end') {
        if (verse.sajdah_number !== null) line.tokens.push(SAJDA);
        line.tokens.push(verse.verse_number);
        line.endsSurah = verse.verse_number === lengths.get(surah);
      } else {
        if (word.position === 1 && verse.verse_number === 1) line.startsSurah = surah;
        line.tokens.push(word.text_uthmani);
      }
    }
  }
  const items: ReaderItem[] = [];
  for (const number of [...byLine.keys()].sort((a, b) => a - b)) {
    const line = byLine.get(number)!;
    if (line.startsSurah) items.push({ surah: line.startsSurah });
    items.push(line.endsSurah && typeof line.tokens.at(-1) === 'number' ? { line: line.tokens, short: true } : { line: line.tokens });
  }
  return { juz: verses[0].juz_number, items };
}

async function main() {
  const lengths = new Map((await prisma.surah.findMany({ select: { number: true, numberOfAyat: true } })).map(s => [s.number, s.numberOfAyat]));
  mkdirSync(OUT, { recursive: true });
  for (let first = 1; first <= 604; first += 6) {
    const pages = Array.from({ length: 6 }, (_, i) => first + i).filter(n => n <= 604);
    const fetched = await Promise.all(pages.map(fetchPage));
    pages.forEach((page, i) => writeFileSync(join(OUT, `${page}.json`), `${JSON.stringify(build(fetched[i], lengths))}\n`));
  }
  console.log('pages 604');
}

main().finally(() => prisma.$disconnect());
