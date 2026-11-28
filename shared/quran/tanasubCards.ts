// see docs/plans/quran-compare-page.md
import { BOOKS, citeLabel, citeUrl, ORDER_LINKS, type Link } from './surahOrder';
import { num } from './arabicNumber';
import type { QuizSource } from '../quiz/sources';
import type { PhraseOccurrence } from './phraseTrees';
import treeData from '../data/quran/tanasubTrees.json';

export const TANASUB_KIND = 'في كتب تناسب السور';

export type TanasubLink = { link: number; a: number; b: number; pairs: [string, string][] };

const surahOf = (key: string) => Number(key.split(':')[0]);

export const TANASUB_LINKS: TanasubLink[] = Object.entries(ORDER_LINKS)
  .filter(([, link]) => link.pairs.length)
  .map(([key, link]) => ({ link: Number(key), a: surahOf(link.pairs[0][0]), b: surahOf(link.pairs[0][1]), pairs: link.pairs }));

export const tanasubLink = (key: number): Link | undefined => ORDER_LINKS[key];

export const tanasubLinksFor = (x: number, y: number) => TANASUB_LINKS.filter(item => item.a === Math.min(x, y) && item.b === Math.max(x, y));

export function pairNote(x: number, y: number): Link | undefined {
  const [a, b] = [Math.min(x, y), Math.max(x, y)];
  const link = ORDER_LINKS[b];
  return b === a + 1 && link && !link.pairs.length ? link : undefined;
}

export function tanasubSource(link: Link): QuizSource {
  const { title, short } = BOOKS[link.src.book];
  return { book: title.split('، ل')[0], author: short.split('،')[0], quote: link.text, at: citeLabel(link.src, num), url: citeUrl(link.src) };
}

const trees = (treeData as unknown as { trees: Record<string, [PhraseOccurrence, PhraseOccurrence]> }).trees;

export const tanasubTree = (key: number): [PhraseOccurrence, PhraseOccurrence] | undefined => trees[key];
