// docs/plans/quran-shared-openings.md
import { normalizeWord } from './normalize';
import type { ReaderPageData } from './readerPage';

export type BranchAyah = { key: string; page: number; words: string[] };
export type Branch = { words: string[]; ayat: string[]; children: Branch[] };
export type Opening = { id: string; text: string; count: number };

export const OPENING_WORDS = 2;
export const TOP = 8;

export const branchesHref = (id: string) => `/quran/branches?o=${encodeURIComponent(id)}`;

export function readerAyat(pages: ReaderPageData[]): BranchAyah[] {
  const ayat: BranchAyah[] = [];
  let surah = 0;
  let words: string[] = [];
  pages.forEach((data, i) => {
    for (const item of data.items) {
      if ('surah' in item) {
        surah = item.surah;
        continue;
      }
      for (const token of item.line) {
        if (typeof token === 'number') {
          ayat.push({ key: `${surah}:${token}`, page: i + 1, words });
          words = [];
        } else {
          const word = token.split(' ').filter(piece => normalizeWord(piece) !== '').join(' ');
          if (word) words.push(word);
        }
      }
    }
  });
  return ayat;
}

const norm = (ayah: BranchAyah) => ayah.words.map(normalizeWord);

export const openingId = (ayah: BranchAyah) =>
  ayah.words.length < OPENING_WORDS ? null : norm(ayah).slice(0, OPENING_WORDS).join(' ');

export function sharedOpenings(ayat: BranchAyah[]): Map<string, BranchAyah[]> {
  const groups = new Map<string, BranchAyah[]>();
  for (const ayah of ayat) {
    const id = openingId(ayah);
    if (id) groups.set(id, [...(groups.get(id) ?? []), ayah]);
  }
  return new Map([...groups].filter(([, group]) => group.length > 1));
}

export function listOpenings(groups: Map<string, BranchAyah[]>): Opening[] {
  return [...groups]
    .map(([id, group]) => ({ id, text: group[0].words.slice(0, OPENING_WORDS).join(' '), count: group.length }))
    .sort((a, b) => b.count - a.count);
}

export const startsWith = (id: string, phrase: string) => `${id} `.startsWith(`${phrase} `);

export const startingWith = (ayat: BranchAyah[], phrase: string) => ayat.filter(ayah => startsWith(norm(ayah).join(' '), phrase));

export const size = (node: Branch): number => node.ayat.length + node.children.reduce((sum, child) => sum + size(child), 0);

export function listPhrases(groups: Map<string, BranchAyah[]>): Opening[] {
  const phrases = new Map(listOpenings(groups).map(o => [o.id, o]));
  const walk = (node: Branch, path: string[]) => {
    const words = [...path, ...node.words];
    const count = size(node);
    if (count < 2) return;
    const id = words.map(normalizeWord).join(' ');
    if (!phrases.has(id)) phrases.set(id, { id, text: words.join(' '), count });
    node.children.forEach(child => walk(child, words));
  };
  groups.forEach(group => walk(branch(group), []));
  return [...phrases.values()].sort((a, b) => b.count - a.count || a.id.length - b.id.length);
}

export function branch(ayat: BranchAyah[], from = 0): Branch {
  const norms = ayat.map(norm);
  let to = from;
  while (norms.every(n => n.length > to) && new Set(norms.map(n => n[to])).size === 1) to++;
  const children = new Map<string, BranchAyah[]>();
  ayat.forEach((ayah, i) => {
    if (norms[i].length > to) children.set(norms[i][to], [...(children.get(norms[i][to]) ?? []), ayah]);
  });
  return {
    words: ayat[0].words.slice(from, to),
    ayat: ayat.filter((_, i) => norms[i].length === to).map(ayah => ayah.key),
    children: [...children.values()].map(group => branch(group, to)),
  };
}
