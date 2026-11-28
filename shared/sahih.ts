import { normalizeWord } from './quran/normalize';
import { bareHadith } from './hadith';

export type SahihSlug = 'bukhari' | 'muslim';

export interface SahihBab {
  title: string;
  from: number;
  to: number;
}

export interface SahihKitab { n: number; title: string; from: number; to: number; babs: SahihBab[] }

export interface SahihBook {
  slug: SahihSlug;
  title: string;
  author: string;
  died: number;
  edition: string;
  shamela: number;
  headingsBy: 'author' | 'nawawi';
}

export interface SahihIndex extends SahihBook { kitabs: SahihKitab[] }

export interface SahihRoute {
  route?: string;
  chain?: { name: string; mode: string }[];
  text: string;
  isnadEnd?: number;
  volume: number;
  pages: number[];
  shamela: number;
}

export interface SahihHadith {
  n: number;
  also?: number[];
  bab: number;
  routes: SahihRoute[];
}

export interface SahihKitabFile { n: number; said: string[]; hadith: SahihHadith[] }

export interface SahihText { kitabs: SahihKitabFile[] }

export const kitabOf = (index: SahihIndex, n: number) => index.kitabs.find(kitab => n >= kitab.from && n <= kitab.to);

export function placeOf(index: SahihIndex, n: number): { kitab: SahihKitab; bab?: SahihBab } | undefined {
  const kitab = kitabOf(index, n);
  if (!kitab) return undefined;
  return { kitab, bab: kitab.babs.find(bab => bab.from && n >= bab.from && n <= bab.to) };
}

export function findHadith(text: SahihText, n: number): { file: SahihKitabFile; hadith: SahihHadith } | undefined {
  for (const file of text.kitabs) {
    const hadith = file.hadith.find(item => item.n === n || item.also?.includes(n));
    if (hadith) return { file, hadith };
  }
  return undefined;
}

export const splitRoute = (route: SahihRoute) => ({ chain: route.text.slice(0, route.isnadEnd ?? 0), words: route.text.slice(route.isnadEnd ?? 0) });

export const lastLink = (route: SahihRoute) => {
  const link = route.chain?.[route.chain.length - 1];
  return link ? `${link.mode} ${link.name}`.trim() : undefined;
};

export const sahihName = (book: Pick<SahihBook, 'title'>, n: number, digits: (n: number) => string, route?: string) =>
  `${book.title} ${digits(n)}${route ? ` (${route})` : ''}`;

export const plainText = (text: string) => normalizeWord(text).replace(/[^ء-ي\s]/g, ' ').replace(/\s+/g, ' ').trim();

const plains = new WeakMap<SahihRoute, string>();
const plainOf = (route: SahihRoute) => {
  let plain = plains.get(route);
  if (plain === undefined) plains.set(route, plain = plainText(route.text));
  return plain;
};

const headings = new WeakMap<object, string>();
const headingOf = (kitab: { title: string }, bab: { title: string }) => {
  let plain = headings.get(bab);
  if (plain === undefined) headings.set(bab, plain = plainText(`${kitab.title} ${bab.title}`));
  return plain;
};

export interface SahihHit { book: SahihSlug; n: number; kitab: number; bab?: number; at?: number }

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

export const bookOf = ({ slug, title, author, died, edition, shamela, headingsBy }: SahihIndex): SahihBook => ({ slug, title, author, died, edition, shamela, headingsBy });

const PROPHET = /(?:^|[\s،:])(?:عن|أن|ان|إن|سمعت|سمع|قال|فقال|وقال) (?:رسول الله|رسول اللّه|النبي|نبي الله|أبا القاسم|ابا القاسم|أبو القاسم) ?ﷺ/g;
const SAYING_ONLY = /^[\s،,]*(وهو\s+)?(ف?قال|ف?يقول)?\s*:?\s*$/;

export interface ChainLink { name: string; mode: string }

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

export function leadIn(chainText: string, links: readonly ChainLink[]): { lead: string; prophet?: string } | undefined {
  const rest = chainRest(chainText, links);
  if (rest === undefined) return undefined;
  const text = rest.replace(/^[\s،,.:؛]+/, '').trim();
  const shown = (part: string) => (/\p{L}/u.test(part) ? part : '');
  let plain = '';
  const at: number[] = [];
  for (let i = 0; i < text.length; i++) if (bare(text[i])) { plain += text[i]; at.push(i); }
  const mention = [...plain.matchAll(PROPHET)].pop();
  if (!mention || !SAYING_ONLY.test(plain.slice(mention.index! + mention[0].length))) return { lead: shown(text) };
  const split = at[mention.index! + (/[\s،:]/.test(plain[mention.index!]) ? 1 : 0)];
  const lead = shown(text.slice(0, split).replace(/[\s،,]+$/, '').trim());
  return { lead, prophet: text.slice(split).trim() };
}
const bare = bareHadith;
