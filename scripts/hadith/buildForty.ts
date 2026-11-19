// al-Nawawi's Forty and the Sahihayn records he names (docs/audits/2026-11-18-hadith-sources.md), read from turath.io's
// exports of the Shamela editions the audit chose, each pinned by its hash. It writes data/hadith/forty.json: al-Nawawi's
// own text per entry, and every record (and every printed route under a Muslim number) verbatim, with volume and page.
// Editors' footnotes, footnote marks and Shamela's comments are dropped; the authors' words are kept as printed.
// Run: npx tsx scripts/hadith/buildForty.ts
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { AppForty, AppIsnad, FortyGrade, FortyRecord } from '../../shared/hadith';
import { layoutIsnad } from '../../src/lib/model/isnadGraph';
import { spellSigns } from '../quran/signs';

interface Page { text: string; vol?: string; page?: number }

/** The exports the data was read from (fetched 2026-11-18); a different file stops the build. */
export const BOOKS = {
  nawawi: { id: 12836, title: 'الأربعون النووية', edition: 'دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي' },
  bukhari: { id: 1681, title: 'صحيح البخاري', edition: 'السلطانية، بولاق ١٣١١هـ، مصوّرة دار طوق النجاة ١٤٢٢هـ' },
  muslim: { id: 1727, title: 'صحيح مسلم', edition: 'تحقيق محمد فؤاد عبد الباقي، عيسى البابي الحلبي، القاهرة ١٣٧٤هـ' },
  tirmidhi: { id: 1435, title: 'سنن الترمذي', edition: 'تحقيق أحمد شاكر وآخرين، مصطفى البابي الحلبي، مصر، ط٢، ١٣٩٥هـ' },
  nasai: { id: 829, title: 'سنن النسائي', edition: 'المطبعة المصرية، المكتبة التجارية الكبرى، القاهرة، ط١، ١٣٤٨هـ، بترقيم عبد الفتاح أبي غدة' },
  abudawud: { id: 1726, title: 'سنن أبي داود', edition: 'تحقيق محمد محيي الدين عبد الحميد، المكتبة العصرية، صيدا وبيروت' },
  ibnmajah: { id: 1198, title: 'سنن ابن ماجه', edition: 'تحقيق محمد فؤاد عبد الباقي، دار إحياء الكتب العربية، عيسى البابي الحلبي' },
  daraqutni: { id: 9771, title: 'سنن الدارقطني', edition: 'تحقيق شعيب الأرنؤوط وآخرين، مؤسسة الرسالة، بيروت، ط١، ١٤٢٤هـ' },
  bayhaqi: { id: 7861, title: 'السنن الكبرى للبيهقي', edition: 'تحقيق محمد عبد القادر عطا، دار الكتب العلمية، بيروت، ط٣، ١٤٢٤هـ' },
  ahmad: { id: 25794, title: 'مسند أحمد', edition: 'تحقيق شعيب الأرنؤوط وآخرين، مؤسسة الرسالة، ط١، ١٤٢١هـ' },
  darimi: { id: 21795, title: 'مسند الدارمي', edition: 'تحقيق حسين سليم أسد الداراني، دار المغني، الرياض، ط١، ١٤١٢هـ' },
  muwatta: { id: 1699, title: 'موطأ مالك', edition: 'رواية يحيى الليثي، تحقيق محمد فؤاد عبد الباقي، دار إحياء التراث العربي، بيروت، ١٤٠٦هـ' },
  abd: { id: 13170, title: 'المنتخب من مسند عبد بن حميد', edition: 'تحقيق صبحي البدري السامرائي ومحمود محمد خليل الصعيدي، مكتبة السنة، القاهرة، ط١، ١٤٠٨هـ' },
  ibnrajab: { id: 4268, title: 'جامع العلوم والحكم', edition: 'لابن رجب الحنبلي، تحقيق شعيب الأرنؤوط وإبراهيم باجس، مؤسسة الرسالة، بيروت، ط٧، ١٤١٧هـ' },
} as const;
type BookKey = keyof typeof BOOKS;
/** The books a record can come from: every book but al-Nawawi's and Ibn Rajab's. */
export type RecordBook = Exclude<BookKey, 'nawawi' | 'ibnrajab'>;
const PINS: Record<number, string> = JSON.parse(readFileSync('data/hadith/forty-pins.json', 'utf8'));

export function load(id: number): Page[] {
  const path = join(tmpdir(), `turath-${id}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${id}.json`], { maxBuffer: 64 * 1024 * 1024 }));
  const raw = readFileSync(path);
  const sha = createHash('sha256').update(raw).digest('hex');
  if (PINS[id] !== sha) throw new Error(`turath book ${id} changed (sha256 ${sha}); check the records again`);
  return (JSON.parse(raw.toString('utf8')) as { pages: Page[] }).pages;
}

export const AR = '٠١٢٣٤٥٦٧٨٩';
export const ar = (n: number) => String(n).replace(/\d/g, d => AR[+d]);
export const en = (s: string) => Number(s.replace(/[٠-٩]/g, d => String(AR.indexOf(d))));

const RECORD_LINE = /^\s*(?:[٠-٩]+ - |(?:[٠-٩]+ ?)?(?:- )?(?:م(?: [٠-٩]+)? ?)?(?:- )?\([٠-٩]+\)(?: -)?\s|<span data-type="title")/;

/**
 * A page's own text: the notes under a rule (Bukhari's "_____", Muslim's <hr>) go, up to the next record or heading
 * printed after them on the same page; footnote marks and tags go too.
 */
export function withoutNotes(text: string, recordLine = RECORD_LINE): string {
  const [first, ...rest] = text.split(/\n?_{5,}|<hr\s*\/?>|\n\[تعليق المحقق\]/);
  return [first, ...rest.map(part => {
    const lines = part.split('\n');
    const at = lines.findIndex(line => recordLine.test(line));
    return at < 0 ? '' : lines.slice(at).join('\n');
  })].join('\n');
}

export function body(text: string, marks?: RegExp, recordLine?: RegExp): string {
  return spellSigns(withoutNotes(text, recordLine))
    .replace(marks ?? /$^/g, '')
    .replace(/(?:\([٠-٩]+\) ?)?<span data-type=["']title["'][^>]*>(.*?)<\/span>/g, '\n⟪باب⟫$1\n')
    .replace(/<a href="inr:\/\/man-(\d+)">([^<]*)<\/a>/g, '⁅$1⁆$2⁆')
    .replace(/<[^>]+>/g, '')
    .replace(/\(\^[٠-٩]+\)/g, '')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ');
}

/** The book as one string with a page marker (⟦vol:page⟧) wherever a page starts, so a record knows its pages. */
export function joined(pages: Page[], marks?: RegExp, recordLine?: RegExp): string {
  return pages.map((p, i) => `⟦${p.vol ?? 1}:${p.page ?? 0}:${i + 1}⟧${body(p.text, marks, recordLine)}`).join('\n');
}

/** In the books other than Muslim's, a note's lines end only at a record «N - » or a heading: a line opening «(١)» is another note. */
const NUMBERED_LINE = /^\s*(?:[٠-٩]+ ?- |<span data-type=["']title["'])/;

/** Footnote marks some editions print in the text as a bare «(١)» (the Risala Musnad), not as Shamela's «(^١)». */
const BARE_MARKS: Partial<Record<RecordBook, RegExp>> = { ahmad: / ?\([٠-٩]+\)/g };

/** A record from its start to before the next record or chapter: its text without markers, and the pages it spans. */
export function cut(book: string, start: number, end: number) {
  const before = /⟦(\d+):(\d+):(\d+)⟧/.exec(book.slice(book.lastIndexOf('⟦', start)));
  const pages = [`${before![1]}:${before![2]}`];
  const raw = book.slice(start, end);
  for (const m of raw.matchAll(/⟦(\d+):(\d+):\d+⟧|⦗([٠-٩]+)⦘/g)) pages.push(m[1] ? `${m[1]}:${m[2]}` : `${pages[0].split(':')[0]}:${en(m[3])}`);
  const marked = raw.replace(/⟦[\d:]*⟧?/g, ' ').replace(/⦗[٠-٩]+⦘/g, ' ').replace(/\s+/g, ' ').replace(/\s+([،.:؛])/g, '$1').trim();
  return { shamela: Number(before![3]), volume: Number(pages[0].split(':')[0]), pages: [...new Set(pages.map(p => Number(p.split(':')[1])))].sort((a, b) => a - b), ...narrated(marked) };
}

const MODES = /(?:^|\s)(?:حدثنا|حدثني|أخبرنا|أخبرني|عن|سمعت|سمع|أنبأنا)[\s:،]*$/;
export const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '');
/** The word a narrator narrated with, as printed, when the words before his name end with one. */
const modeOf = (before: string) => (MODES.test(bare(before)) ? before.trim().replace(/[:،]$/, '').split(/\s+/).pop() : undefined);

/**
 * A record's text with Shamela's narrator links taken out, and its chain when the links make it plain: one line of
 * narrators before the first quote mark, each after the word he narrated with, with no ح (a second route) among them.
 */
export function narrated(marked: string) {
  const text = marked.replace(/⁅\d+⁆([^⁆]*)⁆/g, '$1').replace(/\s+([،.:؛])/g, '$1');
  const quote = text.search(/[«"]/);
  const links: { name: string; mode: string }[] = [];
  let plain = '';
  let single = true;
  for (const part of marked.split(/(⁅\d+⁆[^⁆]*⁆)/)) {
    const link = part.match(/⁅\d+⁆([^⁆]*)⁆/);
    if (!link) { plain += part; continue; }
    if (quote >= 0 && plain.replace(/\s+([،.:؛])/g, '$1').length >= quote) break;
    const mode = modeOf(plain);
    if (!mode) single = false;
    if (/(?:^|\s)ح(?:\s|$)/.test(plain)) single = false;
    links.push({ name: link[1].replace(/[،,:.\s]+$/, '').trim(), mode: mode ?? '' });
    plain += link[1];
  }
  return { text, ...(quote > 0 ? { isnadEnd: quote } : {}), ...(single && links.length > 1 ? { chain: links } : {}) };
}

export const bareText = (text: string) => bare(text).replace(/[أإآ]/g, 'ا').replace(/\s+/g, ' ');

/**
 * A book's record N, printed «N - …» at a line's start (al-Bukhari, the Sunan, the Musnads), to the next record or chapter
 * heading. A book that numbers its records afresh in each of its books (the Muwatta) names words of the record (near).
 */
function numberedRecord(key: RecordBook, book: string, n: number, near?: string) {
  const heads = [...book.matchAll(new RegExp(`(?<=^|\\n|⟧)\\s*${ar(n)} ?- `, 'g'))];
  for (const head of heads) {
    const from = head.index! + head[0].length;
    // Some chapter headings are printed as plain text, not marked as titles: a line starting «بَاب», or a Quran heading
    // in the commentary chapters (a line starting «﴿»), ends the record too.
    const next = book.slice(from).search(/(?:^|\n|⟧)\s*(?:[٠-٩]+ ?- |⟪باب⟫|بَابٌ?[ُ:]? |﴿)/m);
    const record = { book: key, number: n, ...cut(book, head.index!, next < 0 ? book.length : from + next) };
    if (!near || bareText(record.text).includes(bareText(near))) return record;
  }
  throw new Error(`${key} ${n}${near ? ` («${near}»)` : ''} not found`);
}

const ROUTE_HEAD = '((?:[٠-٩]+ ?)?(?:- )?(?:م(?: [٠-٩]+)? ?)?(?:- )?)\\(';
const NEXT_ROUTE = new RegExp(`(?:^|\\n|⟧)\\s*(?:${ROUTE_HEAD}[٠-٩]+\\)(?: -)?\\s|⟪باب⟫)`, 'm');

/**
 * Every route Muslim prints under Abd al-Baqi's number N, each to the next route or chapter heading. A route's head is
 * "k - (N)", "k - م - (N)", "k م - (N)", "k - م 2 - (N)" or a bare "(N) -"; its label is the head as printed.
 */
export function muslimRoutes(book: string, n: number, keep?: string[]) {
  const re = new RegExp(`(?:^|\\n|⟧)\\s*${ROUTE_HEAD}${ar(n)}\\)(?: -)?\\s`, 'g');
  const routes = [...book.matchAll(re)].map(m => {
    const start = m.index! + m[0].search(/[^\s⟧]/);
    const from = m.index! + m[0].length;
    const next = book.slice(from).search(NEXT_ROUTE);
    const { text, shamela, volume, pages } = cut(book, start, next < 0 ? book.length : from + next);
    const route = m[1].replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    return { book: 'muslim', number: n, route, shamela, volume, pages, text };
  }).filter(r => !keep || keep.includes(r.route)).sort((a, b) => (keep ? keep.indexOf(a.route) - keep.indexOf(b.route) : 0));
  if (!routes.length) throw new Error(`Muslim ${n} not found`);
  return routes;
}

/** al-Nawawi's entry: his heading's page to the next heading, with the page each part starts on. */
function nawawiEntries(pages: Page[]) {
  const entries: { n: number; heading: string; shamela: number; pages: number[]; text: string }[] = [];
  for (const [i, p] of pages.entries()) {
    const head = p.text.match(/<span data-type="title"[^>]*>(الحديث [^<]+)<\/span>/);
    const text = body(p.text).replace(/⟪باب⟫[^\n]*\n/, '').replace(/\s+/g, ' ').trim();
    if (head) entries.push({ n: entries.length + 1, heading: head[1], shamela: i + 1, pages: [p.page!], text });
    else if (entries.length && entries.length <= 42) {
      const last = entries[entries.length - 1];
      last.pages.push(p.page!);
      last.text = `${last.text} ${text}`;
    }
  }
  return entries.slice(0, 42);
}

type Ref = number | { n: number; partial?: boolean; routes?: string[] };
/** A record in a book other than the Sahihayn: its printed number, words of it where the number repeats, and its Companion when another than al-Nawawi's. */
interface OtherRef { book: RecordBook; n: number; near?: string; route?: string; partial?: boolean; from?: string; mursal?: boolean }
/**
 * A scholar's grade, quoted: «say» is his words as printed in «in» (al-Nawawi's entry, Ibn Rajab's chapter, or a record
 * «book:n»); with «to», the quote runs from «say» through «to», his whole discussion.
 */
interface GradeRef { by: string; say: string; to?: string; in: string }
interface MapEntry {
  n: number; companion: string; named: string[]; errata?: [string, string, string][]; alsoFrom?: string[]; bukhari?: Ref[]; muslim?: Ref[];
  others?: OtherRef[]; grades?: GradeRef[]; partial?: boolean; note?: string;
}
const refOf = (ref: Ref) => (typeof ref === 'number' ? { n: ref } : ref);

/** A paragraph and the page it starts on; `turns` where a page it runs onto starts in its text. */
interface Paragraph { text: string; volume: number; page: number; shamela: number; turns?: { at: number; page: number }[] }
const ENDS = /[.:؟!»"\])﴾]$/;

/**
 * Ibn Rajab's chapters on the Forty (1–42), his words only: each page's text above the editors' notes, in paragraphs, a
 * paragraph a page break cuts joined to the page before it (one with no full stop at its end).
 */
function ibnRajabChapters(pages: Page[]) {
  const heads = pages.flatMap((p, i) => (/<span data-type="title"[^>]*>الحديثُ? [^<]+<\/span>/.test(p.text) ? [i] : []));
  if (heads.length !== 50) throw new Error(`Ibn Rajab: ${heads.length} chapters, not 50`);
  return heads.slice(0, 42).map((start, c) => {
    const paragraphs: Paragraph[] = [];
    for (let i = start; i < heads[c + 1]; i++) {
      // A footnote mark taken out leaves its space before the comma or stop it stood at.
      const lines = body(pages[i].text, undefined, NUMBERED_LINE).split('\n').map(line => line.replace(/\s+/g, ' ').replace(/\s+([،.:؛])/g, '$1').trim()).filter(Boolean);
      lines.forEach((line, k) => {
        if (/^⟪باب⟫/.test(line)) return;
        const last = paragraphs[paragraphs.length - 1];
        if (k === 0 && last && !ENDS.test(last.text)) {
          last.turns = [...(last.turns ?? []), { at: last.text.length + 1, page: pages[i].page! }];
          last.text = `${last.text} ${line}`;
        }
        else paragraphs.push({ text: line, volume: Number(pages[i].vol ?? 1), page: pages[i].page!, shamela: i + 1 });
      });
    }
    return { n: c + 1, shamela: start + 1, paragraphs };
  });
}

type Chapter = ReturnType<typeof ibnRajabChapters>[number];
type BuiltRecord = ReturnType<typeof numberedRecord> & { route?: string; partial?: boolean; from?: string; mursal?: boolean };

/** The same text with each word's marks in one order (shadda before or after its vowel is typed both ways); the length is kept. */
const marksInOrder = (text: string) => text.replace(/[\u064B-\u0652\u0670]{2,}/g, marks => [...marks].sort().join(''));

/** A quote, checked against the text it is from: its words as printed (from «say» through «to»), or the build stops. */
function quoteIn(printed: string, say: string, to: string | undefined, where: string) {
  const text = marksInOrder(printed);
  const at = text.indexOf(marksInOrder(say));
  if (at < 0) throw new Error(`${where}: «${say}» not found`);
  const end = to ? text.indexOf(marksInOrder(to), at) : at + say.length;
  if (end < 0) throw new Error(`${where}: «${to}» not found after «${say}»`);
  return { at, quote: printed.slice(at, to ? end + to.length : end) };
}

/** Each grade quoted from where it is printed, with the book and page it is on. */
function gradesOf(n: number, refs: GradeRef[], nawawi: { text: string; pages: number[]; shamela: number }, records: BuiltRecord[], chapter: Chapter): FortyGrade[] {
  return refs.map(({ by, say, to, in: where }) => {
    if (where === 'nawawi') return { by, book: 'nawawi', quote: quoteIn(nawawi.text, say, to, `al-Nawawi ${n}`).quote, volume: 1, pages: nawawi.pages.slice(-1), shamela: nawawi.shamela };
    if (where === 'ibnrajab') {
      const joinedText = chapter.paragraphs.map(p => p.text).join('\n');
      const { at, quote } = quoteIn(joinedText, say, to, `Ibn Rajab ${n}`);
      let offset = 0;
      const pages: number[] = [];
      let shamela = 0;
      let volume = 0;
      for (const p of chapter.paragraphs) {
        const from = offset;
        offset += p.text.length + 1;
        if (from + p.text.length < at || from >= at + quote.length) continue;
        // The page a quote starts on is the last page turned before it; each page turned inside it counts too.
        const turns = (p.turns ?? []).filter(turn => from + turn.at <= at + quote.length);
        const before = turns.filter(turn => from + turn.at <= at).pop();
        if (!shamela) { shamela = p.shamela + (before ? before.page - p.page : 0); volume = p.volume; }
        pages.push(before ? before.page : p.page, ...turns.filter(turn => from + turn.at > at).map(turn => turn.page));
      }
      return { by, book: 'ibnrajab', quote, volume, pages: [...new Set(pages)], shamela };
    }
    const record = records.find(r => `${r.book}:${r.number}` === where);
    if (!record) throw new Error(`al-Nawawi ${n}: grade in ${where}, which is not among its records`);
    return { by, book: record.book, number: record.number, quote: quoteIn(record.text, say, to, where).quote, volume: record.volume, pages: record.pages, shamela: record.shamela };
  });
}

export function buildForty() {
  const map = JSON.parse(readFileSync('data/hadith/forty-map.json', 'utf8')) as { entries: MapEntry[] };
  const nawawi = nawawiEntries(load(BOOKS.nawawi.id));
  if (nawawi.length !== 42) throw new Error(`al-Nawawi: ${nawawi.length} entries, not 42`);
  const bukhari = joined(load(BOOKS.bukhari.id));
  const muslim = joined(load(BOOKS.muslim.id));
  const others = new Map<RecordBook, string>();
  const other = (key: RecordBook) => {
    if (!others.has(key)) others.set(key, joined(load(BOOKS[key].id), BARE_MARKS[key], NUMBERED_LINE));
    return others.get(key)!;
  };
  const chapters = ibnRajabChapters(load(BOOKS.ibnrajab.id));
  const entries = nawawi.map(entry => {
    const m = map.entries.find(e => e.n === entry.n);
    if (!m) throw new Error(`al-Nawawi ${entry.n} is not in forty-map.json`);
    const text = (m.errata ?? []).reduce((now, [wrong, right]) => {
      if (!now.includes(wrong)) throw new Error(`al-Nawawi ${entry.n}: erratum «${wrong}» not found`);
      return now.replace(wrong, right);
    }, entry.text);
    const records: BuiltRecord[] = [
      ...(m.bukhari ?? []).map(refOf).map(r => ({ ...numberedRecord('bukhari', bukhari, r.n), ...(r.partial ? { partial: true } : {}) })),
      ...(m.muslim ?? []).map(refOf).flatMap(r => muslimRoutes(muslim, r.n, r.routes).map(x => ({ ...x, book: 'muslim' as const, ...(r.partial ? { partial: true } : {}) }))),
      ...(m.others ?? []).map(r => ({
        ...numberedRecord(r.book, other(r.book), r.n, r.near),
        ...(r.route ? { route: r.route } : {}), ...(r.partial ? { partial: true } : {}), ...(r.from ? { from: r.from } : {}), ...(r.mursal ? { mursal: true } : {}),
      })),
    ];
    for (const r of m.others ?? []) if (r.from && !bareText(records.find(x => x.book === r.book && x.number === r.n)!.text).includes(bareText(r.from))) throw new Error(`${r.book} ${r.n}: «${r.from}» is not in the record`);
    return {
      ...entry,
      text,
      companion: m.companion,
      ...(m.alsoFrom ? { alsoFrom: m.alsoFrom } : {}),
      named: m.named,
      ...(m.partial ? { partial: true } : {}),
      ...(m.note ? { note: m.note } : {}),
      records,
      ...(m.grades ? { grades: gradesOf(entry.n, m.grades, { ...entry, text }, records, chapters[entry.n - 1]) } : {}),
    };
  });
  const books = Object.fromEntries(Object.entries(BOOKS).map(([k, b]) => [k, { shamela: b.id, title: b.title, edition: b.edition, sha256: PINS[b.id] }]));
  return { books, entries, ibnRajab: chapters };
}

type Built = Omit<ReturnType<typeof buildForty>, 'ibnRajab'>;

/** A chain laid out as the website lays out an isnad (layoutIsnad), one narrator under the other: the collector on top, the Companion last. */
function chainIsnad(collector: string, chain: { name: string; mode: string }[]): AppIsnad {
  const graph = {
    nodes: [{ id: 'c', label: collector }, ...chain.map((link, i) => ({ id: `n${i}`, label: link.name }))],
    edges: chain.map((link, i) => ({ from: `n${i}`, to: i ? `n${i - 1}` : 'c', label: link.mode })),
  };
  const { nodes, edges, width, height } = layoutIsnad(graph);
  return { nodes: nodes.map(({ id, label, x, y }) => ({ id, label, x, y })), edges, rows: [], width, height };
}

/**
 * The phone's copy (shared/data/hadith/forty.json): the same texts, with each linked chain drawn. A record that holds only
 * part of al-Nawawi's wording, or an entry he takes only partly from the Sahihayn, keeps its text and gets no drawing.
 */
const COLLECTORS: Record<RecordBook, string> = {
  bukhari: 'البخاري', muslim: 'مسلم', tirmidhi: 'الترمذي', nasai: 'النسائي', abudawud: 'أبو داود', ibnmajah: 'ابن ماجه', daraqutni: 'الدارقطني',
  bayhaqi: 'البيهقي', ahmad: 'أحمد', darimi: 'الدارمي', muwatta: 'مالك', abd: 'عبد بن حميد',
};

export function appForty(built: Built): AppForty {
  const { books } = built;
  return {
    books: Object.fromEntries(Object.entries(books).map(([k, b]) => [k, { shamela: b.shamela, title: b.title, edition: b.edition }])) as AppForty['books'],
    entries: built.entries.map((full: Built['entries'][number]) => {
      const entry = { ...full };
      delete entry.note;
      return {
        ...entry,
        records: entry.records.map((record): FortyRecord => {
          const { chain, ...rest } = record as typeof record & { chain?: { name: string; mode: string }[] };
          const drawn = chain && !entry.partial && !rest.partial;
          return { ...(rest as FortyRecord), ...(drawn ? { isnad: chainIsnad(COLLECTORS[record.book], chain) } : {}) };
        }),
      };
    }),
  };
}

if (process.argv[1]?.endsWith('buildForty.ts')) {
  const { ibnRajab, ...built } = buildForty();
  writeFileSync('data/hadith/forty.json', `${JSON.stringify(built, null, 1)}\n`);
  writeFileSync('shared/data/hadith/forty.json', `${JSON.stringify(appForty(built))}\n`);
  writeFileSync('shared/data/hadith/ibnRajab.json', `${JSON.stringify(ibnRajab)}\n`);
}
