import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { FIRST_PAGE, LAST_PAGE, cleanPiece, joinPieces } from './sadiClean';
import { audit, fillGaps, indexShamela, loadShamela } from './sadiShamela';

// see docs/plans/sadi-tafsir.md
const VERSION = '2026-08-10';
const URL = 'https://quranpedia.net/dumps/tafsir-book-3.json.gz';
const OUT = join(__dirname, '../../shared/data/quran/tafsirSadi.json');

const dumpPath = join(tmpdir(), `quranpedia-sadi-${VERSION}.json`);
if (!existsSync(dumpPath)) execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${dumpPath}"`]);
const dump = JSON.parse(readFileSync(dumpPath, 'utf8')) as {
  license: { version: string };
  book: { id: number; name: string; edition: string; nasher: string; mohaqeq: string };
  ayahs: { surah: number; ayah: number; content: { text: string; part: string; page: number | null }[] }[];
};
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);
if (dump.book.id !== 3) throw new Error('expected book 3, al-Sa\'di');

const MARKER = /[{﴿]\s*([٠-٩]+)((?:\s*[-–،,]\s*[٠-٩]+)*)\s*[}﴾]/g;
const latin = (arabic: string) => Number([...arabic].map(c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).join(''));

const pieces = new Map<string, { page: number; owner: number; text: string }>();
for (const row of dump.ayahs) {
  for (const c of row.content) {
    const page = c.page;
    if (page === null || page < FIRST_PAGE || page > LAST_PAGE) continue;
    const owner = row.surah * 1000 + row.ayah;
    const id = `${page}|${c.text}`;
    const known = pieces.get(id);
    if (!known || owner < known.owner) pieces.set(id, { page, owner, text: c.text });
  }
}
const book = [...pieces.values()].sort((a, b) => a.page - b.page || a.owner - b.owner);

type Passage = { surah: number; from: number; to: number; pages: [number, number]; parts: string[] };
const passages: Passage[] = [];
const gaps: number[] = [];
let surah = 0;
let lastPage = FIRST_PAGE;
for (const piece of book) {
  const text = cleanPiece(piece.text);
  if (!text) continue;
  const open = passages[passages.length - 1];
  if (open && piece.page > lastPage + 1) { open.parts.push('[…]'); gaps.push(...Array.from({ length: piece.page - lastPage - 1 }, (_, i) => lastPage + 1 + i)); }
  lastPage = piece.page;
  let at = 0;
  for (const m of text.matchAll(MARKER)) {
    const numbers = [m[1], ...m[2].split(/[-–،,]/).map(n => n.trim()).filter(Boolean)].map(latin);
    const from = Math.min(...numbers);
    const to = Math.max(...numbers);
    const previous = passages[passages.length - 1];
    const before = text.slice(at, m.index).trim();
    at = m.index + m[0].length;
    const opensSurah = !previous || from < previous.from || (from === 1 && /^\s*﴿بسم الله/.test(text.slice(m.index + m[0].length).replace(/[\u064B-\u0652]/g, '')));
    if (before && !(opensSurah && before.length < 80 && /مكية|مدنية|تفسير سورة/.test(before))) previous?.parts.push(before);
    if (opensSurah) surah++;
    passages.push({ surah, from, to, pages: [piece.page, piece.page], parts: [] });
  }
  const rest = text.slice(at).trim();
  const current = passages[passages.length - 1];
  if (rest && current) { current.parts.push(rest); current.pages[1] = piece.page; }
}
if (surah !== 114) throw new Error(`found ${surah} surahs, expected 114`);

const counts = JSON.parse(readFileSync(join(__dirname, '../../shared/data/quran/surahs.json'), 'utf8')) as { number: number; numberOfAyat: number }[];
const SPLIT_EXPLAINED = ['2:219', '4:77', '18:32', '30:11', '38:16', '38:48'];
const SPLIT_QUOTED_ONLY = ['4:29', '9:79', '9:86', '10:94', '10:104', '13:8', '18:37', '72:1', '83:18'];
passages.forEach((p, i) => {
  const next = passages[i + 1];
  const touches = next?.surah === p.surah && p.to === next.from && next.from > p.from;
  const key = `${p.surah}:${p.from}`;
  if (touches && !SPLIT_EXPLAINED.includes(key) && !SPLIT_QUOTED_ONLY.includes(key)) throw new Error(`${key}-${p.to} ends on the ayah the next passage starts on: read it and add it to SPLIT_EXPLAINED or SPLIT_QUOTED_ONLY`);
  const shares = touches && SPLIT_EXPLAINED.includes(key);
  p.to = next?.surah === p.surah ? (shares ? p.to : Math.max(p.from, next.from - 1)) : Math.max(p.to, counts.find(c => c.number === p.surah)!.numberOfAyat);
});
const problems: string[] = [];
for (const { number, numberOfAyat } of counts) {
  const seen = new Array<number>(numberOfAyat + 1).fill(0);
  for (const p of passages.filter(p => p.surah === number)) for (let a = p.from; a <= p.to; a++) seen[a]++;
  const own = passages.filter(p => p.surah === number);
  for (let a = 1; a <= numberOfAyat; a++) if (seen[a] !== 1 && !(seen[a] === 2 && own.some((p, i) => p.to === a && own[i + 1]?.from === a))) problems.push(`${number}:${a} in ${seen[a]} passages`);
  if (seen.length > numberOfAyat + 1) problems.push(`${number}: range past the end`);
}
if (problems.length) throw new Error(`passages do not tile the surahs:\n${problems.join('\n')}`);

const tidy = (text: string) => text.replace(/^[.\s]+/, '').replace(/(?:^|\n|\s)المجلد \S+ من [\s\S]*$/, '').replace(/\s*سورة [^\n]{1,30}\n(?:\[?وهي\]? ?)?(?:مكية|مدنية)[^\n]{0,20}$/, '');

const shamela = indexShamela(loadShamela());
const texts = passages.map(p => tidy(joinPieces(p.parts)));
const fills: string[] = [];
const filledTexts = texts.map((text, i) => {
  const { text: whole, filled, left, lastPage } = fillGaps(text, shamela);
  const p = passages[i];
  p.pages[1] = Math.max(p.pages[1], lastPage);
  for (const f of filled) fills.push(`${p.surah}:${p.from}-${p.to} +${f.length} chars: …${f.slice(-60).replace(/\n/g, ' ')}`);
  if (left) fills.push(`${p.surah}:${p.from}-${p.to} ${left} gap(s) not found in Shamela`);
  return tidy(whole);
});

const short = audit(filledTexts, shamela).filter(({ from, to }) => !/المجلد \S+ من/.test(shamela.text.slice(from, to))).map(({ index, missing, where, from, to }) =>
  `${passages[index].surah}:${passages[index].from}-${passages[index].to} lacks ~${missing} letters ${where}: «${shamela.text.slice(from, to).replace(/\s+/g, ' ')}»`);

writeFileSync(OUT, `${JSON.stringify({
  source: { version: dump.license.version, edition: dump.book.edition, publisher: dump.book.nasher, editor: dump.book.mohaqeq },
  passages: passages.map((p, i) => [p.surah, p.from, p.to, p.pages[0], p.pages[1], filledTexts[i]]),
})}\n`);
console.log(`Wrote ${passages.length} passages; dump pages missing as pieces: ${gaps.join(', ')}`);
console.log(`Filled from Shamela:\n${fills.join('\n')}`);
console.log(`Still short against Shamela:\n${short.join('\n') || 'none'}`);
