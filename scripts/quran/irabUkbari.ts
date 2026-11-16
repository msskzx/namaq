// docs/plans/irab.md: al-'Ukbari's al-Tibyan fi I'rab al-Qur'an, from Quranpedia's dump (book 309), cut at the words he
// discusses. Like al-Sa'di's dump (docs/records/R0034), each ayah carries printed pages, so the book is laid end to end
// in page order and read through once.

/** [surah, ayah, first word, last word, page, text]; words count the corpus's words from 0, -1 for a passage on the whole ayah. */
export type UkbariEntry = [number, number, number, number, number, string];
type Dump = { book: { id: number }; ayahs: { surah: number; ayah: number; content: { text: string; page: number | null }[] }[] };

const MARKS = /[ً-ٰٟۖ-ۭـ࣓-ࣿ]/g;
const WEAK = /[اويىءئؤأإآٱ]/g;
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const latin = (digits: string) => Number([...digits].map(c => ARABIC_DIGITS.indexOf(c)).join(''));

/** A word's consonants: no vowel marks, no alif, waw, ya or hamza seats, so the book's spelling meets the mushaf's rasm. */
export const skeleton = (word: string) => word.replace(MARKS, '').replace(/ة/g, 'ه').replace(WEAK, '');

// One side may carry a prefix the other leaves out: «رَءُوفٌ» for «لَرَءُوفࣱ», «الْأَزْلَامُ» for «بِٱلۡأَزۡلَٰمِ».
const PREFIX = /^[فلبك]/;
export const same = (a: string, b: string) => a === b || (a.length > 1 && b.length > 1 && ((PREFIX.test(a) && a.slice(1) === b) || (PREFIX.test(b) && b.slice(1) === a)));

/** Where a heading's words («كُفُوًا أَحَدٌ») run in an ayah's mushaf words: [first, last] from 0, or null. */
export function matchHeading(words: string[], heading: string): [number, number] | null {
  const wanted = heading.replace(/\([٠-٩]+\)/g, ' ').replace(/[^ء-ۭ࣓-ࣿ\s]/g, ' ').split(/\s+/).map(skeleton).filter(Boolean);
  if (!wanted.length) return null;
  const have = words.map(skeleton);
  for (let i = 0; i + wanted.length <= have.length; i++) {
    if (wanted.every((token, j) => same(token, have[i + j]))) return [i, i + wanted.length - 1];
  }
  return null;
}

/** The text inside the parenthesis that opens at `open`, nested ones included, and where it closes. */
function enclosed(text: string, open: number): { inner: string; end: number } | null {
  let depth = 0;
  for (let i = open; i < text.length && i < open + 1500; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')' && --depth === 0) return { inner: text.slice(open + 1, i), end: i + 1 };
    else if (text[i] === '\n' && depth > 0 && i - open > 400) return null;
  }
  return null;
}

export const clean = (html: string) => html.replace(/<br\s*\/?>/g, '\n').replace(/<\/?p[^>]*>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n');

const SURAH = /(?:^|\n)\s*سُورَةُ [^\n]*/y;
const QUOTE = /قَالَ\s+(?:اللَّهُ\s+)?(?:تَعَالَى|عَزَّ\s+وَجَلَّ)\s*:?\s*(?=\()/y;
const HEAD = /قَوْلُهُ\s+(?:تَعَالَى|عَزَّ\s+وَجَلَّ|جَلَّ\s+وَعَزَّ|سُبْحَانَهُ(?:\s+وَتَعَالَى)?)\s*:?\s*(?=\()/y;
const SUB = /\n\s*(?=\()/y;
const AND = /وَ\s*(?=\()/y;
const REFERENCE = /^\s*\[[^\]:]+:\s*([٠-٩]+)\]/;

/**
 * Reads the book once and cuts it into passages: each «قوله تعالى: (…)» heading, and each line that opens on a
 * parenthesis followed by a colon, starts a passage on the words it names, found in the ayat of the last «قال تعالى»
 * quote. A heading that names no word there stays a passage on the quoted ayah; a line that names none stays part of
 * the passage before.
 */
export function readUkbari(dump: Dump, match: (key: string, heading: string) => [number, number] | null) {
  if (dump.book.id !== 309) throw new Error('expected book 309, al-Ukbari');
  const pieces = new Map<string, { page: number; owner: number; text: string }>();
  for (const row of dump.ayahs) {
    for (const c of row.content) {
      if (c.page === null) continue;
      const id = `${c.page}|${c.text}`;
      const owner = row.surah * 1000 + row.ayah;
      const known = pieces.get(id);
      if (!known || owner < known.owner) pieces.set(id, { page: c.page, owner, text: c.text });
    }
  }
  const ordered = [...pieces.values()].sort((a, b) => a.page - b.page || a.owner - b.owner);
  let text = '';
  const starts: { at: number; page: number }[] = [];
  for (const piece of ordered) { starts.push({ at: text.length, page: piece.page }); text += `${clean(piece.text)}\n`; }
  const pageAt = (at: number) => { let page = starts[0].page; for (const s of starts) { if (s.at > at) break; page = s.page; } return page; };

  const entries: UkbariEntry[] = [];
  let open: { surah: number; ayah: number; from: number; to: number; start: number; heading?: [number, number] } | null = null;
  const close = (at: number) => {
    if (!open) return;
    let body = text.slice(open.start, at);
    if (open.heading) body = `${body.slice(0, open.heading[0] - open.start)}﴿${body.slice(open.heading[0] - open.start + 1, open.heading[1] - open.start - 1)}﴾${body.slice(open.heading[1] - open.start)}`;
    body = body.replace(/\n{2,}/g, '\n').trim().replace(/^[.،:\s]+/, '');
    // The editor's front matter comes before the first surah's heading.
    if (open.surah > 0 && /[ء-ي]/.test(body.replace(/\([٠-٩]+\)/g, ''))) entries.push([open.surah, open.ayah, open.from, open.to, pageAt(open.start), body]);
    open = null;
  };
  let surah = 0;
  let quoted: number[] = [1];
  let unplaced = 0;
  // The ayah of the last passage found near its quote: the book runs in mushaf order.
  let last = 0;
  const find = (heading: string, around: number[]): { ayah: number; at: [number, number]; near?: boolean } | null => {
    const near = [...around];
    for (let d = 1; d <= 3; d++) near.push(Math.max(...around) + d, Math.min(...around) - d);
    for (const ayah of near) {
      if (ayah < 1) continue;
      const at = match(`${surah}:${ayah}`, heading);
      if (at) return { ayah, at, near: true };
    }
    // A quote's number the dump misprints («(٣١٦)» in al-Baqara for 216) leaves the heading far from its ayah: it is
    // looked for in the next ayat of the surah and taken only where it occurs once there.
    const everywhere: { ayah: number; at: [number, number] }[] = [];
    for (let ayah = Math.max(1, last); ayah <= last + 20; ayah++) {
      const at = match(`${surah}:${ayah}`, heading);
      if (at) everywhere.push({ ayah, at });
    }
    return everywhere.length === 1 ? everywhere[0] : null;
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c !== '\n' && c !== 'ق' && c !== 'و') continue;
    SURAH.lastIndex = i;
    const head = SURAH.exec(text);
    if (head) { close(i); surah++; quoted = [1]; last = 0; i = SURAH.lastIndex - 1; continue; }
    QUOTE.lastIndex = i;
    if (QUOTE.exec(text)) {
      const paren = enclosed(text, QUOTE.lastIndex);
      if (!paren) continue;
      close(i);
      const numbers = [...paren.inner.matchAll(/\(([٠-٩]+)\)/g)].map(m => latin(m[1]));
      // Some quotes put the ayah number after the closing parenthesis: «(… لَا يَسْتَكْبِرُونَ) (٨٢).»
      const after = /^\s*\(?\(([٠-٩]+)\)\)?\.?/.exec(text.slice(paren.end, paren.end + 14));
      if (after) numbers.push(latin(after[1]));
      const end = paren.end + (after ? after[0].length : 0);
      quoted = numbers.length ? numbers : [quoted[quoted.length - 1] + 1];
      open = { surah, ayah: quoted[0], from: -1, to: -1, start: end };
      i = end - 1;
      continue;
    }
    for (const marker of [HEAD, SUB, AND]) {
      if (marker === AND && !/[.،:\n]\s*$/.test(text.slice(Math.max(0, i - 3), i))) continue;
      marker.lastIndex = i;
      if (!marker.exec(text)) continue;
      const parenAt = marker.lastIndex;
      const paren = enclosed(text, parenAt);
      if (!paren) break;
      const named = marker !== HEAD;
      if (named && !/^\s*:/.test(text.slice(paren.end, paren.end + 4))) break;
      const numbers = [...paren.inner.matchAll(/\(([٠-٩]+)\)/g)].map(m => latin(m[1]));
      const reference = REFERENCE.exec(text.slice(paren.end, paren.end + 40));
      // A quote behind the passages already found is a misprinted number; the last found ayah stands in for it.
      const around = numbers.length ? numbers : reference ? [latin(reference[1])] : Math.max(...quoted) < last ? [last] : quoted;
      const found = find(paren.inner, around);
      // A heading the ayat around do not hold is a line about another place («[الْأَنْعَامِ: ١٥٣]») or a spelling the
      // rasm hides; a heading with a reference, and any other line, stays in the passage before.
      if (!found && (named || reference)) { unplaced++; break; }
      const start = marker === SUB ? i + 1 : i;
      close(start);
      if (numbers.length) quoted = numbers;
      if (found?.near && !reference) last = found.ayah;
      open = found
        ? { surah, ayah: found.ayah, from: found.at[0], to: found.at[1], start, heading: [parenAt, paren.end] }
        : { surah, ayah: numbers.length || reference ? around[0] : Math.max(around[0], last), from: -1, to: -1, start, heading: [parenAt, paren.end] };
      i = paren.end - 1;
      break;
    }
  }
  close(text.length);
  if (surah !== 114) throw new Error(`read ${surah} surah headings, expected 114`);
  return { entries, unplaced };
}
