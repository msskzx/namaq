// One hadith text (owner, 2026-11-24): a sira story keeps no copy of a Sahih hadith's words, only where they are in it.
// The words come from data/hadith/sahih, the one text, when the catalog loads.
import { readFileSync } from 'node:fs';
import { findHadith, type SahihText } from '@shared/sahih';

export type SahihBook = 'bukhari' | 'muslim';
/** The catalog's source slug for each book. */
export const SAHIH_SOURCE: Record<SahihBook, string> = { bukhari: 'sahih-al-bukhari', muslim: 'sahih-muslim' };

/** The sha256 (first 16) of each book's file when the catalog's positions were taken (catalogRules.test.ts). */
export const ANCHORED: Record<SahihBook, string> = { bukhari: '5ef8ef5097b7423d', muslim: 'e7b6be75d70e54d1' };

const books = new Map<SahihBook, SahihText>();
const book = (name: SahihBook) => {
  if (!books.has(name)) books.set(name, JSON.parse(readFileSync(`data/hadith/sahih/${name}.json`, 'utf8')) as SahihText);
  return books.get(name)!;
};

/** A hadith's whole text as data/hadith/sahih holds it: its routes, each chain and words, joined by one space. */
export function hadithText(name: SahihBook, n: number): string {
  const found = findHadith(book(name), n);
  if (!found) throw new Error(`no hadith ${name} ${n} in data/hadith/sahih`);
  return found.hadith.routes.map(route => route.text).join(' ');
}

/** The words of a Sahih hadith from character `from` up to `to`, as a story quotes them («بَيْنَا النَّبِيُّ ﷺ سَاجِدٌ…»). */
export function sahih(name: SahihBook, n: number, from: number, to: number): string {
  const text = hadithText(name, n);
  if (!(Number.isInteger(from) && Number.isInteger(to) && 0 <= from && from < to && to <= text.length)) throw new Error(`${name} ${n}: ${from}-${to} is outside its ${text.length} characters`);
  return text.slice(from, to);
}
