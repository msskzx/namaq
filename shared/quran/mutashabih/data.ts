import artifact from '../../data/quran/mutashabih.json';
import corpus from '../quranText/corpus';
import type { PhraseOccurrence } from '../phraseTrees';
import type { Group } from './types';
import { canonicalGroups } from './identity';
import { categorizedGroups } from './categories';

/** mutashabih.json keeps places only (owner 2026-11-17): a group's words are its first place's words on the Madina page. */
type Stored = Omit<Group, 'text' | 'tree'> & { tree: Omit<Group['tree'], 'text'> };

const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const textAt = ({ key, start, end }: PhraseOccurrence) => words.get(key)!.slice(start, Math.max(end, start + 1)).join(' ');

/** The groups as built, their words put back from the pages. */
export const builtGroups: Group[] = (artifact as unknown as Stored[]).map(group => {
  const text = textAt(group.tree.occurrences[0]);
  return { ...group, text, tree: { ...group.tree, text } };
});

export const groups: Group[] = canonicalGroups(categorizedGroups(builtGroups));
