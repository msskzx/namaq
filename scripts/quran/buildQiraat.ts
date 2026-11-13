import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import type { MushafPage } from '../../shared/quran/readerPage';
import { farshGroups, sameForm, type DumpReading } from './qiraatFarsh';

// docs/plans/quran-qiraat.md: the word differences (farsh) of the ten readers per ayah, from Quranpedia's qira'at dump,
// anchored to the words of the bundled Hafs mushaf. Writes shared/data/quran/qiraat.json and a review list.
const VERSION = '2026-11-07';
const URL = 'https://quranpedia.net/dumps/qiraat.json.gz';
const DATA = join(__dirname, '../../shared/data/quran');
const OUT = join(DATA, 'qiraat.json');
const REVIEW = process.argv[2] ?? join(tmpdir(), 'qiraat-review.md');

const dumpPath = join(tmpdir(), `quranpedia-qiraat-${VERSION}.json`);
if (!existsSync(dumpPath)) {
  execFileSync('sh', ['-c', `curl -sSf "${URL}" | gunzip > "${dumpPath}"`]);
}
type DumpWord = { ayah_word: string; qiraat: { qiraa_text: string; rewayat: { rawi: { id: number } }[] }[] };
const dump = JSON.parse(readFileSync(dumpPath, 'utf8')) as { license: { version: string }; data: { surah: number; ayah: number; qiraat: DumpWord[] }[] };
if (dump.license.version !== VERSION) throw new Error(`dump version ${dump.license.version}, expected ${VERSION}`);

const hafs = new Map<string, string[]>();
let surah = 0;
let words: string[] = [];
for (let n = 1; n <= 604; n++) {
  const page = JSON.parse(readFileSync(join(DATA, 'mushaf', `${n}.json`), 'utf8')) as MushafPage;
  for (const item of page.items) {
    if ('surah' in item) { surah = item.surah; words = []; }
    if (!('line' in item)) continue;
    for (const token of item.line) {
      if (typeof token === 'number') { hafs.set(`${surah}:${token}`, words); words = []; } else words.push(token);
    }
  }
}

// Two spellings of the letters: strict keeps long vowels (so يخدعون is not taken for يخادعون), loose drops them,
// so the dump's spelling (يا أبت، تتوفاهم) still meets the mushaf's (يَٰٓأَبَتِ، تَتَوَفَّىٰهُمُ).
const strict = (word: string) => word.normalize('NFC').replace(/\u0670/g, 'ا').replace(/[^ء-غف-ي]/g, '')
  .replace(/[أإآٱءؤئ]/g, '').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const loose = (word: string) => strict(word).replace(/[اوي]/g, '');

/**
 * Where the dump's words sit in the Hafs ayah it names, or in a neighbour (the dump files some words one or two ayat off).
 * A phrase that runs into the next ayah (the Susi merging «الرحيم مالك») belongs to the ayah where it ends.
 */
function anchor(s: number, a: number, phrase: string): { key: string; at: [number, number]; text: string } | null {
  for (const skeleton of [strict, loose]) {
    const joined = phrase.split(/\s+/).map(skeleton).join('');
    if (!joined) return null;
    for (const delta of [0, 1, -1, 2, -2, 3, -3]) {
      const n = a + delta;
      const own = hafs.get(`${s}:${n}`);
      if (!own) continue;
      const words = [...own, ...(hafs.get(`${s}:${n + 1}`) ?? [])];
      const letters = words.map(skeleton);
      for (let i = 0; i < own.length; i++) {
        let text = '';
        for (let j = i; j < words.length && text.length < joined.length; j++) {
          text += letters[j];
          if (text !== joined) continue;
          const span = words.slice(i, j + 1).join(' ');
          return j < own.length ? { key: `${s}:${n}`, at: [i, j], text: span } : { key: `${s}:${n + 1}`, at: [0, j - own.length], text: span };
        }
      }
    }
  }
  return null;
}

// The King Fahd Complex texts of seven riwayat (fawazahmed0/quran-api, public domain) settle where the dump disagrees.
const KFGQPC: Record<number, string> = { 1: 'quranqaloon', 2: 'quranwarsh', 3: 'quranbazzi', 4: 'quranqumbul', 5: 'qurandoori', 6: 'quransoosi', 9: 'quranshouba' };
function edition(name: string): Map<string, string[]> {
  const file = join(tmpdir(), `kfgqpc-${name}.json`);
  if (!existsSync(file)) execFileSync('curl', ['-sSfL', '-o', file, `https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/ara-${name}.min.json`]);
  const rows = (JSON.parse(readFileSync(file, 'utf8')) as { quran: { chapter: number; verse: number; text: string }[] }).quran;
  // These texts put a space between open tanween and its alif (هُدࣰ ى); join them back.
  return new Map(rows.map(r => [`${r.chapter}:${r.verse}`, r.text.replace(/([\u064B-\u064D\u08F0-\u08F2]\u0651?)\s+(?=[اى])/g, '$1').split(/\s+/)]));
}
const official = new Map(Object.entries(KFGQPC).map(([rawi, name]) => [Number(rawi), edition(name)]));
const occurs = (words: string[], form: string) => {
  const n = form.split(/\s+/).length;
  return words.some((_, i) => sameForm(words.slice(i, i + n).join(' '), form));
};

type Out = { at: [number, number]; readings: { text: string; rawis: number[] }[] };
const ayat: Record<string, Out[]> = {};
const review: string[] = [];
let positions = 0;
for (const entry of dump.data) {
  for (const word of entry.qiraat) {
    positions++;
    const readings: DumpReading[] = word.qiraat.map(q => ({ text: q.qiraa_text, rawis: q.rewayat.map(r => r.rawi.id) }));
    const result = farshGroups(readings);
    if (result.kind === 'usul') continue;
    const place = anchor(entry.surah, entry.ayah, word.ayah_word);
    const where = `${entry.surah}:${entry.ayah} «${word.ayah_word}»`;
    if (!place) { review.push(`- ${where}: not found in the Hafs text near this ayah, left out`); continue; }
    if (result.kind === 'unclear') { review.push(`- ${where}: ${result.reason}, left out`); continue; }
    const hafsGroup = result.groups.findIndex(g => g.rawis.includes(10));
    if (hafsGroup < 0) { review.push(`- ${where}: no reading names Hafs, left out`); continue; }
    const hafsText = place.text;
    let groups = [{ ...result.groups[hafsGroup], text: hafsText }, ...result.groups.filter((_, i) => i !== hafsGroup)];
    for (const [rawi, text] of official) {
      const words = text.get(place.key);
      const own = groups.find(g => g.rawis.includes(rawi));
      if (!words || !own) continue;
      // Only a riwaya the dump sets apart alone, and only back to Hafs. The official texts mark some readings in ways a
      // letter comparison cannot see (Qunbul's سراط by a small sin, tashil by a dot, Ibn Kathir's doubled ta), so they
      // never move a group, nor al-Bazzi or Qunbul.
      const hits = groups.filter(g => occurs(words, g.text));
      if (rawi === 3 || rawi === 4 || own.rawis.length !== 1 || hits.includes(own) || hits.length !== 1 || hits[0] !== groups[0]) continue;
      own.rawis = own.rawis.filter(r => r !== rawi);
      hits[0].rawis = [...new Set([...hits[0].rawis, rawi])].sort((a, b) => a - b);
      review.push(`- ${place.key} «${hafsText}»: ${KFGQPC[rawi].replace('quran', '')} moved from «${own.text}» to «${hits[0].text}» by the King Fahd text`);
    }
    groups = groups.filter(g => g.rawis.length);
    if (groups.length < 2) continue;
    // A riwaya may read a word two ways (Ibn Dhakwan's إبراهيم and إبراهام), but a reading named for all twenty means
    // the other is a neighbouring word or a pronunciation note the dump filed here (7:6 «عليهم» under إليهم).
    if (groups.some(g => g.rawis.length === 20)) { review.push(`- ${place.key} «${hafsText}»: one reading names all twenty riwayat, left out`); continue; }
    const named = new Set(groups.flatMap(g => g.rawis));
    if (named.size < 20) review.push(`- ${place.key} «${hafsText}»: riwayat ${Array.from({ length: 20 }, (_, i) => i + 1).filter(r => !named.has(r)).join(', ')} not named`);
    if (place.key !== `${entry.surah}:${entry.ayah}`) review.push(`- ${where}: moved to ${place.key}`);
    (ayat[place.key] ??= []).push({
      at: place.at,
      readings: groups.map(g => ({ text: g.text, rawis: g.rawis })),
    });
  }
}

// The dump lists a few words twice; the same readings once is kept, different readings (4:11) are left out.
for (const [key, list] of Object.entries(ayat)) {
  const same = (a: Out, b: Out) => a.at[0] === b.at[0] && a.at[1] === b.at[1];
  const unique = list.filter((w, i) => !list.slice(0, i).some(p => same(p, w) && JSON.stringify(p.readings) === JSON.stringify(w.readings)));
  const clash = unique.filter(w => unique.some(o => o !== w && same(o, w)));
  for (const w of clash) review.push(`- ${key} «${w.readings[0].text}»: listed twice with different readings, left out`);
  ayat[key] = unique.filter(w => !clash.includes(w));
  if (!ayat[key].length) delete ayat[key];
}

const order = (key: string) => key.split(':').map(Number);
const sorted = Object.fromEntries(Object.entries(ayat)
  .sort(([a], [b]) => order(a)[0] - order(b)[0] || order(a)[1] - order(b)[1])
  .map(([key, list]) => [key, list.sort((x, y) => x.at[0] - y.at[0])]));
const count = Object.values(sorted).reduce((n, list) => n + list.length, 0);
writeFileSync(OUT, `${JSON.stringify({
  source: { name: 'الموسوعة القرآنية', url: 'https://quranpedia.net', dump: URL, version: VERSION },
  ayat: sorted,
})}\n`);
writeFileSync(REVIEW, `# Qira'at build: entries to review\n\nDump ${VERSION}: ${positions} word positions, ${count} word differences kept in ${Object.keys(sorted).length} ayat.\n\n${review.join('\n')}\n`);
console.log(`positions ${positions}, kept ${count} in ${Object.keys(sorted).length} ayat, review ${review.length} -> ${REVIEW}`);
