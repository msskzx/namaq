/**
 * Sahih al-Bukhari and Sahih Muslim whole (scripts/hadith/buildSahihayn.ts): a small index of each book's kitabs and babs
 * that ships with the app, and each kitab's hadith in its own file, read on the website and downloaded once on the phone.
 */
import { normalizeWord } from './quran/normalize';
import { bareHadith } from './hadith';

export type SahihSlug = 'bukhari' | 'muslim';

export interface SahihBab {
  /** The bab heading as printed: al-Bukhari's own words; in Muslim, al-Nawawi's (see SahihIndex.headingsBy). Empty when the kitab opens with no bab. */
  title: string;
  /** The first and last hadith numbers under the bab; 0 when it has none. */
  from: number;
  to: number;
}

export interface SahihKitab { n: number; title: string; from: number; to: number; babs: SahihBab[] }

export interface SahihBook {
  slug: SahihSlug;
  title: string;
  author: string;
  /** The year the author died (AH). */
  died: number;
  edition: string;
  /** The book's id on Shamela (and turath.io). */
  shamela: number;
  /** Who wrote the bab headings: the author himself (al-Bukhari), or al-Nawawi (Muslim, as Abd al-Baqi prints them). */
  headingsBy: 'author' | 'nawawi';
}

export interface SahihIndex extends SahihBook { kitabs: SahihKitab[] }

/** One printed text of a hadith: in Muslim each route under the number, labelled as printed («٤١» or «م ٢»). */
export interface SahihRoute {
  route?: string;
  /** The narrators before the words, each after the word he narrated with, when the edition's links make the chain plain (one line, no ح). */
  chain?: { name: string; mode: string }[];
  text: string;
  /** Where the words begin: the first quote mark, when the chain comes before it. */
  isnadEnd?: number;
  volume: number;
  pages: number[];
  shamela: number;
}

export interface SahihHadith {
  n: number;
  /** Abd al-Baqi's other numbers for the same printed record («٦٠٧٣ - ٦٠٧٤ - ٦٠٧٥»). */
  also?: number[];
  /** The bab it sits under, by its place in the kitab's babs. */
  bab: number;
  routes: SahihRoute[];
}

/** A kitab's text, in its own file: what is printed under each bab heading before its first hadith (al-Bukhari's ayat and reports), by bab, and its hadith. */
export interface SahihKitabFile { n: number; said: string[]; hadith: SahihHadith[] }

/** A whole book's text: each kitab's file, in order (data/hadith/sahih/<book>.json). */
export interface SahihText { kitabs: SahihKitabFile[] }

/** The kitab a hadith number sits in. */
export const kitabOf = (index: SahihIndex, n: number) => index.kitabs.find(kitab => n >= kitab.from && n <= kitab.to);

/** Where a hadith number sits: its kitab and bab in the index. */
export function placeOf(index: SahihIndex, n: number): { kitab: SahihKitab; bab?: SahihBab } | undefined {
  const kitab = kitabOf(index, n);
  if (!kitab) return undefined;
  return { kitab, bab: kitab.babs.find(bab => bab.from && n >= bab.from && n <= bab.to) };
}

/** A hadith (or a number Abd al-Baqi gives the same printed record) in a book's text, with its kitab's file. */
export function findHadith(text: SahihText, n: number): { file: SahihKitabFile; hadith: SahihHadith } | undefined {
  for (const file of text.kitabs) {
    const hadith = file.hadith.find(item => item.n === n || item.also?.includes(n));
    if (hadith) return { file, hadith };
  }
  return undefined;
}

/** The chain as the edition prints it before the words, and the words: the matn starts at the first quote mark. */
export const splitRoute = (route: SahihRoute) => ({ chain: route.text.slice(0, route.isnadEnd ?? 0), words: route.text.slice(route.isnadEnd ?? 0) });

/** «عَنِ ابْنِ عُمَرَ»: the last link of a plain chain as printed, the narrator the words come from. */
export const lastLink = (route: SahihRoute) => {
  const link = route.chain?.[route.chain.length - 1];
  return link ? `${link.mode} ${link.name}`.trim() : undefined;
};

/** «صحيح البخاري ٨» or «صحيح مسلم ١٦ (١٩)»: a hadith's (or a route's) short reference. */
export const sahihName = (book: Pick<SahihBook, 'title'>, n: number, digits: (n: number) => string, route?: string) =>
  `${book.title} ${digits(n)}${route ? ` (${route})` : ''}`;

/** Text without marks, hamzas folded and punctuation set aside, for search. */
export const plainText = (text: string) => normalizeWord(text).replace(/[^ء-ي\s]/g, ' ').replace(/\s+/g, ' ').trim();

const plains = new WeakMap<SahihRoute, string>();
/** A route's text for search, worked out once per route: a search runs on every letter typed. */
const plainOf = (route: SahihRoute) => {
  let plain = plains.get(route);
  if (plain === undefined) plains.set(route, plain = plainText(route.text));
  return plain;
};

const headings = new WeakMap<object, string>();
/** A bab's kitab and heading for search, worked out once per bab, as `plainOf` does for the hadith. */
const headingOf = (kitab: { title: string }, bab: { title: string }) => {
  let plain = headings.get(bab);
  if (plain === undefined) headings.set(bab, plain = plainText(`${kitab.title} ${bab.title}`));
  return plain;
};

export interface SahihHit { book: SahihSlug; n: number; kitab: number; bab?: number; at?: number }

/**
 * Every bab heading, then every hadith, holding all the words typed, marks and hamzas set aside. Babs come from the
 * index (on the phone always); hadith only from the books whose text is at hand.
 */
export function searchSahih(books: { index: SahihIndex; text?: SahihText | null }[], query: string, limit = Infinity): { babs: SahihHit[]; hadith: SahihHit[] } {
  const words = plainText(query).split(' ').filter(Boolean);
  const babs: SahihHit[] = [];
  const hadith: SahihHit[] = [];
  if (!words.length) return { babs, hadith };
  const holds = (hay: string) => words.every(word => hay.includes(word));
  for (const { index, text } of books) {
    for (const kitab of index.kitabs) kitab.babs.forEach((bab, i) => {
      if (babs.length < limit && bab.title && holds(headingOf(kitab, bab))) babs.push({ book: index.slug, n: bab.from, kitab: kitab.n, bab: i });
    });
    for (const file of text?.kitabs ?? []) for (const item of file.hadith) {
      if (hadith.length >= limit) break;
      if (item.routes.some(route => holds(plainOf(route)))) hadith.push({ book: index.slug, n: item.n, kitab: file.n, bab: item.bab });
    }
  }
  return { babs, hadith };
}

/**
 * A book page's search (owner, 2026-11-23: sketch hadith-design): the kitabs whose name holds every word typed, with no babs
 * listed, and the kitabs with bab headings that do, with those babs (by their place in the kitab).
 */
export function kitabsHolding(index: SahihIndex, query: string): Map<number, number[]> {
  const words = plainText(query).split(' ').filter(Boolean);
  const found = new Map<number, number[]>();
  if (!words.length) return found;
  for (const kitab of index.kitabs) if (words.every(word => plainText(kitab.title).includes(word))) found.set(kitab.n, []);
  for (const hit of searchSahih([{ index }], query).babs) {
    const babs = found.get(hit.kitab);
    if (!babs) found.set(hit.kitab, [hit.bab ?? 0]);
    else if (babs.length) babs.push(hit.bab ?? 0);
  }
  return found;
}

/** A book's title, author and edition without its kitabs, for a page or card that shows one hadith (the index stays behind). */
export const bookOf = ({ slug, title, author, died, edition, shamela, headingsBy }: SahihIndex): SahihBook => ({ slug, title, author, died, edition, shamela, headingsBy });

/**
 * The Prophet ﷺ named before his words, as the editions print him, after a word that makes him the one speaking or
 * heard from («عَنِ النَّبِيِّ ﷺ», «أَنَّ رَسُولَ اللهِ ﷺ», «سَمِعْتُ أَبَا الْقَاسِمِ ﷺ»); never «زَوْجِ النَّبِيِّ ﷺ».
 */
const PROPHET = /(?:^|[\s،:])(?:عن|أن|ان|إن|سمعت|سمع|قال|فقال|وقال) (?:رسول الله|رسول اللّه|النبي|نبي الله|أبا القاسم|ابا القاسم|أبو القاسم) ?ﷺ/g;
/** What may stand between his name and his words: his verb of saying only («، يَقُولُ:», «قَالَ:»). */
const SAYING_ONLY = /^[\s،,]*(وهو\s+)?(ف?قال|ف?يقول)?\s*:?\s*$/;

export interface ChainLink { name: string; mode: string }

/**
 * The printed chain after its drawn links: each link's words and name found in order, with nothing but punctuation
 * between them, so the drawing leaves out no word of the text and adds none (owner 2026-11-24: «لا تحذف ولا كلمة»).
 * Undefined when a word of the chain is in no link: that chain is shown as text, never drawn.
 */
export function chainRest(chainText: string, links: readonly ChainLink[]): string | undefined {
  let at = 0;
  for (const part of links.flatMap(link => [link.mode, link.name])) {
    if (!part) continue;
    const found = chainText.indexOf(part, at);
    if (found < 0 || /\p{L}/u.test(chainText.slice(at, found))) return undefined;
    at = found + part.length;
  }
  return chainText.slice(at);
}

/**
 * The printed words between the drawn chain and the saying (owner 2026-11-24, sketch hadith-design/sketch4): every word
 * after the last narrator's name, «رضي الله عنه», his own «قَالَ» and what he tells among them, for what a narrator tells
 * is the hadith's text and never the line; and apart from it the Prophet ﷺ named just before his words («سَمِعْتُ رَسُولَ
 * اللهِ ﷺ، يَقُولُ:»), when nothing but his verb of saying stands between his name and the words. Undefined when the chain
 * cannot be drawn whole (chainRest).
 */
export function leadIn(chainText: string, links: readonly ChainLink[]): { lead: string; prophet?: string } | undefined {
  const rest = chainRest(chainText, links);
  if (rest === undefined) return undefined;
  const text = rest.replace(/^[\s،,.:؛]+/, '').trim();
  const shown = (part: string) => (/\p{L}/u.test(part) ? part : '');
  // Vowels set aside to find his name, each bare letter keeping its place in the printed text.
  let plain = '';
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) if (bare(text[i])) { plain += text[i]; at.push(i); }
  const mention = [...plain.matchAll(PROPHET)].pop();
  if (!mention || !SAYING_ONLY.test(plain.slice(mention.index! + mention[0].length))) return { lead: shown(text) };
  // His clause starts at the word before his name («…عَلَى الْمِنْبَرِ، قَالَ: | سَمِعْتُ رَسُولَ اللهِ ﷺ»).
  const split = at[mention.index! + (/[\s،:]/.test(plain[mention.index!]) ? 1 : 0)];
  const lead = shown(text.slice(0, split).replace(/[\s،,]+$/, '').trim());
  return { lead, prophet: text.slice(split).trim() };
}
const bare = bareHadith;
