// The surah-order books on the compare pages (owner, 2026-11-20): each link of /quran/order that names an ayah on both
// sides becomes a book card «في كتب تناسب السور» holding exactly those ayat, its quote and its reference; a link that names
// no ayah pair is a note at the top of its two surahs' page, never tied to an ayah. docs/plans/quran-compare-page.md
import { BOOKS, citeLabel, citeUrl, ORDER_LINKS, type Link } from './surahOrder';
import { num } from './arabicNumber';
import type { QuizSource } from '../quiz/sources';
import type { PhraseOccurrence } from './phraseTrees';
import treeData from '../data/quran/tanasubTrees.json';

/** The heading a book card carries (owner, 2026-11-20). */
export const TANASUB_KIND = 'في كتب تناسب السور';

/** A link that names ayah pairs: `link` is its key in ORDER_LINKS (the surah it leads into), `pairs` lower surah first. */
export type TanasubLink = { link: number; a: number; b: number; pairs: [string, string][] };

const surahOf = (key: string) => Number(key.split(':')[0]);

/** Every link that names an ayah on both sides, by the two surahs its ayat are in (al-Kafirun and al-Ikhlas for the link into 112). */
export const TANASUB_LINKS: TanasubLink[] = Object.entries(ORDER_LINKS)
  .filter(([, link]) => link.pairs.length)
  .map(([key, link]) => ({ link: Number(key), a: surahOf(link.pairs[0][0]), b: surahOf(link.pairs[0][1]), pairs: link.pairs }));

export const tanasubLink = (key: number): Link | undefined => ORDER_LINKS[key];

/** The links of two surahs that name ayah pairs. */
export const tanasubLinksFor = (x: number, y: number) => TANASUB_LINKS.filter(item => item.a === Math.min(x, y) && item.b === Math.max(x, y));

/**
 * The note on a page of two neighbouring surahs: the link into the later one, when it names no ayah pair (those are cards).
 * It is the same quote /quran/order shows between the two surahs.
 */
export function pairNote(x: number, y: number): Link | undefined {
  const [a, b] = [Math.min(x, y), Math.max(x, y)];
  const link = ORDER_LINKS[b];
  return b === a + 1 && link && !link.pairs.length ? link : undefined;
}

/** A link as a source line entry: the book and its author, the quote, and the page it cites with its Shamela link. */
export function tanasubSource(link: Link): QuizSource {
  const { title, short } = BOOKS[link.src.book];
  return { book: title.split('، ل')[0], author: short.split('،')[0], quote: link.text, at: citeLabel(link.src, num), url: citeUrl(link.src) };
}

const trees = (treeData as unknown as { trees: Record<string, [PhraseOccurrence, PhraseOccurrence]> }).trees;

/**
 * The trunk of a book card's tree on each side, or undefined when the card has no meaningful tree (owner 2026-11-20: several
 * pairs, or ayat the book joins by meaning only). Written by `npm run quran:compare-cards` (buildCards.ts tanasubTrees).
 */
export const tanasubTree = (key: number): [PhraseOccurrence, PhraseOccurrence] | undefined => trees[key];
