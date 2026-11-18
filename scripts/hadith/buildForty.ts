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

import type { AppForty, AppIsnad, FortyRecord } from '../../shared/hadith';
import { layoutIsnad } from '../../src/lib/model/isnadGraph';
import { spellSigns } from '../quran/signs';

interface Page { text: string; vol?: string; page?: number }

/** The exports the data was read from (fetched 2026-11-18); a different file stops the build. */
export const BOOKS = {
  nawawi: { id: 12836, title: 'الأربعون النووية', edition: 'دار المنهاج، بيروت، ط١، ١٤٣٠هـ، عناية قصي محمد نورس الحلاق وأنور بن أبي بكر الشيخي' },
  bukhari: { id: 1681, title: 'صحيح البخاري', edition: 'السلطانية، بولاق ١٣١١هـ، مصوّرة دار طوق النجاة ١٤٢٢هـ' },
  muslim: { id: 1727, title: 'صحيح مسلم', edition: 'تحقيق محمد فؤاد عبد الباقي، عيسى البابي الحلبي، القاهرة ١٣٧٤هـ' },
} as const;
const PINS: Record<number, string> = JSON.parse(readFileSync('data/hadith/forty-pins.json', 'utf8'));

function load(id: number): Page[] {
  const path = join(tmpdir(), `turath-${id}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${id}.json`], { maxBuffer: 64 * 1024 * 1024 }));
  const raw = readFileSync(path);
  const sha = createHash('sha256').update(raw).digest('hex');
  if (PINS[id] !== sha) throw new Error(`turath book ${id} changed (sha256 ${sha}); check the records again`);
  return (JSON.parse(raw.toString('utf8')) as { pages: Page[] }).pages;
}

const AR = '٠١٢٣٤٥٦٧٨٩';
const ar = (n: number) => String(n).replace(/\d/g, d => AR[+d]);
const en = (s: string) => Number(s.replace(/[٠-٩]/g, d => String(AR.indexOf(d))));

const RECORD_LINE = /^\s*(?:[٠-٩]+ - |(?:[٠-٩]+ ?)?(?:- )?(?:م(?: [٠-٩]+)? ?)?(?:- )?\([٠-٩]+\)(?: -)?\s|<span data-type="title")/;

/**
 * A page's own text: the notes under a rule (Bukhari's "_____", Muslim's <hr>) go, up to the next record or heading
 * printed after them on the same page; footnote marks and tags go too.
 */
function withoutNotes(text: string): string {
  const [first, ...rest] = text.split(/\n?_{5,}|<hr\s*\/?>/);
  return [first, ...rest.map(part => {
    const lines = part.split('\n');
    const at = lines.findIndex(line => RECORD_LINE.test(line));
    return at < 0 ? '' : lines.slice(at).join('\n');
  })].join('\n');
}

function body(text: string): string {
  return spellSigns(withoutNotes(text))
    .replace(/<span data-type="title"[^>]*>(.*?)<\/span>/g, '\n⟪باب⟫$1\n')
    .replace(/<a href="inr:\/\/man-(\d+)">([^<]*)<\/a>/g, '⁅$1⁆$2⁆')
    .replace(/<[^>]+>/g, '')
    .replace(/\(\^[٠-٩]+\)/g, '')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ');
}

/** The book as one string with a page marker (⟦vol:page⟧) wherever a page starts, so a record knows its pages. */
function joined(pages: Page[]): string {
  return pages.map((p, i) => `⟦${p.vol ?? 1}:${p.page ?? 0}:${i + 1}⟧${body(p.text)}`).join('\n');
}

/** A record from its start to before the next record or chapter: its text without markers, and the pages it spans. */
function cut(book: string, start: number, end: number) {
  const before = /⟦(\d+):(\d+):(\d+)⟧/.exec(book.slice(book.lastIndexOf('⟦', start)));
  const pages = [`${before![1]}:${before![2]}`];
  const raw = book.slice(start, end);
  for (const m of raw.matchAll(/⟦(\d+):(\d+):\d+⟧|⦗([٠-٩]+)⦘/g)) pages.push(m[1] ? `${m[1]}:${m[2]}` : `${pages[0].split(':')[0]}:${en(m[3])}`);
  const marked = raw.replace(/⟦[\d:]*⟧?/g, ' ').replace(/⦗[٠-٩]+⦘/g, ' ').replace(/\s+/g, ' ').replace(/\s+([،.:؛])/g, '$1').trim();
  return { shamela: Number(before![3]), volume: Number(pages[0].split(':')[0]), pages: [...new Set(pages.map(p => Number(p.split(':')[1])))].sort((a, b) => a - b), ...narrated(marked) };
}

const MODES = /(?:^|\s)(?:حدثنا|حدثني|أخبرنا|أخبرني|عن|سمعت|سمع|أنبأنا)[\s:،]*$/;
const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '');
/** The word a narrator narrated with, as printed, when the words before his name end with one. */
const modeOf = (before: string) => (MODES.test(bare(before)) ? before.trim().replace(/[:،]$/, '').split(/\s+/).pop() : undefined);

/**
 * A record's text with Shamela's narrator links taken out, and its chain when the links make it plain: one line of
 * narrators before the first quote mark, each after the word he narrated with, with no ح (a second route) among them.
 */
function narrated(marked: string) {
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

/** Bukhari's record N: from "N - " at a line's start to the next record or chapter heading. */
function bukhariRecord(book: string, n: number) {
  const head = new RegExp(`(?<=^|\\n|⟧)\\s*${ar(n)} - `).exec(book);
  if (!head) throw new Error(`Bukhari ${n} not found`);
  const from = head.index + head[0].length;
  // Some chapter headings are printed as plain text, not marked as titles: a line starting «بَاب», or a Quran heading
  // in the commentary chapters (a line starting «﴿»), ends the record too.
  const next = book.slice(from).search(/(?:^|\n|⟧)\s*(?:[٠-٩]+ - |⟪باب⟫|بَابٌ?[ُ:]? |﴿)/m);
  return { book: 'bukhari', number: n, ...cut(book, head.index, next < 0 ? book.length : from + next) };
}

const ROUTE_HEAD = '((?:[٠-٩]+ ?)?(?:- )?(?:م(?: [٠-٩]+)? ?)?(?:- )?)\\(';
const NEXT_ROUTE = new RegExp(`(?:^|\\n|⟧)\\s*(?:${ROUTE_HEAD}[٠-٩]+\\)(?: -)?\\s|⟪باب⟫)`, 'm');

/**
 * Every route Muslim prints under Abd al-Baqi's number N, each to the next route or chapter heading. A route's head is
 * "k - (N)", "k - م - (N)", "k م - (N)", "k - م 2 - (N)" or a bare "(N) -"; its label is the head as printed.
 */
function muslimRoutes(book: string, n: number, keep?: string[]) {
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
interface MapEntry { n: number; companion: string; named: string[]; errata?: [string, string][]; alsoFrom?: string[]; bukhari?: Ref[]; muslim?: Ref[]; partial?: boolean; note?: string }
const refOf = (ref: Ref) => (typeof ref === 'number' ? { n: ref } : ref);

export function buildForty() {
  const map = JSON.parse(readFileSync('data/hadith/forty-map.json', 'utf8')) as { entries: MapEntry[] };
  const nawawi = nawawiEntries(load(BOOKS.nawawi.id));
  if (nawawi.length !== 42) throw new Error(`al-Nawawi: ${nawawi.length} entries, not 42`);
  const bukhari = joined(load(BOOKS.bukhari.id));
  const muslim = joined(load(BOOKS.muslim.id));
  const entries = nawawi.map(entry => {
    const m = map.entries.find(e => e.n === entry.n);
    if (!m) throw new Error(`al-Nawawi ${entry.n} is not in forty-map.json`);
    const text = (m.errata ?? []).reduce((now, [wrong, right]) => {
      if (!now.includes(wrong)) throw new Error(`al-Nawawi ${entry.n}: erratum «${wrong}» not found`);
      return now.replace(wrong, right);
    }, entry.text);
    return {
      ...entry,
      text,
      companion: m.companion,
      ...(m.alsoFrom ? { alsoFrom: m.alsoFrom } : {}),
      named: m.named,
      ...(m?.partial ? { partial: true } : {}),
      ...(m?.note ? { note: m.note } : {}),
      records: [
        ...(m?.bukhari ?? []).map(refOf).map(r => ({ ...bukhariRecord(bukhari, r.n), ...(r.partial ? { partial: true } : {}) })),
        ...(m?.muslim ?? []).map(refOf).flatMap(r => muslimRoutes(muslim, r.n, r.routes).map(x => ({ ...x, ...(r.partial ? { partial: true } : {}) }))),
      ],
    };
  });
  const books = Object.fromEntries(Object.entries(BOOKS).map(([k, b]) => [k, { shamela: b.id, title: b.title, edition: b.edition, sha256: PINS[b.id] }]));
  return { books, entries };
}

type Built = ReturnType<typeof buildForty>;

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
export function appForty(built: Built): AppForty {
  const { books } = built;
  return {
    books: Object.fromEntries(Object.entries(books).map(([k, b]) => [k, { shamela: b.shamela, title: b.title, edition: b.edition }])) as AppForty['books'],
    entries: built.entries.map(full => {
      const entry = { ...full };
      delete entry.note;
      return {
        ...entry,
        records: entry.records.map((record): FortyRecord => {
          const { chain, ...rest } = record as typeof record & { chain?: { name: string; mode: string }[] };
          const drawn = chain && !entry.partial && !rest.partial;
          return { ...(rest as FortyRecord), ...(drawn ? { isnad: chainIsnad(record.book === 'bukhari' ? 'البخاري' : 'مسلم', chain) } : {}) };
        }),
      };
    }),
  };
}

if (process.argv[1]?.endsWith('buildForty.ts')) {
  const built = buildForty();
  writeFileSync('data/hadith/forty.json', `${JSON.stringify(built, null, 1)}\n`);
  writeFileSync('shared/data/hadith/forty.json', `${JSON.stringify(appForty(built))}\n`);
}
