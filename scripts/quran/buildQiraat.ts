import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import corrections from './qiraatCorrections.json';
import type { MushafPage } from '../../shared/quran/readerPage';
import { farshGroups, sameForm, type DumpReading } from './qiraatFarsh';
import { madinaSpelling } from './madinaSpelling';
import { fullyVowelled, officialForm } from './qiraatVowels';
import handVowels from './qiraatVowels.json';

// docs/plans/quran-qiraat.md: the word differences (farsh) of the ten readers per ayah, from Quranpedia's qira'at dump,
// anchored to the words of the bundled Hafs mushaf. Writes shared/data/quran/qiraat.json and a review list.
const VERSION = '2026-11-14';
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
        if (!letters[i]) continue;
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
// The dump's own words on each reading (بضم الياء وفتح الكاف…), for vowelling by hand what it writes bare.
const described = new Map<string, string[]>();
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
    described.set(`${place.key}:${place.at[0]}`, word.qiraat.map(q => `${q.qiraa_text.trim()} (${q.rewayat.map(r => r.rawi.id).sort((x, y) => x - y).join(',')})`));
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

// docs/audits/qiraat-source-audit.md
// `at: null` adds a word the dump lacks, `replacement: null` drops one (a word filed under the next ayah is dropped there
// and added to its own).
for (const correction of corrections as { ayah: string; at: number | null; replacement: Out | null }[]) {
  const list = (ayat[correction.ayah] ??= []);
  if (correction.at === null) {
    if (!correction.replacement) throw new Error(`Correction ${correction.ayah} adds nothing`);
    const at = correction.replacement.at;
    if (list.some(word => word.at[0] <= at[1] && at[0] <= word.at[1])) throw new Error(`Added qira'at position ${correction.ayah}:${at[0]} already taken`);
    list.push(correction.replacement);
    continue;
  }
  const index = list.findIndex(word => word.at[0] === correction.at);
  if (index < 0) throw new Error(`Missing corrected qira'at position ${correction.ayah}:${correction.at}`);
  if (correction.replacement) list[index] = correction.replacement;
  else list.splice(index, 1);
  if (!list.length) delete ayat[correction.ayah];
}
for (const { ayah, replacement } of corrections as { ayah: string; replacement: Out | null }[]) {
  if (!replacement) continue;
  const [first, last] = replacement.at;
  if (replacement.readings[0].text !== hafs.get(ayah)?.slice(first, last + 1).join(' ')) throw new Error(`Corrected qira'at ${ayah}:${first} is not the Hafs text there`);
  const list = [...ayat[ayah]].sort((x, y) => x.at[0] - y.at[0]);
  if (list.some((w, i) => i && w.at[0] <= list[i - 1].at[1])) throw new Error(`Qira'at words overlap in ${ayah}`);
}

// Every reading other than the page's own gets its full tashkeel here (qiraatVowels.ts): from the King Fahd text of a
// riwaya in its group, or else from qiraatVowels.json, vowelled by hand and checked by a second reviewer.
const hand: Record<string, string> = handVowels;
// An alif never takes the sukun ۡ: a silent alif written ْ, as the page writes it, is read by madinaSpelling as a sukun.
// The page writes آ as an alif and its madda (ا + ٓ), never as the one letter آ.
const spell = (text: string) => madinaSpelling(text).replace(/ا\u06E1/g, 'ا\u0652').replace(/\u0622/g, 'ا\u0653');
const unvowelled: string[] = [];
const handUsed = new Set<string>();
let fromOfficial = 0;
for (const [key, list] of Object.entries(ayat)) {
  for (const word of list) {
    // Each reading is stored in the Madina page's spelling, the form the screens show.
    const spelled = word.readings.map(reading => ({ ...reading, text: spell(reading.text) }));
    word.readings = spelled.map((reading, i) => {
      if (!i) return reading;
      const id = `${key}:${word.at[0]}:${reading.text}`;
      if (hand[id]) handUsed.add(id);
      if (hand[id]?.startsWith('KEEP')) return reading;
      if (hand[id]) return { ...reading, text: spell(hand[id]) };
      if (fullyVowelled(reading.text)) return reading;
      const others = spelled.filter(r => r !== reading).map(r => r.text);
      const copy = officialForm(reading.text, reading.rawis, others, official, key, word.at[0]);
      if (copy) { fromOfficial++; return { ...reading, text: copy.text }; }
      unvowelled.push(JSON.stringify({ id, hafs: spelled[0].text, rawis: reading.rawis, dump: described.get(`${key}:${word.at[0]}`) ?? [] }));
      return reading;
    });
    // Once vowelled, a reading the dump set apart only by performance (naql, sakt, a softened hamza) reads as another:
    // its riwayat join that reading, and a word left with one reading is no difference at all.
    const merged: typeof word.readings = [];
    for (const reading of word.readings) {
      // Pause signs aside (ۖ ۗ ۚ…); the small sin ۜ of وَيَبۡصُۜطُ is part of the reading. Two readings one riwaya both reads
      // (Hafs's ضَعۡف and ضُعۡف at 30:54) stay apart.
      const bare = (text: string) => text.normalize('NFC').replace(/[\u06D6-\u06DB]/g, '');
      const same = merged.find(m => bare(m.text) === bare(reading.text) && !m.rawis.some(r => reading.rawis.includes(r)));
      if (!same) { merged.push(reading); continue; }
      same.rawis = [...new Set([...same.rawis, ...reading.rawis])].sort((a, b) => a - b);
      review.push(`- ${key} «${reading.text}»: the same as another reading once vowelled, merged`);
    }
    word.readings = merged;
  }
  ayat[key] = list.filter(word => word.readings.length > 1);
  if (!ayat[key].length) delete ayat[key];
}
console.log(`vowelled from the King Fahd texts ${fromOfficial}, by hand ${handUsed.size}, still unvowelled ${unvowelled.length}`);
writeFileSync(join(tmpdir(), 'qiraat-unvowelled.jsonl'), `${unvowelled.join('\n')}\n`);
const unused = Object.keys(hand).filter(id => !handUsed.has(id));
if (unused.length) throw new Error(`qiraatVowels.json entries that match no reading: ${unused.join(', ')}`);
if (unvowelled.length) throw new Error(`${unvowelled.length} readings not fully vowelled, listed in ${join(tmpdir(), 'qiraat-unvowelled.jsonl')}: vowel them in qiraatVowels.json`);

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
