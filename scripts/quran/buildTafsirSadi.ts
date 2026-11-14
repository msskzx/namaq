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

const dumpPath = join(tmpdir(), `quranpedia-sadi-${VERSION}.json`);
if (!existsSync(dumpPath)) execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${dumpPath}"`]);
const dump = JSON.parse(readFileSync(dumpPath, 'utf8')) as {
  license: { version: string };
  book: { id: number; name: string; edition: string; nasher: string; mohaqeq: string };
  ayahs: { surah: number; ayah: number; content: { text: string; part: string; page: number | null }[] }[];
};
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);
if (dump.book.id !== 3) throw new Error('expected book 3, al-Sa\'di');

// The dump gives each ayah the page pieces its passage touches; early on a piece is a whole page, later a page is cut
// at the passages. So the pieces are laid end to end in page order, the book read through once, and cut again at the
// book's own range markers ("{١ - ٧}", "﴿١٣، ١٤﴾"). A range that starts again at 1 opens the next surah.
const MARKER = /[{﴿]\s*([٠-٩]+)((?:\s*[-–،,]\s*[٠-٩]+)*)\s*[}﴾]/g;
const latin = (arabic: string) => Number([...arabic].map(c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).join(''));

const pieces = new Map<string, { page: number; owner: number; text: string }>();
for (const row of dump.ayahs) {
  for (const c of row.content) {
    // Al-Humaza's pieces have no page: they repeat, ayah by ayah, the passage page 934 already holds.
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
    // Ranges climb through a surah, sharing an ayah where al-Sa'di splits one; a range that starts lower, or
    // starts at 1 with the basmala, begins the next surah (al-Sharh and al-Tin are each one passage, 1–8).
    const opensSurah = !previous || from < previous.from || (from === 1 && /^\s*﴿بسم الله/.test(text.slice(m.index + m[0].length).replace(/[\u064B-\u0652]/g, '')));
    // What a new surah's first marker follows is its heading ("وهي مكية"), not the end of the surah before.
    if (before && !(opensSurah && before.length < 80 && /مكية|مدنية|تفسير سورة/.test(before))) previous?.parts.push(before);
    if (opensSurah) surah++;
    passages.push({ surah, from, to, pages: [piece.page, piece.page], parts: [] });
  }
  const rest = text.slice(at).trim();
  const current = passages[passages.length - 1];
  if (rest && current) { current.parts.push(rest); current.pages[1] = piece.page; }
}
if (surah !== 114) throw new Error(`found ${surah} surahs, expected 114`);

// Every ayah of every surah sits in a passage; two passages share an ayah only where one ends and the next begins.
const counts = JSON.parse(readFileSync(join(__dirname, '../../shared/data/quran/surahs.json'), 'utf8')) as { number: number; numberOfAyat: number }[];
// Al-Sa'di takes some ayat inside a passage without a marker of their own ("ثم قال: ﴿…﴾"): a passage runs to the ayah
// before the next marker, or to the end of its surah.
passages.forEach((p, i) => {
  const next = passages[i + 1];
  // A marker that starts inside the passage's own range cuts it there; they share an ayah only when the next starts on
  // the passage's first ayah (2:219: «{٢١٩}» then «{٢١٩ - ٢٢٠}»).
  p.to = next?.surah === p.surah ? Math.max(p.from, next.from - 1) : Math.max(p.to, counts.find(c => c.number === p.surah)!.numberOfAyat);
});
const problems: string[] = [];
for (const { number, numberOfAyat } of counts) {
  const seen = new Array<number>(numberOfAyat + 1).fill(0);
  for (const p of passages.filter(p => p.surah === number)) for (let a = p.from; a <= p.to; a++) seen[a]++;
  for (let a = 1; a <= numberOfAyat; a++) if (seen[a] !== 1 && !(seen[a] === 2 && passages.some(p => p.surah === number && p.from === a && p.to === a))) problems.push(`${number}:${a} in ${seen[a]} passages`);
  if (seen.length > numberOfAyat + 1) problems.push(`${number}: range past the end`);
}
if (problems.length) throw new Error(`passages do not tile the surahs:\n${problems.join('\n')}`);

// A full stop left over from the passage before, the title page of the next manuscript volume ("المجلد الثاني من تيسير
// الكريم …"), and one next-surah heading the cleaner can't see ("… سورة فصلت / مكية").
const tidy = (text: string) => text.replace(/^[.\s]+/, '').replace(/(?:^|\n|\s)المجلد \S+ من [\s\S]*$/, '').replace(/\s*سورة [^\n]{1,30}\n(?:\[?وهي\]? ?)?(?:مكية|مدنية)[^\n]{0,20}$/, '');

writeFileSync(OUT, `${JSON.stringify({
  source: { version: dump.license.version, edition: dump.book.edition, publisher: dump.book.nasher, editor: dump.book.mohaqeq },
  passages: passages.map(p => [p.surah, p.from, p.to, p.pages[0], p.pages[1], tidy(joinPieces(p.parts))]),
})}\n`);
console.log(`Wrote ${passages.length} passages; pages missing from the dump: ${gaps.join(', ')}`);
