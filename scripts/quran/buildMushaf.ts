import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MushafItem, MushafPage } from '../../src/lib/quran/readerPage';

// docs/data-pipelines.md
const OUT = join(__dirname, '../../src/app/quran/read/mushaf');
const SURAHS_OPENING_A_QUARTER = [1, 4, 5, 7, 8, 9, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 33, 40, 46, 49, 55, 56, 58, 62, 65, 66, 67, 68, 69, 72, 75, 78, 80, 82, 84, 87, 90, 94];

type LayoutWord = { type: string; verse_key?: string; position?: number | null; text: string; sura?: number };
type LayoutPage = { lines: { words: LayoutWord[] }[] };
type HafsAyah = { sora: number; aya_no: number; aya_text: string };

const [layoutDir, hafsFile] = process.argv.slice(2);
if (!layoutDir || !hafsFile) throw new Error('usage: npm run quran:mushaf -- <quran-qcf4 pages dir> <hafsData_v18.json>');

const layout = Array.from({ length: 604 }, (_, i): LayoutPage => JSON.parse(readFileSync(join(layoutDir, `${String(i + 1).padStart(3, '0')}.json`), 'utf8')));
const hafs = new Map(
  (JSON.parse(readFileSync(hafsFile, 'utf8')) as HafsAyah[]).map(row => [`${row.sora}:${row.aya_no}`, row.aya_text.split(/\s+/).slice(0, -1).filter(word => word !== '۞')]),
);

const bare = (text: string) => text.replace(/ٱ/g, 'ا').replace(/[^ء-ي]/g, '').replace(/ا/g, '');

const layoutWords = new Map<string, string[]>();
for (const page of layout)
  for (const line of page.lines)
    for (const word of line.words) if (word.type === 'word') layoutWords.set(word.verse_key!, [...(layoutWords.get(word.verse_key!) ?? []), word.text]);

const words = new Map<string, string[]>();
for (const [key, slots] of layoutWords) {
  const text = [...hafs.get(key)!];
  if (slots.length === text.length + 1) {
    const at = slots.at(-1)!.startsWith('#') ? text.length : text.findIndex((word, i) => bare(slots[i] + slots[i + 1]) === bare(word)) + 1;
    text.splice(at, 0, '');
  }
  if (slots.length !== text.length) throw new Error(`${key}: ${slots.length} layout words, ${text.length} words of text`);
  words.set(key, text);
}

let quarter = 0;
let juz = 1;
mkdirSync(OUT, { recursive: true });
layout.forEach((page, index) => {
  const items: MushafItem[] = [];
  for (const { words: row } of page.lines) {
    const first = row[0];
    if (first.type === 'surah_header') items.push({ surah: first.sura! });
    else if (first.type === 'bismillah') items.push({ basmala: true });
    else {
      const tokens: (string | number)[] = [];
      let starts = 0;
      for (const word of row) {
        const [surah, ayah] = (word.verse_key ?? '').split(':').map(Number);
        const opens = (word.type === 'quarter') || (word.type === 'word' && word.position === 1 && ayah === 1 && SURAHS_OPENING_A_QUARTER.includes(surah));
        if (opens && !(word.type === 'word' && tokens.at(-1) === '۞')) {
          quarter++;
          starts ||= quarter;
          if ((quarter - 1) % 8 === 0) juz = (quarter - 1) / 8 + 1;
        }
        if (word.type === 'quarter') tokens.push('۞');
        else if (word.type === 'end') tokens.push(Number(word.text.slice(1)));
        else if (word.type === 'word') {
          const text = words.get(word.verse_key!)![word.position! - 1];
          if (text) tokens.push(text);
        }
      }
      items.push(starts ? { line: tokens, quarter: starts } : { line: tokens });
    }
  }
  const data: MushafPage = { juz, items };
  writeFileSync(join(OUT, `${index + 1}.json`), `${JSON.stringify(data)}\n`);
});
if (quarter !== 240) throw new Error(`counted ${quarter} quarters, expected 240`);
console.log('pages 604');
