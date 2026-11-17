import artifact from '../../data/quran/mutashabih.json';
import corpus from '../quranText/corpus';
import type { PhraseOccurrence } from '../phraseTrees';
import type { Group } from './types';
import { canonicalGroups } from './identity';
import { categorizedGroups } from './categories';
import { differenceWordsOf, quotedExample } from './examples';

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

export const groups: Group[] = canonicalGroups(categorizedGroups(builtGroups));
