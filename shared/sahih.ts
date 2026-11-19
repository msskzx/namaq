/**
 * Sahih al-Bukhari and Sahih Muslim whole (scripts/hadith/buildSahihayn.ts): a small index of each book's kitabs and babs
 * that ships with the app, and each kitab's hadith in its own file, read on the website and downloaded once on the phone.
 */
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
