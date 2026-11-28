import dataFile from '../../data/quran/trees.json';
import { MUSHAF } from '../../data/quran/mushaf';
import { grown, nextWords, runOn, type BranchAyah } from '../branches';
import { withoutConjunction, type TreeGroup } from '../phraseTrees';
import type { Subtree } from '../subtrees';
import { ayahWordsOf, wordsOnly } from './ayahWords';
import { dataOf } from '../../appData';

const data = dataOf(dataFile);

type Stored = Omit<BranchAyah, 'words' | 'next'>;

function withWords(stored: Stored[]): BranchAyah[] {
  const words = ayahWordsOf(MUSHAF);
  const ayat: BranchAyah[] = stored.map(ayah => ({ ...ayah, words: wordsOnly(words[ayah.key] ?? []) }));
  const index = new Map(ayat.map((ayah, i) => [ayah.key, i]));
  const basmala = ayat.find(ayah => ayah.key === '1:1');
  return ayat.map(ayah => (ayah.through ? { ...ayah, next: nextWords(ayah.key, ayat.slice(index.get(ayah.key)! + 1, index.get(ayah.through)! + 1), basmala) } : ayah));
}

const ayat = withWords(data.ayat as Stored[]);
const byKey = new Map(grown(ayat).map(ayah => [ayah.key, ayah]));
const after = new Map(ayat.slice(0, -1).map((ayah, i) => [ayah.key, ayat[i + 1]]));
const basmala = ayat.find(ayah => ayah.key === '1:1');

function runningWords(key: string, start: number, length: number): string[] {
  const words = byKey.get(key)!.words.slice(start);
  for (let from = key; words.length < length && after.has(from);) {
    const next = after.get(from)!;
    words.push('۝', ...runOn(from, next, basmala).words);
    from = next.key;
  }
  return words.slice(0, length);
}

function titleAt(key: string, start: number, end: number) {
  const ayah = byKey.get(key)!;
  const words = ayah.words.slice(start, end);
  words[0] = withoutConjunction(words[0], ayah.conjs?.[start]);
  return words.join(' ');
}

const trees: TreeGroup[] = (data.trees as Omit<TreeGroup, 'text'>[]).map(tree => {
  if ('text' in tree && typeof tree.text === 'string') return tree as TreeGroup;
  const { key, start, end } = tree.occurrences[0];
  return { ...tree, text: titleAt(key, start, end) };
});

const treeById = new Map(trees.map(tree => [tree.id, tree]));
const subtrees: Subtree[] = (data.subtrees as (Omit<Subtree, 'text'> & { length: number })[]).map(({ length, ...subtree }) => {
  const { start } = treeById.get(subtree.parent)!.occurrences.find(occurrence => occurrence.key === subtree.keys[0])!;
  const words = runningWords(subtree.keys[0], start, length);
  words[0] = withoutConjunction(words[0], byKey.get(subtree.keys[0])!.conjs?.[start]);
  return { ...subtree, text: words.join(' ') };
});

const corpus: Omit<typeof data, 'ayat' | 'trees' | 'subtrees'> & { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] } = { ...data, ayat, trees, subtrees };
export default corpus;
