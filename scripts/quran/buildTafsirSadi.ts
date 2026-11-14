import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import type { TafsirPassage, TafsirSegment } from '../../shared/quran/tafsirSadi';
import { mushafText } from '../../shared/quran/mushafText';

const input = process.argv[2];
if (!input) throw new Error('Usage: tsx scripts/quran/buildTafsirSadi.ts <tafsir-book-3.json.gz>');
const raw = readFileSync(input);
const dump = JSON.parse(gunzipSync(raw).toString('utf8')) as {
  license: { version: string; en: string };
  book: { id: number; name: string; edition: string; nasher: string; mohaqeq: string };
  ayahs: { surah: number; ayah: number; content: { text: string; part: string; page: number | null }[] }[];
};
if (dump.book.id !== 3 || dump.book.name !== 'تيسير الكريم الرحمن') throw new Error('Expected Al-Sa’di, book 3');

function segments(html: string): TafsirSegment[] {
  const out: TafsirSegment[] = [];
  let quran = false;
  for (const token of html.replace(/\\[rn]/g, '\n').split(/(<[^>]+>)/g)) {
    if (token.startsWith('<')) {
      if (/^<span\b/.test(token)) quran = /book-ayah/.test(token);
      else if (/^<\/span/.test(token)) quran = false;
      else if (/^<(?:br\b|\/?(?:div|p|h3|tr)\b)/.test(token)) append('\n');
      else if (!/^<\/?(?:strong|table|td)\b/.test(token)) throw new Error(`Unexpected HTML ${token}`);
    } else append(token);
  }
  function append(text: string) {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && !!last.quran === quran) last.text += text;
    else out.push(quran ? { text, quran: true } : { text });
  }
  return out;
}

const passages: TafsirPassage[] = [];
const seen = new Map<string, number>();
const ayat: Record<string, number[]> = {};
const corpus = JSON.parse(readFileSync(resolve(__dirname, '../../shared/data/quran/trees.json'), 'utf8')) as { ayat: { key: string; words: string[] }[] };
const quran = Object.fromEntries(corpus.ayat.map(ayah => [ayah.key, mushafText(ayah.words.join(' '))]));
for (const row of dump.ayahs) {
  const key = `${row.surah}:${row.ayah}`;
  if (key in ayat) throw new Error(`Duplicate ayah ${key}`);
  ayat[key] = row.content.map(content => {
    const page = content.page ?? (row.surah === 104 ? 934 : null);
    if (!page || !Number.isInteger(page) || Number(content.part) !== 1) throw new Error(`Missing locator ${key}`);
    const passage = { part: Number(content.part), page, segments: segments(content.text) };
    const signature = JSON.stringify(passage);
    let index = seen.get(signature);
    if (index === undefined) { index = passages.length; passages.push(passage); seen.set(signature, index); }
    return index;
  });
}
if (Object.keys(ayat).length !== 6236) throw new Error('Incomplete ayah coverage');
writeFileSync(resolve(__dirname, '../../shared/data/quran/tafsirSadi.json'), JSON.stringify({
  source: {
    name: 'الموسوعة القرآنية', url: 'https://quranpedia.net',
    dump: 'https://api.quranpedia.net/dumps/tafsir-book-3.json.gz', version: dump.license.version,
    sha256: createHash('sha256').update(raw).digest('hex'), license: dump.license.en,
    book: dump.book.name, publisher: dump.book.nasher, edition: dump.book.edition, editor: dump.book.mohaqeq,
    corrections: [{ ayat: '104:1–9', page: 934, url: 'https://quranpedia.net/book/3/1/934' }],
  }, passages, ayat,
  quran,
}) + '\n');
console.log(`Wrote ${passages.length} source passages for ${Object.keys(ayat).length} ayat`);
