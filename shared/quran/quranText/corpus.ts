import data from '../../data/quran/trees.json';
import { MUSHAF } from '../../data/quran/mushaf';
import { grown, nextWords, type BranchAyah } from '../branches';
import { withoutConjunction, type TreeGroup } from '../phraseTrees';
import { ayahWordsOf, wordsOnly } from './ayahWords';

/**
 * The trees' data with every ayah's words read from the Madina pages (owner 2026-11-17: the pages are the only stored Quran text).
 * trees.json keeps what is built ahead of time (keys, pages, roots, lemmas, groups, positions); the words come from here, the
 * same on the website, in the app and in the scripts.
 */
type Stored = Omit<BranchAyah, 'words' | 'next'>;

function withWords(stored: Stored[]): BranchAyah[] {
  const words = ayahWordsOf(MUSHAF);
  const ayat: BranchAyah[] = stored.map(ayah => ({ ...ayah, words: wordsOnly(words[ayah.key] ?? []) }));
  const index = new Map(ayat.map((ayah, i) => [ayah.key, i]));
  const basmala = ayat.find(ayah => ayah.key === '1:1');
  return ayat.map(ayah => (ayah.through ? { ...ayah, next: nextWords(ayah.key, ayat.slice(index.get(ayah.key)! + 1, index.get(ayah.through)! + 1), basmala) } : ayah));
}

/** A tree's title: its first place's words on the page, the leading و / ف left out (a chapter family keeps its own name). */
function withTexts(trees: Omit<TreeGroup, 'text'>[], ayat: BranchAyah[]): TreeGroup[] {
  const byKey = new Map(grown(ayat).map(ayah => [ayah.key, ayah]));
  return trees.map(tree => {
    if ('text' in tree && typeof tree.text === 'string') return tree as TreeGroup;
    const { key, start, end } = tree.occurrences[0];
    const ayah = byKey.get(key)!;
    const words = ayah.words.slice(start, end);
    words[0] = withoutConjunction(words[0], ayah.conjs?.[start]);
    return { ...tree, text: words.join(' ') };
  });
}

const ayat = withWords(data.ayat as Stored[]);
const corpus: Omit<typeof data, 'ayat' | 'trees'> & { ayat: BranchAyah[]; trees: TreeGroup[] } = { ...data, ayat, trees: withTexts(data.trees as Omit<TreeGroup, 'text'>[], ayat) };
export default corpus;
