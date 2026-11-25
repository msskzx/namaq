// A hadith on a person's page in the Sahih's words (owner, 2026-11-25): where the Siyar's editor says in his note that
// al-Bukhari or Muslim gives the report («أخرجه البخاري (٤٠٥٨)»), the fact is shown as the Sahih prints it, the route
// closest to the Siyar's words open and the others the note names closed under it; al-Dhahabi's page stays its reference.
import { readFileSync } from 'node:fs';
import { chainRest, findHadith, plainText, type SahihRoute, type SahihText } from '@shared/sahih';
import type { SahihQuote } from '@shared/tarajim';
import { loadStorePage } from '../history/sourceStore';
import type { SahihBook } from '../catalog/sahihText';
import { locateSpanRecord } from './render';
import type { WorkFolder } from './types';

const books = new Map<SahihBook, SahihText>();
const book = (name: SahihBook) => {
  if (!books.has(name)) books.set(name, JSON.parse(readFileSync(`data/hadith/sahih/${name}.json`, 'utf8')) as SahihText);
  return books.get(name)!;
};

const DIGITS = '٠١٢٣٤٥٦٧٨٩';
const number = (text: string) => Number(text.replace(/[٠-٩]/g, (d) => String(DIGITS.indexOf(d))));
const arabic = (n: number) => String(n).replace(/\d/g, (d) => DIGITS[Number(d)]);
/** A footnote mark in the page's text: «(٣)». */
const MARK = /\(\s*([٠-٩0-9]+)\s*\)/g;

/**
 * Note k of a page. The notes run «(١) … (٢) …» in order, and a note gives hadith numbers in the same brackets
 * («البخاري (٤٠٥٨)»), so each is found after the one before it.
 */
export function noteOf(notes: string, k: number) {
  let at = -1;
  for (let i = 1; i <= k; i++) {
    at = notes.indexOf(`(${arabic(i)})`, at + 1);
    if (at < 0) return '';
  }
  const end = notes.indexOf(`(${arabic(k + 1)})`, at + 1);
  return notes.slice(at, end < 0 ? undefined : end);
}

const OTHER_BOOKS = /^[\s،.]*و?\s*(?:مسلم|البخاري|أحمد|أبو داود|الترمذي|النسائي|ابن ماجه|ابن سعد|الحاكم|الطبراني|مالك|البيهقي|الدارمي|ابن حبان|عبد الرزاق|ابن أبي شيبة)/;
/** The numbers a note gives for a book: «البخاري (٤٠٥٨) و (٤٠٥٩)», up to the next book it names. */
export function noteNumbers(note: string, name: 'البخاري' | 'مسلم') {
  const out: number[] = [];
  for (const found of note.matchAll(new RegExp(name, 'g'))) {
    let rest = note.slice(found.index! + found[0].length);
    for (;;) {
      const next = rest.match(/^[\s،]*(?:و\s*)?(?:رقم\s*)?\(\s*([٠-٩0-9]+)\s*\)/);
      if (!next) break;
      out.push(number(next[1]));
      rest = rest.slice(next[0].length);
      if (OTHER_BOOKS.test(rest)) break;
    }
  }
  return out;
}

/** Letters only, vowels and hamza seats set aside: the Siyar's «رَسُوْلِ» and the Sahih's «رَسُولِ» are one word. */
const fold = (word: string) => plainText(word).replace(/\s/g, '');
const words = (text: string) => [...text.matchAll(/\S+/g)].map((m) => ({ word: fold(m[0]), start: m.index!, end: m.index! + m[0].length })).filter((w) => w.word);

/** The longest run of the fact's words found in order in the route, and where in the route it lies. */
function match(fact: string, route: string) {
  const a = words(fact).map((w) => w.word);
  const b = words(route);
  const n = a.length;
  const m = b.length;
  if (!n || !m) return undefined;
  const table = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) table[i][j] = a[i] === b[j].word ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const pairs: number[] = [];
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] === b[j].word) { pairs.push(j); i++; j++; } else if (table[i + 1][j] >= table[i][j + 1]) i++; else j++;
  }
  if (!pairs.length) return undefined;
  // The words that sit together: a run broken by more than eight of the route's words is two places.
  let best = [0, 0];
  for (let from = 0, k = 1; k <= pairs.length; k++) {
    if (k === pairs.length || pairs[k] - pairs[k - 1] > 8) {
      if (k - from > best[1] - best[0]) best = [from, k];
      from = k;
    }
  }
  return { share: (best[1] - best[0]) / n, start: b[pairs[best[0]]].start };
}

// A link's word before its narrator («عَنْ أَنَسٍ»), and the words that may follow a verb of saying in the chain; «حَدَّثَهُ»
// comes after the name it belongs to («أَنَّ عَلِيَّ بْنَ الْحُسَيْنِ حَدَّثَهُ»), so it starts no link.
const FORMULA = /^(?:و?(?:عن|سمعت|سمع|ان|حدثني|حدثنا|اخبرني|اخبرنا|حدثتني|اخبرتني))$/;
const CHAIN = /^(?:و?(?:عن|عنه|سمعت|سمع|ان|انه|انها|حدثني|حدثه|حدثنا|اخبرني|اخبره|اخبرنا|حدثتني|اخبرتني|قرات|قرا|ح))$/;
const SAYS = /^(?:[فو]?(?:قال|قالت)|يقول|تقول|قالا|قالوا|يحدث)$/;
const PROPHET = /^(?:رسول|النبي|لرسول|للنبي)$/;

/**
 * Where a route's last narrator begins («قَالَ: سَمِعْتُ عَلِيًّا يَقُولُ: …»): the chain before it is folded and nothing is
 * left out. With the edition's links, the last link's words. Else the last «عن», «سمعت», «أن»… before the narrator's own
 * words begin: the first verb of saying with no word of the chain in the few words after it, outside the editor's
 * brackets («(قَالَ يَحْيَى: أَخْبَرَنَا)»), and before the Prophet ﷺ is named. Undefined when the chain cannot be told from the words, or
 * none is printed before him (a number's later part).
 */
export function lastNarrator(route: SahihRoute) {
  if (route.chain?.length && route.isnadEnd && chainRest(route.text.slice(0, route.isnadEnd), route.chain) !== undefined) {
    let at = 0;
    let cut = 0;
    for (const link of route.chain) {
      cut = route.text.indexOf(link.mode || link.name, at);
      at = route.text.indexOf(link.name, cut) + link.name.length;
    }
    // A link's words may open with the one before it's verb («يَقُولُ: سَمِعْتُ سَعْدَ»): his own begin at its last «سمعت».
    const mode = route.chain.at(-1)!.mode;
    const own = [...mode.matchAll(/\S+/g)].filter((m) => FORMULA.test(fold(m[0]))).at(-1);
    return cut + (own?.index ?? 0);
  }
  const list = [...route.text.matchAll(/\S+/g)].map((m) => ({ raw: m[0], word: fold(m[0]), start: m.index! }));
  // A word of the chain, not of speech: «إِنَّ» and a word opening a quote are what is said.
  const chainWord = (one?: (typeof list)[number]) => !!one && !/^["“«(]|^إ/.test(one.raw) && CHAIN.test(one.word);
  let last: number | undefined;
  let depth = 0;
  let told = false;
  for (let i = 0; i < list.length; i++) {
    const inside = depth > 0;
    depth += (list[i].raw.match(/\(/g)?.length ?? 0) - (list[i].raw.match(/\)/g)?.length ?? 0);
    if (inside || list[i].raw.startsWith('(')) continue;
    // The chain is told before the Prophet ﷺ is first named; a «عن» after him is in the story.
    if (list[i].raw.includes('ﷺ')) told = true;
    if (!told && FORMULA.test(list[i].word) && !/^إ/.test(list[i].raw) && !PROPHET.test(list[i + 1]?.word ?? '')) last = list[i].start;
    if (SAYS.test(list[i].word) && last !== undefined && ![1, 2, 3].some((k) => chainWord(list[i + k]))) return last > 0 ? last : undefined;
  }
  return undefined;
}

const SHARE_OPEN = 0.6;
const SHARE_OTHER = 0.4;

export interface SahihMatch { book: SahihBook; n: number; route: number; share: number; start: number }

/** Each route of a hadith number, scored against the fact's words; the best of them. */
function bestRoute(name: SahihBook, n: number, fact: string): SahihMatch | undefined {
  const found = findHadith(book(name), n);
  if (!found) return undefined;
  let best: SahihMatch | undefined;
  found.hadith.routes.forEach((route, index) => {
    // A route whose chain cannot be told apart (a number's later part, printed with no chain of its own) is not shown:
    // its words would read with no narrator, or the chain as his words.
    if (lastNarrator(route) === undefined) return;
    const scored = match(fact, route.text);
    if (scored && (!best || scored.share > best.share)) best = { book: name, n, route: index, share: scored.share, start: scored.start };
  });
  return best;
}

/** A route as the person page shows it: its chain folded, the last narrator on and the words, and where it is printed. */
export function quoteOf(found: SahihMatch): SahihQuote {
  const hadith = findHadith(book(found.book), found.n)!.hadith;
  const route = hadith.routes[found.route];
  const cut = lastNarrator(route)!;
  return {
    book: found.book, n: found.n, ...(route.route && { route: route.route }),
    isnad: route.text.slice(0, cut).trim(), words: route.text.slice(cut).trim(),
    volume: route.volume, pages: route.pages, shamela: route.shamela,
  };
}

export interface NoteFinding { fact: string; note: string; numbers: { book: SahihBook; n: number; share?: number }[]; open?: SahihMatch; others: SahihMatch[] }

/**
 * A fact's hadith in the Sahih: the editor's note after its words on the page, every number it gives for al-Bukhari and
 * Muslim, each scored by how many of the fact's words its best route holds. The best opens when it holds most of them;
 * the others the note names that hold enough of them follow it.
 */
export function sahihOfFact(folder: WorkFolder, spans: WorkFolder['units'][number]['spans'], fact: string, root: string): NoteFinding[] {
  const out: NoteFinding[] = [];
  const seen = new Set<string>();
  for (const span of spans) {
    if (span.layer !== 'MAIN') continue;
    let at;
    try { at = locateSpanRecord(folder, span, root); } catch { continue; }
    // The first mark at or after the span's last word: the editor's note on the report it ends.
    const mark = [...at.body.matchAll(MARK)].find((m) => m.index! >= at.end - 1) ?? undefined;
    if (!mark) continue;
    const witness = folder.witnesses.find((w) => w.edition === span.edition) ?? folder.witnesses[0];
    const key = `${span.volume}/${span.page}/${number(mark[1])}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const note = noteOf(loadStorePage(root, witness.slug, span.volume, span.page)?.notes ?? '', number(mark[1]));
    const numbers = [
      ...noteNumbers(note, 'البخاري').map((n) => ({ book: 'bukhari' as const, n })),
      ...noteNumbers(note, 'مسلم').map((n) => ({ book: 'muslim' as const, n })),
    ].filter((one, i, all) => all.findIndex((other) => other.book === one.book && other.n === one.n) === i);
    if (!numbers.length) continue;
    const scored = numbers.map((one) => ({ ...one, match: bestRoute(one.book, one.n, fact) }));
    const ranked = scored.flatMap((one) => (one.match ? [one.match] : [])).sort((a, b) => b.share - a.share);
    const open = ranked[0] && ranked[0].share >= SHARE_OPEN ? ranked[0] : undefined;
    out.push({
      fact, note: key,
      numbers: scored.map((one) => ({ book: one.book, n: one.n, ...(one.match && { share: Math.round(one.match.share * 100) / 100 }) })),
      ...(open && { open }),
      others: open ? ranked.slice(1).filter((one) => one.share >= SHARE_OTHER) : [],
    });
  }
  return out;
}
