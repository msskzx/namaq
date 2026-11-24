import artifactFile from '../../data/quran/mutashabih.json';
import corpus from '../quranText/corpus';
import type { PhraseOccurrence } from '../phraseTrees';
import type { Group } from './types';
import { canonicalGroups } from './identity';
import { categorizedGroups } from './categories';
import { differenceWordsOf, quotedExample } from './examples';
import { TANASUB_LINKS, tanasubTree } from '../tanasubCards';
import { dataOf } from '../../appData';

const artifact = dataOf(artifactFile);

const keyOrder = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surah * 1000 + ayah; };

/**
 * mutashabih.json keeps places only (owner 2026-11-17): a group's words are its
 * first place's words on the Madina page, and its differing words are the page
 * words at its columns' positions. Only a book's own example is stored.
 */
type Stored = Omit<Group, 'text' | 'tree' | 'examples'> & { tree: Omit<Group['tree'], 'text'> };

const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const textAt = ({ key, start, end }: PhraseOccurrence) => words.get(key)!.slice(start, Math.max(end, start + 1)).join(' ');

/** The groups as built, their words put back from the pages. */
export const builtGroups: Group[] = (artifact as unknown as Stored[]).map(group => {
  const text = textAt(group.tree.occurrences[0]);
  const examples = Object.fromEntries(group.tags.flatMap(tag => { const quoted = quotedExample(group, tag); return quoted ? [[tag, quoted]] : []; }));
  // A citation shows the group's quoted example for its tags when the book gives none (evidenceGroup reads citations only).
  const citations = group.citations.map(citation => ({ ...citation, examples: { ...Object.fromEntries(citation.tags.flatMap(tag => examples[tag] ? [[tag, examples[tag]]] : [])), ...citation.examples } }));
  return { ...group, text, tree: { ...group.tree, text }, citations, examples, words: differenceWordsOf(group, (key, index) => words.get(key)?.[index]) };
});

/**
 * The surah-order books' cards, the compare page's «في كتب تناسب السور» on branches too (owner 2026-11-20): each holds the whole
 * ayat its link names. Only a meaningful one grows a tree (its trunk from tanasubTree); the rest are their ayat with no trunk,
 * which keeps them matrix only (branchVerdicts.ts matrixOnly).
 */
export const tanasubGroups: Group[] = TANASUB_LINKS.map(link => {
  const keys = [...new Set(link.pairs.flatMap(pair => pair))].sort((x, y) => keyOrder(x) - keyOrder(y));
  const id = `tanasub:${link.link}`;
  const trunk = tanasubTree(link.link);
  const occurrences = trunk ?? keys.map(key => ({ key, start: 0, end: 0 }));
  const text = trunk ? textAt(trunk[0]) : '';
  return {
    id, text, categories: ['tanasub'], tanasub: link.link, kind: 'shared_phrase', tags: [], differences: {}, score: 1, citations: [], columns: [],
    places: keys.map(key => ({ key, start: 0, end: words.get(key)!.length })),
    tree: { id, text, occurrences },
  };
});

export const groups: Group[] = [...canonicalGroups(categorizedGroups(builtGroups)), ...tanasubGroups];
