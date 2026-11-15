import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// docs/plans/sadi-tafsir.md: Shamela's copy of the same edition of al-Sa'di (book 42, al-Risala 2000, ed. al-Luwayhiq,
// "ترقيم الكتاب موافق للمطبوع"), read from turath.io's export of it. Quranpedia's dump cuts some passages short where a
// page piece breaks off (3:96–97 stops mid-word in a poem); Shamela has them whole, so the build takes the missing words
// from here and nothing else.
export const SHAMELA_BOOK = 42;
const URL = `https://files.turath.io/books-v3/${SHAMELA_BOOK}.json`;
/** The export the fills were checked against (fetched 2026-11-15); a different file stops the build. */
export const SHAMELA_SHA256 = 'c63a752640a91b2d597d0e6173a2ecf8f2fb0142406bdd11def584df2b3c302b';

export function loadShamela(): string {
  const path = join(tmpdir(), `turath-${SHAMELA_BOOK}-${SHAMELA_SHA256.slice(0, 12)}.json`);
  if (!existsSync(path)) execFileSync('curl', ['-sSf', '-o', path, URL]);
  const raw = readFileSync(path);
  const sha = createHash('sha256').update(raw).digest('hex');
  if (sha !== SHAMELA_SHA256) throw new Error(`turath book ${SHAMELA_BOOK} changed (sha256 ${sha}); check the fills again`);
  const book = JSON.parse(raw.toString('utf8')) as { pages: { text: string; page: number }[] };
  // The editor's footnotes follow a rule line on each page; they, the marks pointing to them and the HTML go. The
  // printed page numbers (⦗١٣٩⦘) stay: a fill reads its last page from them, then drops them. Poems are set
  // "first half ... second half", which Quranpedia's text sets with "…".
  return book.pages.map(p => p.text.split('_________')[0]).join('\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/[  ]*\([٠-٩]+\)/g, '')
    .replace(/ \.\.\. /g, ' … ')
    .replace(/ +([.,،:])/g, '$1')
    .replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n');
}

// Shamela writes the blessings as one sign ("ﷺ"), Quranpedia mostly spells them out; both read the same here.
const SIGNS: Record<string, string> = {
  'ﷺ': 'صلى الله عليه وسلم', '﵇': 'عليه السلام', '﵊': 'عليه الصلاة والسلام', '﵀': 'رحمه الله', '﵁': 'رضي الله عنه',
  '﵂': 'رضي الله عنها', '﵃': 'رضي الله عنهم', '﵄': 'رضي الله عنهما', '﷿': 'عز وجل', 'ﷻ': 'جل جلاله', '﵎': 'تبارك وتعالى',
};

/** Letters only, without tashkeel or hamza seats, so the two copies' punctuation and spelling quirks don't matter. */
function letters(text: string): { norm: string; at: number[] } {
  let norm = '';
  const at: number[] = [];
  let i = 0;
  for (const c of text) {
    for (let ch of SIGNS[c] ?? c) {
      if (/[\u064B-\u0652\u0670\u0640]/.test(ch)) continue;
      if (/[أإآٱ]/.test(ch)) ch = 'ا';
      else if (ch === 'ى') ch = 'ي';
      else if (ch === 'ة') ch = 'ه';
      if (!/[\u0621-\u064A]/.test(ch)) continue;
      norm += ch;
      at.push(i);
    }
    i += c.length;
  }
  return { norm, at };
}

const ANCHOR = 40;
// The book's range markers ("﴿٩٨ - ١٠١﴾") open the next passage; a fill never runs past one.
const MARKER = /[{﴿]\s*[٠-٩]+(?:\s*[-–،,]\s*[٠-٩]+)*\s*[}﴾]/;

export type Shamela = { text: string; norm: string; at: number[] };
export const indexShamela = (text: string): Shamela => ({ text, ...letters(text) });

/**
 * Fills each "[…]" in a passage with the words Shamela has between the text before it and the text after it (or the
 * next range marker, at the end of the passage). A gap whose edges can't be found stays "[…]", and is returned.
 */
export function fillGaps(passage: string, book: Shamela): { text: string; filled: string[]; left: number; lastPage: number } {
  const parts = passage.split(/\s*\[…\]\s*/);
  let lastPage = 0;
  if (parts.length === 1) return { text: passage, filled: [], left: 0, lastPage };
  const filled: string[] = [];
  let left = 0;
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) {
    // A piece can break mid-word ("الطواف ت"); the word comes back whole from Shamela.
    out = out.replace(/\s\S*[\u0621-\u064A]$/, '');
    const before = letters(out).norm.slice(-ANCHOR);
    const after = letters(parts[i]).norm.slice(0, ANCHOR);
    const start = before.length === ANCHOR ? book.norm.indexOf(before) : -1;
    // The anchor must be the only place the text before the gap occurs, or the fill could come from the wrong passage.
    const unique = start >= 0 && book.norm.indexOf(before, start + 1) < 0;
    let fill: string | null = null;
    let from = 0;
    if (unique) {
      from = book.at[start + ANCHOR - 1] + 1;
      let to: number;
      if (after) {
        const end = book.norm.indexOf(after, start + ANCHOR);
        to = end >= 0 && end - start < 20000 ? book.at[end] : -1;
      } else {
        const m = MARKER.exec(book.text.slice(from, from + 20000));
        to = m ? from + m.index : -1;
      }
      if (to >= from) fill = book.text.slice(from, to);
    }
    // What the text before the gap already ends with after its last letter (a full stop) is not taken twice.
    const trail = out.match(/[^\u0621-\u064A\u064B-\u0652]*$/)![0].trim();
    if (fill !== null && trail && fill.trimStart().startsWith(trail)) fill = fill.trimStart().slice(trail.length);
    if (fill === null) { out += ` […] ${parts[i]}`; left++; continue; }
    // At the passage's end, the next surah's heading ("تفسير سورة …") and the volume title stay out, as in the build.
    // the copyist's colophon after al-Fath ("[… بقلم الفقير إلى ربه سليمان بن حمد البسام …]") is not al-Sa'di's, and stray
    // marks with no words are dropped.
    if (!after) {
      fill = fill.replace(/\n(?:تفسير سورة|المجلد )[\s\S]*$/, '').replace(/\n\[[^\]]*بقلم[^\]]*\][\s.]*$/, '').trimEnd();
      if (!/[\u0621-\u064A]/.test(fill)) fill = '';
    }
    // The marks the text after the gap opens with ("﴿") are already in it.
    const lead = parts[i].match(/^[^\u0621-\u064A]*/)![0].trim();
    // The break or space Shamela has before the text after the gap (a paragraph break before a new quote).
    let body = fill.trimEnd();
    let space = fill.slice(body.length);
    if (lead && body.endsWith(lead)) { body = body.slice(0, -lead.length); space = body.match(/\s*$/)![0]; body = body.trimEnd(); }
    fill = body;
    // The printed page the fill's last word is on: the last page number before it.
    const end = book.text.lastIndexOf('⦗', from + fill.trimEnd().length);
    const page = /^⦗([٠-٩]+)⦘/.exec(book.text.slice(end));
    if (page) lastPage = Math.max(lastPage, Number([...page[1]].map(c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)).join('')));
    fill = fill.replace(/⦗[٠-٩]+⦘\s*/g, '');
    filled.push(fill.trim());
    out += fill.trimEnd() + (after ? (space ? space[0] : '') : '') + parts[i];
  }
  return { text: out, filled, left, lastPage };
}

/**
 * Where a passage lacks words Shamela has, for the audit the build prints: it walks the passage in 60-letter chunks and
 * reports each jump forward in Shamela of more than 40 letters (a few letters are the two copies' editing), and what
 * Shamela has between the passage's end and the next passage's start.
 */
export function audit(passages: string[], book: Shamela): { index: number; missing: number; where: string; from: number; to: number }[] {
  const found: { index: number; missing: number; where: string; from: number; to: number }[] = [];
  let cursor = 0;
  const CHUNK = 60;
  passages.forEach((passage, index) => {
    const own = letters(passage).norm;
    const prev = index ? letters(passages[index - 1]).norm : '';
    const offsets = [...Array.from({ length: Math.ceil(own.length / 300) }, (_, k) => k * 300), Math.max(0, own.length - CHUNK)];
    let base: { at: number; pos: number } | null = null;
    for (const at of offsets) {
      const pos = book.norm.indexOf(own.slice(at, at + CHUNK), cursor);
      const expectedAt = base ? base.pos + (at - base.at) : -1;
      // A chunk can miss over one letter the two copies spell differently; the next chunk picks the walk up again.
      if (pos < 0 || (base && pos - expectedAt > 30000)) continue;
      // A jump only counts when the words skipped are not in the passage after all (a repeated phrase can match early).
      if (base && pos - expectedAt > 40 && ![own, prev].some(t => t.includes(book.norm.slice(expectedAt, pos).slice(0, 80))) && !own.includes(book.norm.slice(Math.max(expectedAt, pos - 80), pos))) found.push({ index, missing: pos - expectedAt, where: `before letter ${at}`, from: book.at[expectedAt], to: book.at[pos] });
      base = { at, pos };
      cursor = pos;
    }
    const expected = base ? base.pos + (own.length - base.at) : -1;
    const nextHead = passages[index + 1] && letters(passages[index + 1]).norm.slice(0, CHUNK);
    if (nextHead && expected >= 0) {
      const pos = book.norm.indexOf(nextHead, cursor);
      // A new surah's heading and basmala come between; anything longer is lost text.
      if (pos >= 0 && pos - expected > 150 && pos - expected < 30000) found.push({ index, missing: pos - expected, where: 'at the end', from: book.at[expected], to: book.at[pos] });
    }
  });
  return found;
}
