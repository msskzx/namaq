import type { Branch, BranchAyah } from '../branches';
import { phrasePresentation } from '../phraseTrees';
import { groupAyat } from './browse';
import type { Group } from './types';

export function groupPresentation(group: Group, ayat: Map<string, BranchAyah>) {
  const presentation = phrasePresentation(group.tree, groupAyat(group, ayat), false, false);
  const ends = new Map(group.places.filter(place => place.through).map(place => [place.key, place.through!]));
  const markEnds = (node: Branch) => {
    const through = Object.fromEntries(node.ayat.flatMap(key => ends.has(key) ? [[key, ends.get(key)!]] : []));
    if (Object.keys(through).length) node.through = through;
    node.children.forEach(markEnds);
  };
  markEnds(presentation.tree);
  return presentation;
}
