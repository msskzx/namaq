import { describe, expect, it } from 'vitest';
import data from '@/app/quran/branches/trees.json';
import { keys, type Branch, type BranchAyah } from './branches';
import { parseOccurrences, resolveTree, scopeTree, subtreeLinks } from './branchTreeLinks';
import { buildPhraseGroups, createPhrasePresenter, phrasePresentation, phraseSubtreeTargets, type TreeGroup } from './phraseTrees';

const source = data as { ayat: BranchAyah[]; trees: TreeGroup[] };
let phrases: TreeGroup[] | undefined;
const allPhrases = () => phrases ??= buildPhraseGroups(source.ayat);

/** What /quran/branches draws for a link: resolve ?o=, narrow by ?at=, and list the ayat. */
function opened(href: string) {
  const url = new URL(href, 'https://namaq.test');
  const tree = scopeTree(resolveTree(url.searchParams.get('o') ?? '', source.trees, allPhrases), parseOccurrences(url.searchParams.get('at')));
  return tree ? [...new Set(tree.occurrences.map(occurrence => occurrence.key))].sort() : [];
}

const innerNodes = (tree: Branch) => {
  const nodes: Branch[] = [];
  const visit = (node: Branch, root: boolean) => {
    if (!root && node.children.length > 0) nodes.push(node);
    node.children.forEach(child => visit(child, false));
  };
  visit(tree, true);
  return nodes;
};

describe('subtree links', () => {
  it('opens the subtree under وأطيعوا الرسول from the أطيعوا الله tree', () => {
    const group = source.trees.find(tree => tree.id === 'اطيعوا الله')!;
    const { tree } = phrasePresentation(group, source.ayat);
    const node = tree.children.find(child => keys(child).includes('4:59'))!;
    const links = subtreeLinks(group, tree, undefined, phraseSubtreeTargets(tree, allPhrases(), source.ayat));
    const href = links[keys(node).join(' ')];

    expect(keys(node).sort()).toEqual(['24:54', '47:33', '4:59', '5:92', '64:12']);
    expect(href).toBeDefined();
    expect(opened(href)).toEqual([...keys(node)].sort());
  });

  it('opens exactly the subtree ayat for every inner node of every tree', () => {
    const present = createPhrasePresenter(source.ayat);
    const broken: string[] = [];
    let checked = 0;
    for (const group of source.trees) {
      const { tree } = present(group);
      const links = subtreeLinks(group, tree, undefined, phraseSubtreeTargets(tree, allPhrases(), source.ayat));
      for (const node of innerNodes(tree)) {
        const wanted = [...new Set(keys(node))].sort();
        const href = links[keys(node).join(' ')];
        checked++;
        if (!href || opened(href).join(' ') !== wanted.join(' ')) broken.push(`${group.id}: ${node.words.join(' ')} → ${href ? decodeURIComponent(href) : 'no link'}`);
      }
    }

    expect(checked).toBeGreaterThan(4000);
    expect(broken.slice(0, 20)).toEqual([]);
  }, 120_000);
});
