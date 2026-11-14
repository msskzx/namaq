import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { FIRST_PAGE, LAST_PAGE, cleanPiece, joinPieces } from './sadiClean';

// docs/plans/sadi-tafsir.md: al-Sa'di's Taysir al-Karim al-Rahman from Quranpedia's tafsir dump, one passage per group
// of ayat, written to shared/data/quran/tafsirSadi.json.
const VERSION = '2026-08-10';
const URL = 'https://quranpedia.net/dumps/tafsir-book-3.json.gz';
const OUT = join(__dirname, '../../shared/data/quran/tafsirSadi.json');
// The dump has no page for al-Humaza; its heading closes page 934 (end of al-Asr), and al-Fil starts on 934 too.
const HUMAZA_PAGE = 934;

const dumpPath = join(tmpdir(), `quranpedia-sadi-${VERSION}.json`);
if (!existsSync(dumpPath)) execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${dumpPath}"`]);
const dump = JSON.parse(readFileSync(dumpPath, 'utf8')) as {
  license: { version: string };
  book: { id: number; name: string; edition: string; nasher: string; mohaqeq: string };
  ayahs: { surah: number; ayah: number; content: { text: string; part: string; page: number | null }[] }[];
};
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);
if (dump.book.id !== 3) throw new Error('expected book 3, al-Sa\'di');

type Passage = { surah: number; from: number; to: number; pages: [number, number]; text: string };
const passages: Passage[] = [];
const ayat: Record<string, number> = {};
const bySignature = new Map<string, number>();

for (const row of [...dump.ayahs].sort((a, b) => a.surah - b.surah || a.ayah - b.ayah)) {
  const key = `${row.surah}:${row.ayah}`;
  if (key in ayat) throw new Error(`duplicate ayah ${key}`);
  const pieces = row.content
    .map(c => ({ page: c.page ?? (row.surah === 104 ? HUMAZA_PAGE : null), text: cleanPiece(c.text) }))
    .filter(p => p.page !== null && p.page >= FIRST_PAGE && p.page <= LAST_PAGE && p.text);
  if (!pieces.length) throw new Error(`no tafsir text for ${key}`);
  // The range marker that opens a passage ("{١ - ٣}") is the print edition's; the sheet names the range itself.
  const text = joinPieces(pieces.map(p => p.text)).replace(/^\{[^}]*\}\s*/, '');
  const pages: [number, number] = [pieces[0].page!, pieces[pieces.length - 1].page!];
  // The same passage repeats on every ayah it explains; consecutive ayat that share it form its range.
  const signature = `${row.surah}|${text}`;
  const found = bySignature.get(signature);
  if (found !== undefined && passages[found].to === row.ayah - 1) {
    passages[found].to = row.ayah;
    ayat[key] = found;
    continue;
  }
  bySignature.set(signature, passages.length);
  ayat[key] = passages.length;
  passages.push({ surah: row.surah, from: row.ayah, to: row.ayah, pages, text });
}
if (Object.keys(ayat).length !== 6236) throw new Error(`covered ${Object.keys(ayat).length} ayat, expected 6236`);

writeFileSync(OUT, `${JSON.stringify({
  source: { version: dump.license.version, edition: dump.book.edition, publisher: dump.book.nasher, editor: dump.book.mohaqeq },
  passages: passages.map(p => [p.surah, p.from, p.to, p.pages[0], p.pages[1], p.text]),
})}\n`);
console.log(`Wrote ${passages.length} passages for ${Object.keys(ayat).length} ayat`);
