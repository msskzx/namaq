/**
 * Sahih al-Bukhari and Sahih Muslim whole (scripts/hadith/buildSahihayn.ts): a small index of each book's kitabs and babs
 * that ships with the app, and each kitab's hadith in its own file, read on the website and downloaded once on the phone.
 */
import { normalizeWord } from './quran/normalize';

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

export interface SahihHit { book: SahihSlug; n: number; kitab: number; bab?: number; at?: number }

/**
 * Every bab heading, then every hadith, holding all the words typed, marks and hamzas set aside. Babs come from the
 * index (on the phone always); hadith only from the books whose text is at hand.
 */
export function searchSahih(books: { index: SahihIndex; text?: SahihText | null }[], query: string, limit = 50): { babs: SahihHit[]; hadith: SahihHit[] } {
  const words = plainText(query).split(' ').filter(Boolean);
  const babs: SahihHit[] = [];
  const hadith: SahihHit[] = [];
  if (!words.length) return { babs, hadith };
  const holds = (hay: string) => words.every(word => hay.includes(word));
  for (const { index, text } of books) {
    for (const kitab of index.kitabs) kitab.babs.forEach((bab, i) => {
      if (babs.length < limit && bab.title && holds(plainText(`${kitab.title} ${bab.title}`))) babs.push({ book: index.slug, n: bab.from, kitab: kitab.n, bab: i });
    });
    for (const file of text?.kitabs ?? []) for (const item of file.hadith) {
      if (hadith.length >= limit) break;
      if (item.routes.some(route => holds(plainText(route.text)))) hadith.push({ book: index.slug, n: item.n, kitab: file.n, bab: item.bab });
    }
  }
  return { babs, hadith };
}

/** A book's title, author and edition without its kitabs, for a page or card that shows one hadith (the index stays behind). */
export const bookOf = ({ slug, title, author, died, edition, shamela, headingsBy }: SahihIndex): SahihBook => ({ slug, title, author, died, edition, shamela, headingsBy });
