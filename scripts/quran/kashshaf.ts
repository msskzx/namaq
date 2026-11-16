// docs/plans/balagha.md: al-Zamakhshari's al-Kashshaf, from Quranpedia's dump (book 346), cut into his passages, with the
// sentences where he names a device of balagha lit. Like al-Sa'di's dump (docs/records/R0034), each ayah carries
// printed pages, so the book is laid end to end in page order and cut at its own «[سورة … : آية …]» headings.
import { matchHeading, skeleton } from './irabUkbari';
import { BALAGHA_DEVICES, type KashshafEntry, type KashshafLit } from '../../shared/quran/kashshaf';

type Piece = { text: string; part: string; page: number | null };
export type Dump = { book: { id: number }; ayahs: { surah: number; ayah: number; content: Piece[] }[] };

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const latin = (digits: string) => Number([...digits].map(c => ARABIC_DIGITS.indexOf(c)).join(''));
const arabic = (n: number) => String(n).replace(/\d/g, d => ARABIC_DIGITS[Number(d)]);
const POEM_GAP = '  ';

/**
 * One printed page as plain text. The footnotes are the edition's marginal works (Ibn al-Munayyir's al-Intisaf,
 * Ibn Hajar's takhrij and others), not al-Zamakhshari, so they go, with their «١» marks in his text. A verse of
 * poetry becomes its own line, its two halves apart.
 */
export function cleanPage(html: string): string {
  return html
    .replace(/<div class="foot-notes">[\s\S]*?<\/div>/g, '')
    .replace(/<table class='poem'>([\s\S]*?)<\/table>/g, (_, rows: string) =>
      `\n${[...rows.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row => [...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(cell => cell[1].trim()).join(POEM_GAP)).join('\n')}\n`)
    .replace(/<br\s*\/?>|<\/?p[^>]*>|<\/?h3>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s*«[٠-٩]+»/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n');
}

const HEADING = /\[سورة [^(\]]+\(([٠-٩]+)\) : (?:آية ([٠-٩]+)|الآيات ([٠-٩]+) الى ([٠-٩]+))\]/g;
// A line that only opens a volume or names the next surah before its heading.
const VOLUME = /^الجزء [^\n]{2,14}$/gm;
const SURAH_TITLE = /\n(سورة [^\n]{2,30})\n/;

export type RawPassage = { surah: number; from: number; to: number; part: number; first: number; last: number; text: string };

/**
 * The book's passages: the text under each heading up to the next, its first and last printed page. The surah's
 * opening words (where it was revealed, its count of ayat) open its first passage. The ayat the heading quotes, which
 * the reader already shows, are dropped from the passage's start. A heading sometimes names fewer ayat than its
 * passage explains («الآيات ٤٣ الى ٤٧» runs on to 44:50), so a passage runs to the ayah before the next heading, or
 * to the surah's end (`ayatIn`).
 */
export function readPassages(dump: Dump, ayatIn: (surah: number) => number): RawPassage[] {
  const seen = new Set<string>();
  const pages: { part: number; page: number; text: string }[] = [];
  for (const row of dump.ayahs) for (const piece of row.content) {
    if (!/^\d+$/.test(piece.part) || piece.page === null) continue;
    const id = `${piece.part}/${piece.page}/${piece.text}`;
    if (seen.has(id)) continue;
    seen.add(id);
    pages.push({ part: Number(piece.part), page: piece.page, text: cleanPage(piece.text) });
  }
  pages.sort((a, b) => a.part - b.part || a.page - b.page);
  let book = '';
  const starts: { at: number; part: number; page: number }[] = [];
  for (const page of pages) {
    starts.push({ at: book.length, part: page.part, page: page.page });
    book += `${page.text}\n`;
  }
  const pageAt = (at: number) => {
    let lo = 0;
    for (let hi = starts.length - 1; lo < hi;) { const mid = (lo + hi + 1) >> 1; if (starts[mid].at <= at) lo = mid; else hi = mid - 1; }
    return starts[lo];
  };
  const heads = [...book.matchAll(HEADING)].map(m => ({
    at: m.index!, end: m.index! + m[0].length, surah: latin(m[1]), from: latin(m[2] ?? m[3]), to: latin(m[2] ?? m[4]),
  }));
  const passages: RawPassage[] = [];
  const before = `\n${book.slice(0, heads[0]?.at ?? 0)}`;
  const opener = SURAH_TITLE.exec(before);
  let carry = opener ? before.slice(opener.index + opener[0].length) : before;
  heads.forEach((head, i) => {
    const stop = heads[i + 1]?.at ?? book.length;
    let text = book.slice(head.end, stop);
    const next = heads[i + 1];
    if (next && next.surah !== head.surah) {
      const tail = Math.max(0, text.length - 1500);
      const title = SURAH_TITLE.exec(text.slice(tail));
      if (title) {
        const at = tail + title.index!;
        carry = text.slice(at + title[0].length);
        text = text.slice(0, at);
      }
    }
    const quoted = text.indexOf(`(${arabic(head.to)})`);
    if (quoted >= 0 && quoted < 6000) text = text.slice(quoted + arabic(head.to).length + 2);
    const opening = head.from === 1 || passages.at(-1)?.surah !== head.surah ? carry : '';
    if (opening) carry = '';
    const body = tidy(`${opening.replace(/بِسْمِ اللَّهِ الرَّحْمنِ الرَّحِيمِ/g, '')}\n${text}`);
    const first = pageAt(head.at);
    passages.push({ surah: head.surah, from: head.from, to: head.to, part: first.part, first: first.page, last: pageAt(Math.max(head.end, stop - 1)).page, text: body });
  });
  // A heading that names an ayah the one before already named (printed again over the next page, or a range that
  // overlaps it: «الآيات ٣٨ الى ٤٧» after «٣٦ الى ٤٠») continues that passage, so the text under both is one passage
  // and no ayah has two.
  const merged = passages.reduce<RawPassage[]>((out, passage) => {
    const last = out.at(-1);
    if (last?.surah === passage.surah && passage.from <= last.to) {
      Object.assign(last, { to: Math.max(last.to, passage.to), last: passage.last, text: [last.text, passage.text].filter(Boolean).join('\n') });
    } else out.push(passage);
    return out;
  }, []);
  merged.forEach((passage, i) => {
    const next = merged[i + 1];
    passage.to = next?.surah === passage.surah ? Math.max(passage.to, next.from - 1) : Math.max(passage.to, ayatIn(passage.surah));
  });
  return merged;
}

// The printed lines break mid-sentence, so lines of prose join; a line of poetry stays its own line, and each of his
// «فإن قلت» questions opens a paragraph.
const tidy = (text: string) => text.replace(VOLUME, '').split('\n').map(line => line.trim()).filter(Boolean)
  .reduce((out, line, i, lines) => out + (i === 0 ? '' : line.includes(POEM_GAP) || lines[i - 1].includes(POEM_GAP) ? '\n' : ' ') + line, '')
  .replace(/[ ]{2,}/g, ' ')
  .replace(/ (فإن قلت)/g, '\n$1');

// A vowel mark other than shadda. Al-Zamakhshari's prose is bare but for a shadda here and there; the Quran he quotes
// is vocalized.
const VOWELS = /[\u064B-\u0650\u0652]/g;
const marks = (text: string) => text.match(VOWELS)?.length ?? 0;
const arabicWords = (text: string) => text.replace(/[^\u0621-\u06ED\s]/g, ' ').split(/\s+/).filter(Boolean);

/**
 * Wraps the Quran he quotes in ﴿…﴾ (shared/quran/tafsirSadi.ts tafsirRuns): a vocalized parenthesis, then any run of
 * vocalized words with two marks or more, when every word of it is a word of the Quran, so a vocalized proverb stays
 * prose. Lines of poetry are left alone.
 */
export function markQuran(text: string, quranWords: Set<string>): string {
  const quran = (words: string[]) => words.length > 0 && words.every(word => quranWords.has(skeleton(word)));
  return text.split('\n').map(line => {
    if (line.includes(POEM_GAP)) return line;
    const parens = line.replace(/\(([^()﴿﴾]{2,600})\)/g, (whole, inner: string) => (marks(inner) >= 2 && quran(arabicWords(inner)) ? `﴿${inner.trim()}﴾` : whole));
    return parens.split(/(﴿[^﴾]*﴾)/).map(piece => {
      if (piece.startsWith('﴿')) return piece;
      const tokens = piece.split(/(\s+)/);
      const out: string[] = [];
      for (let i = 0; i < tokens.length;) {
        if (!marks(tokens[i])) { out.push(tokens[i]); i++; continue; }
        let j = i;
        while (j + 2 < tokens.length && marks(tokens[j + 2])) j += 2;
        const run = tokens.slice(i, j + 1).join('');
        const lead = run.match(/^[^\u0621-\u06ED]+/)?.[0] ?? '';
        const tail = run.match(/[^\u0621-\u06ED\u064B-\u0652]+$/)?.[0] ?? '';
        const inner = run.slice(lead.length, run.length - tail.length);
        out.push(marks(inner) >= 2 && quran(arabicWords(inner)) ? `${lead}﴿${inner}﴾${tail}` : run);
        i = j + 1;
      }
      return out.join('');
    }).join('');
  }).join('\n');
}

// His words for the devices, each found where it starts a word (after و، ف، ب، ل، ك or ال at most).
const DEVICE_WORDS: [device: (typeof BALAGHA_DEVICES)[number], pattern: RegExp][] = [
  ['الاستعارة', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:استعار|مستعار|استعير|يستعار)/],
  ['التشبيه', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:تشبيه|شبّه|(?:شبه|شبهت|شبهه|شبهها|يشبه)\s+(?:\S+\s+){0,5}ب)/],
  ['التمثيل', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:تمثيل|مثّل)/],
  ['الكناية', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:كناي[ةا]ت?|كنى\s+(?:به|بها|عن|ب)|يكنى|كنوا)/],
  ['المجاز', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)مجاز(?!ي[كهن]|ى\s+عليه|اة)/],
  ['الالتفات', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)التفات(?!\s+إلى)/],
  ['التقديم', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:تقديم|قدّم[^.؟]{0,40}على)/],
  ['التكرير', /(?:^|[^ء-ي])(?:[وفبلك]?(?:ال)?)(?:تكرير|تكرار|كرّر)/],
];

// Grammar's names that hold a device word without speaking of the device: the particle of likeness, «كاف التشبيه».
const NOT_DEVICE = /(?:كاف|حرف|حروف|أداة|أدوات)\s+(?:ال)?تشبيه/g;

/** Sentence ends: his full stops and question marks, and line breaks (poetry); never inside a Quran quote. */
export function sentences(text: string): [number, number][] {
  const spans: [number, number][] = [];
  let start = 0;
  const re = /[.؟!]|\n/g;
  for (let m; (m = re.exec(text));) {
    if (text.lastIndexOf('﴿', m.index) > text.lastIndexOf('﴾', m.index)) continue;
    const end = m[0] === '\n' ? m.index : m.index + 1;
    if (text.slice(start, end).trim()) spans.push(trim(text, start, end));
    start = m.index + 1;
  }
  if (text.slice(start).trim()) spans.push(trim(text, start, text.length));
  return spans;
}
const trim = (text: string, start: number, end: number): [number, number] => {
  while (start < end && /\s/.test(text[start])) start++;
  while (end > start && /\s/.test(text[end - 1])) end--;
  return [start, end];
};

/** A sentence left unlit though a device word is in it: the word is used in another sense there (data file, by hand). */
export type Exclusion = { key: string; contains: string; why: string };

/**
 * The lit sentences of a passage: each that holds one of his device words, the device, and the ayah words it quotes:
 * the first of its Quran quotes found among the passage's ayat. A quote shorter than three letters places nothing.
 */
export function litSentences(passage: { surah: number; from: number; to: number; text: string }, words: (key: string) => string[], exclusions: Exclusion[] = []): KashshafLit[] {
  const lits: KashshafLit[] = [];
  const key = `${passage.surah}:${passage.from}`;
  for (const [start, end] of sentences(passage.text)) {
    const sentence = passage.text.slice(start, end);
    if (sentence.includes(POEM_GAP)) continue;
    const plain = sentence.replace(/﴿[^﴾]*﴾/g, ' ').replace(NOT_DEVICE, ' ');
    const found = DEVICE_WORDS.filter(([, pattern]) => pattern.test(plain)).map(([device]) => BALAGHA_DEVICES.indexOf(device));
    if (!found.length || exclusions.some(ex => ex.key === key && sentence.includes(ex.contains))) continue;
    let ayah = 0;
    let from = -1;
    let to = -1;
    for (const quote of sentence.matchAll(/﴿([^﴾]*)﴾/g)) {
      if (skeleton(quote[1].replace(/\s/g, '')).length < 3) continue;
      for (let a = passage.from; a <= passage.to && !ayah; a++) {
        const hit = matchHeading(words(`${passage.surah}:${a}`), quote[1]);
        if (hit) [ayah, from, to] = [a, hit[0], hit[1]];
      }
      if (ayah) break;
    }
    for (const device of found) lits.push([start, end, device, ayah, from, to]);
  }
  return lits;
}

export const entryOf = (passage: RawPassage, text: string, lit: KashshafLit[]): KashshafEntry =>
  [passage.surah, passage.from, passage.to, passage.part, passage.first, passage.last, text, lit];
