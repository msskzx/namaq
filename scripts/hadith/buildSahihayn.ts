// Sahih al-Bukhari and Sahih Muslim whole, read from the same pinned turath.io exports of the editions the Forty uses
// (docs/audits/2026-11-18-hadith-sources.md; docs/audits/2026-11-19-sahihayn-full.md): al-Bukhari's Sultaniyya with Abd
// al-Baqi's numbers (Tawq al-Najah 1422), and Muslim in Abd al-Baqi's edition. For each book it writes
//   shared/data/hadith/<book>.json  the kitabs and their babs, with the hadith numbers under each (small: ships in the app)
//   data/hadith/sahih/<book>.json   each kitab's bab texts and hadith, verbatim, with volume and page (read by the website,
//                                   and downloaded once by the phone from /api/books/<book>)
// Editors' footnotes and Shamela's comments are dropped, as in buildForty. al-Bukhari's kitab and bab headings are his own;
// Muslim's are al-Nawawi's (as Abd al-Baqi prints them), and the index says so.
// Run: npx tsx scripts/hadith/buildSahihayn.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { SahihBook, SahihHadith, SahihIndex, SahihKitab, SahihKitabFile, SahihRoute, SahihText } from '../../shared/sahih';
import { BOOKS, bare, bareText, cut, en, joined, load } from './buildForty';

interface TocEntry { title: string; level: number; page: number }
interface Heading { at: number; title: string; level: 1 | 2; text?: string }

/** The export's own table of contents (Shamela's): its titles, levels and the page each starts on. */
function toc(id: number): TocEntry[] {
  const raw = JSON.parse(readFileSync(join('/tmp', `turath-${id}.json`), 'utf8')) as Record<string, unknown>;
  const meta = Object.values(raw).find(v => v && typeof v === 'object' && !Array.isArray(v) && Object.values(v as object).some(Array.isArray)) as Record<string, unknown>;
  const list = Object.values(meta).find(v => Array.isArray(v) && typeof (v as unknown[])[0] === 'object') as TocEntry[];
  return list;
}

/** Where each Shamela page starts in the joined book. */
function pageStarts(book: string) {
  const starts = new Map<number, number>();
  for (const m of book.matchAll(/⟦\d+:\d+:(\d+)⟧/g)) starts.set(Number(m[1]), m.index!);
  return starts;
}

const key = (title: string) => bareText(title).replace(/^\(?[٠-٩]+\)?\s*-?\s*/, '').replace(/[«»"():،.؟]/g, ' ').replace(/^(?:باب|كتاب|ابواب)\s+/, '').replace(/\s+/g, ' ').trim();

/**
 * A heading of the table of contents placed in the text: the heading printed on its page (a title the export marks, or a
 * line opening «باب»/«كتاب») whose words match it. A kitab takes only a printed «كتاب»/«أبواب» line, since its name often
 * repeats in its first bab. Its title is the printed one when found.
 */
function place(book: string, starts: Map<number, number>, entry: TocEntry, kitab: boolean, after: number): { at: number; printed?: string } | undefined {
  const from = Math.max(starts.get(entry.page) ?? 0, after);
  const to = starts.get(entry.page + 1) ?? book.length;
  const page = book.slice(from, to);
  const want = key(entry.title).split(' ').slice(0, 3).join(' ');
  for (const m of page.matchAll(/⟪باب⟫([^\n]*)|(?:^|\n)\s*((?:بَابٌ?ُ?|كِتَابُ?ٌ?|أَبْوَابُ)[^\n]*)/g)) {
    const printed = (m[1] ?? m[2]).trim();
    if (kitab && !/^(?:كتاب|ابواب)/.test(bareText(printed))) continue;
    if (!want || key(printed).includes(want) || want.includes(key(printed))) return { at: from + m.index!, printed };
  }
  return undefined;
}

/**
 * The table of contents placed in the text. A bab not found on its page starts with the page; a kitab not found starts
 * just before the heading after it (its first bab), with the table's own title.
 */
function headings(book: string, entries: TocEntry[], kitabs: (entry: TocEntry) => boolean): Heading[] {
  const starts = pageStarts(book);
  let after = 0;
  const placed = entries.map(entry => {
    const kitab = kitabs(entry);
    const found = place(book, starts, entry, kitab, after);
    if (found) after = found.at;
    return { entry, kitab, found, page: Math.max(starts.get(entry.page) ?? 0, after) };
  });
  return placed.map(({ entry, kitab, found, page }, i) => {
    const next = placed[i + 1];
    const at = found?.at ?? (kitab && next ? (next.found?.at ?? next.page) - 0.5 : page);
    const title = (found?.printed ?? entry.title).replace(/⦗[٠-٩]+⦘/g, '').replace(/[ \t]+/g, ' ').trim();
    return { at, title, level: kitab ? 1 : 2 } as Heading;
  });
}

/**
 * al-Bukhari's records by Abd al-Baqi's numbers. A number opening a line is a record's head («N - », or «N - M - K» when
 * he gives one printed record several numbers). He also numbers a few reports inside one printed record, where the number
 * stands mid-line. The print's order differs from his numbers in places (2973 after 2975), so each number takes its line
 * head, else a mid-line «N - » between the numbers either side of it, else the record `shared` names (a number the edition
 * prints under another, data/hadith/bukhari-numbers.json).
 */
interface Numbers { shared: Record<string, number>; starts: Record<string, string>; absent: number[] }

function bukhariMarks(book: string, start: number, last: number, { shared, starts, absent }: Numbers) {
  const heads = new Map<number, { at: number; also: number[] }[]>();
  for (const m of book.slice(start).matchAll(/(?<=^|\n|⟧)\s*([٠-٩]+(?: \(م\))?(?:(?: ?- ?| )[٠-٩]+)* ?-(?: ?[٠-٩]+ ?-?)*)(?=\s)/g)) {
    const [n, ...also] = m[1].match(/[٠-٩]+/g)!.map(en);
    if (n >= 1 && n <= last) heads.set(n, [...(heads.get(n) ?? []), { at: start + m.index! + m[0].search(/[٠-٩]/), also }]);
  }
  const marks: { n: number; at: number; also: number[] }[] = [];
  const covered = new Set<number>();
  let prev = start;
  for (let n = 1; n <= last; n++) {
    if (starts[n]) {
      // The phrase's letters as printed, whatever order its marks are typed in, with the export's narrator links
      // (⁅id⁆name⁆) allowed anywhere in it.
      const re = new RegExp([...bare(starts[n])].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\u064B-\\u0652\\u0670]*(?:⁅\\d+⁆|⁆)*'), 'g');
      re.lastIndex = prev;
      const at = re.exec(book)?.index ?? -1;
      if (at < 0) throw new Error(`al-Bukhari ${n}: «${starts[n]}» not found`);
      prev = at;
      marks.push({ n, at, also: [] });
      covered.add(n);
      continue;
    }
    const found = heads.get(n);
    if (!found || covered.has(n)) continue;
    const head = found.find(h => h.at > prev) ?? found[0];
    prev = head.at;
    marks.push({ n, at: head.at, also: head.also });
    head.also.forEach(x => covered.add(x));
  }
  const lost: number[] = [];
  for (let n = 1; n <= last; n++) {
    if (heads.has(n) || covered.has(n) || absent.includes(n)) continue;
    if (shared[n]) {
      const host = marks.find(m => m.n === shared[n]);
      if (!host) throw new Error(`al-Bukhari ${n}: the record ${shared[n]} it is printed under is not found`);
      host.also.push(n);
      continue;
    }
    const before = marks.filter(m => m.n < n).pop()?.at ?? start;
    const after = marks.find(m => m.n > n)?.at ?? book.length;
    const re = new RegExp(`(?<![٠-٩⦗:])${String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])}((?: [٠-٩]+)*) ?-(?=[\\s»])`, 'g');
    re.lastIndex = Math.min(before, after);
    const m = re.exec(book);
    if (!m || m.index > Math.max(before, after)) { lost.push(n); continue; }
    const also = (m[1].match(/[٠-٩]+/g) ?? []).map(en);
    also.forEach(x => covered.add(x));
    marks.push({ n, at: m.index, also });
  }
  if (lost.length) throw new Error(`al-Bukhari: ${lost.length} numbers not found: ${lost.join(' ')}`);
  return marks.sort((a, b) => a.at - b.at);
}

const ROUTE = /(?:^|\n|⟧)\s*((?:[٠-٩]+ ?)?(?:- )?(?:٠ )?(?:م(?: [٠-٩]+)? ?)?(?:- )?)\(([٠-٩]+)(?:\/ ?([٠-٩]+))?\)(?: -)?\s/g;

/** Muslim's routes in order, each with Abd al-Baqi's number N; the first route of each N, 1 to the last, in order. */
function muslimMarks(book: string, start: number, last: number, { fixes, absent }: { fixes: { page: number; printed: number; n: number }[]; absent: number[] }) {
  // Every head with a route count («k - (N)», «k م - (N)») is a route. A bare «(N) -» is one only for the number now open
  // or the next, since «(N)» also stands inside texts. Slips of the edition («(٣٩٩)» where 299 is due) are fixed in
  // data/hadith/muslim-numbers.json from Abd al-Baqi's numbering.
  const heads: { at: number; n: number; label: string; page: number; printed: string; counted: boolean; also?: number[] }[] = [];
  ROUTE.lastIndex = start;
  for (let m = ROUTE.exec(book); m; m = ROUTE.exec(book)) {
    const at = m.index + m[0].search(/[^\s⟧]/);
    const label = m[1].replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const page = Number(/⟦\d+:\d+:(\d+)⟧/.exec(book.slice(book.lastIndexOf('⟦', at)))![1]);
    const printed = en(m[2]);
    const n = fixes.find(f => f.page === page && f.printed === printed)?.n ?? printed;
    heads.push({ at, n, label: label.replace(/^([٠-٩]+) ٠$/, '$1'), page, printed: m[2], counted: /[٠-٩]/.test(label), ...(m[3] ? { also: [en(m[3])] } : {}) });
  }
  // Abd al-Baqi gives a hadith Muslim brings again later its first number, so a counted head may go back to any earlier
  // number; one ahead of the next new number is a slip.
  const routes: { at: number; n: number; label: string; also?: number[] }[] = [];
  const odd: string[] = [];
  let open = 0;
  for (const h of heads) {
    // A few numbers ahead is a number whose own head the export prints another way, listed below as missing.
    if (h.n > open + (h.counted ? 5 : 1)) { if (h.counted) odd.push(`page ${h.page}: «${h.label} (${h.printed})» where ${open + 1} at most was due`); continue; }
    if (!h.counted && h.n !== open && h.n !== open + 1) continue;
    routes.push({ at: h.at, n: h.n, label: h.label, also: h.also });
    open = Math.max(open, h.n, ...(h.also ?? []));
  }
  if (odd.length) throw new Error(`Muslim: route heads ahead of the numbering:\n${odd.join('\n')}`);
  const seen = new Set(routes.flatMap(r => [r.n, ...(r.also ?? [])]));
  const missing = Array.from({ length: last }, (_, i) => i + 1).filter(n => !seen.has(n) && !absent.includes(n));
  if (missing.length) throw new Error(`Muslim: ${missing.length} numbers with no route: ${missing.join(" ")}`);
  return routes;
}

const clean = (text: string) => text.replace(/⁅\d+⁆([^⁆]*)⁆/g, '$1').replace(/\[\d+\]/g, '').replace(/⟦[\d:]*⟧?/g, ' ').replace(/⦗[٠-٩]+⦘/g, ' ').replace(/⟪باب⟫/g, '').replace(/\s+/g, ' ').replace(/\s+([،.:؛])/g, '$1').trim();

interface Cut { start: number; end: number; n: number; route?: string; also?: number[] }
interface Built { index: SahihIndex; files: SahihKitabFile[] }

/** Each hadith with its kitab and bab: the last heading of each level before it. */
function assemble(book: string, heads: Heading[], cuts: Cut[], meta: SahihBook, muslim: boolean): Built {
  const kitabs: SahihKitab[] = [];
  const files: SahihKitabFile[] = [];
  const byNumber = new Map<number, SahihHadith>();
  const sorted = [...heads].sort((a, b) => a.at - b.at);
  let h = 0;
  for (const c of cuts) {
    while (h < sorted.length && sorted[h].at <= c.start) {
      const head = sorted[h++];
      if (head.level === 1) {
        // Two kitab headings with no hadith between them (a part's title, then its first kitab): the later one names it.
        if (kitabs.length && !kitabs[kitabs.length - 1].from) { kitabs[kitabs.length - 1].title = head.title; continue; }
        kitabs.push({ n: kitabs.length + 1, title: head.title, from: 0, to: 0, babs: [] });
        files.push({ n: kitabs.length, said: [], hadith: [] });
      }
      else {
        if (!kitabs.length) continue;
        const nextAt = Math.min(sorted[h]?.at ?? book.length, c.start);
        const said = clean(book.slice(Math.ceil(head.at), nextAt)).replace(head.title, '').replace(/^\([٠-٩]+\)\s*\.?\s*/, '').trim();
        kitabs[kitabs.length - 1].babs.push({ title: head.title, from: 0, to: 0 });
        files[files.length - 1].said.push(said);
      }
    }
    const kitab = kitabs[kitabs.length - 1];
    const file = files[files.length - 1];
    if (!kitab) throw new Error(`hadith ${c.n} before the first kitab`);
    if (!kitab.babs.length) { kitab.babs.push({ title: '', from: 0, to: 0 }); file.said.push(''); }
    const bab = kitab.babs[kitab.babs.length - 1];
    const end = Math.min(c.end, sorted[h]?.at ?? book.length);
    const piece = cut(book, c.start, Math.ceil(end));
    // The number heading the text («٨ - », «١٩ - (١٦) ») is shown apart from it.
    // The next number's digits can stay at the end, after the closing mark («… إِلَيْهِ». ٢»): they are its head, not this text.
    // A bab heading the table of contents places after its first word leaves «بَابُ» at the end of the hadith before it.
    const text = piece.text.replace(/\s+بَ?ا?بٌ?ُ?:?$/, '').replace(/([».،:؟])\s*[٠-٩]+(?:\s*-\s*[٠-٩]+)*\s*-?$/, '$1').replace(/^[٠-٩]+(?: \(م\))?(?:(?: ?- ?| )[٠-٩]+)* ?-?(?: ?[٠-٩]+ ?-?)*\s*/, '').replace(/^(?:[٠-٩]+ ?)?(?:- )?(?:٠ )?(?:م(?: [٠-٩]+)? ?)?(?:- )?\([٠-٩]+(?:\/ ?[٠-٩]+)?\)(?: -)?\s*/, '');
    const route: SahihRoute = { ...(c.route ? { route: c.route } : {}), ...(piece.chain ? { chain: piece.chain } : {}), text, volume: piece.volume, pages: piece.pages, shamela: piece.shamela };
    const earlier = muslim ? byNumber.get(c.n) : undefined;
    if (earlier) { earlier.routes.push(route); continue; }
    const hadith: SahihHadith = { n: c.n, ...(c.also?.length ? { also: c.also } : {}), bab: kitab.babs.length - 1, routes: [route] };
    file.hadith.push(hadith);
    byNumber.set(c.n, hadith);
    for (const span of [kitab, bab]) {
      span.from = span.from ? Math.min(span.from, c.n) : c.n;
      span.to = Math.max(span.to, c.n);
    }
  }
  for (const route of files.flatMap(f => f.hadith).flatMap(x => x.routes)) {
    const quote = route.text.search(/[«"]/);
    if (quote > 0) route.isnadEnd = quote;
  }
  return { index: { ...meta, kitabs }, files };
}

function write(built: Built) {
  const slug = built.index.slug;
  writeFileSync(`shared/data/hadith/${slug}.json`, `${JSON.stringify(built.index)}\n`);
  mkdirSync('data/hadith/sahih', { recursive: true });
  writeFileSync(`data/hadith/sahih/${slug}.json`, `${JSON.stringify({ kitabs: built.files } satisfies SahihText)}\n`);
}

export function buildBukhari() {
  const book = joined(load(BOOKS.bukhari.id));
  const entries = toc(BOOKS.bukhari.id).filter(e => e.level <= 3);
  // Before «بدء الوحي» stand the print's reports and the correctors' foreword, not al-Bukhari's book.
  const startAt = entries.findIndex(e => /بدء الوحي/.test(e.title));
  const isKitab = (e: TocEntry) => e.level === 1;
  const heads = headings(book, entries.slice(startAt), isKitab);
  const marks = bukhariMarks(book, heads[0].at, 7563, JSON.parse(readFileSync('data/hadith/bukhari-numbers.json', 'utf8')));
  const cuts = marks.map((m, i) => ({ start: m.at, end: marks[i + 1]?.at ?? book.length, n: m.n, also: m.also }));
  return assemble(book, heads, cuts, { slug: 'bukhari', title: BOOKS.bukhari.title, author: 'محمد بن إسماعيل البخاري', died: 256, edition: BOOKS.bukhari.edition, shamela: BOOKS.bukhari.id, headingsBy: 'author' }, false);
}

export function buildMuslim() {
  const book = joined(load(BOOKS.muslim.id));
  const entries = toc(BOOKS.muslim.id);
  // Muslim's own introduction comes first: Abd al-Baqi numbers its reports 1–7, before «كتاب الإيمان» opens at 8.
  const startAt = entries.findIndex(e => /مقدمة المصنف/.test(e.title));
  const isKitab = (e: TocEntry) => e.level === 1;
  const heads = headings(book, entries.slice(startAt), isKitab).map(head => ({ ...head, title: head.level === 1 ? head.title.replace(/^[٠-٩]+ ?- ?/, '').replace(/^مقدمة المصنف$/, 'المقدمة') : head.title.replace(/^\([٠-٩]+\) ?/, '').replace(/^[٠-٩]+ ?- ?/, '') }));
  const routes = muslimMarks(book, heads[0].at, 3033, JSON.parse(readFileSync('data/hadith/muslim-numbers.json', 'utf8')));
  const cuts = routes.map((r, i) => ({ start: r.at, end: routes[i + 1]?.at ?? book.length, n: r.n, route: r.label, also: r.also }));
  return assemble(book, heads, cuts, { slug: 'muslim', title: BOOKS.muslim.title, author: 'مسلم بن الحجاج النيسابوري', died: 261, edition: BOOKS.muslim.edition, shamela: BOOKS.muslim.id, headingsBy: 'nawawi' }, true);
}

if (process.argv[1]?.endsWith('buildSahihayn.ts')) {
  write(buildBukhari());
  write(buildMuslim());
}
