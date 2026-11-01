import { describe, expect, it } from 'vitest';
import data from '@/app/quran/branches/trees.json';
import { keys, searchPhrases, type Branch, type BranchAyah } from './branches';
import { parseOccurrences, resolveTree, scopeTree, subtreeLinks } from './branchTreeLinks';
import { buildPhraseGroups, createPhrasePresenter, phrasePresentation, phraseSubtreeTargets, type TreeGroup } from './phraseTrees';
import { keySet, subtreeIndex, type Subtree } from './subtrees';

const source = data as { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] };
const index = subtreeIndex(source.trees, source.subtrees);
let phrases: TreeGroup[] | undefined;
const allPhrases = () => phrases ??= buildPhraseGroups(source.ayat);

/** What /quran/branches draws for a link: resolve ?o=, narrow by ?at=, and list the ayat. */
function opened(href: string) {
  const url = new URL(href, 'https://namaq.test');
  const id = url.searchParams.get('o') ?? '';
  const tree = scopeTree(index.byId.get(id) ?? resolveTree(id, source.trees, allPhrases), parseOccurrences(url.searchParams.get('at')));
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
    const links = subtreeLinks(group, tree, undefined, phraseSubtreeTargets(tree, allPhrases(), source.ayat), false, index.idsFor(group));
    const href = links[keys(node).join(' ')];

    expect(keys(node).sort()).toEqual(['24:54', '47:33', '4:59', '5:92', '64:12']);
    expect([...new URL(href, 'https://namaq.test').searchParams]).toEqual([['o', 'اطيعوا الله واطيعوا الرسول']]);
    expect(opened(href)).toEqual([...keys(node)].sort());
    expect(index.byId.get('اطيعوا الله واطيعوا الرسول')!.text.normalize('NFC')).toBe('أَطِيعُوا۟ ٱللَّهَ وَأَطِيعُوا۟ ٱلرَّسُولَ'.normalize('NFC'));
  });

  it('opens exactly the subtree ayat for every inner node of every tree and subtree, by subtree id in every tree', () => {
    const present = createPhrasePresenter(source.ayat);
    const broken: string[] = [];
    let checked = 0;
    let narrowed = 0;
    for (const group of [...source.trees, ...index.groups]) {
      const { tree } = present(group);
      const links = subtreeLinks(group, tree, undefined, phraseSubtreeTargets(tree, allPhrases(), source.ayat), false, index.idsFor(group));
      for (const node of innerNodes(tree)) {
        const wanted = [...new Set(keys(node))].sort();
        const href = links[keys(node).join(' ')];
        checked++;
        if (href?.includes('at=')) narrowed++;
        if (!href || (href.includes('at=') && !('parent' in group)) || opened(href).join(' ') !== wanted.join(' ')) broken.push(`${group.id}: ${node.words.join(' ')} → ${href ? decodeURIComponent(href) : 'no link'}`);
      }
    }

    expect(checked).toBeGreaterThan(6000);
    expect(narrowed).toBeLessThan(checked / 100);
    expect(broken.slice(0, 20)).toEqual([]);
  }, 240_000);
});

describe('subtree ids', () => {
  it('gives every subtree one id, apart from every tree id', () => {
    const treeIds = new Set(source.trees.map(tree => tree.id));
    expect(new Set(source.subtrees.map(subtree => subtree.id)).size).toBe(source.subtrees.length);
    expect(source.subtrees.filter(subtree => treeIds.has(subtree.id))).toEqual([]);
    expect(source.subtrees.length).toBeGreaterThan(4000);
  });

  it('lists in each tree exactly the subtrees of its inner nodes, each naming a tree that lists it', () => {
    const present = createPhrasePresenter(source.ayat);
    const wrong: string[] = [];
    for (const group of source.trees) {
      const inner = innerNodes(present(group).tree).map(node => keySet(keys(node))).sort();
      const listed = (group.subtrees ?? []).map(id => keySet(index.byId.get(id)?.occurrences.map(occurrence => occurrence.key) ?? [])).sort();
      if (inner.join('|') !== listed.join('|')) wrong.push(group.id);
    }
    const listing = new Map(source.trees.map(tree => [tree.id, new Set(tree.subtrees)]));
    expect(wrong.slice(0, 20)).toEqual([]);
    expect(source.subtrees.filter(subtree => !listing.get(subtree.parent)?.has(subtree.id)).map(subtree => subtree.id)).toEqual([]);
  }, 120_000);

  it('names a subtree by the trunk from the shared words down to it, without the opening boxes', () => {
    expect(source.trees.find(tree => tree.id === 'اطيعوا الله')!.subtrees).toEqual(expect.arrayContaining(['اطيعوا الله واطيعوا الرسول', 'اطيعوا الله ورسوله']));
    expect(index.byId.get('ان لي~11:80')!.occurrences.map(occurrence => occurrence.key)).toEqual(['11:80', '39:58']);
  });
});

describe('searching trees and subtrees', () => {
  const inventory = [...source.trees, ...index.groups].map(tree => ({ id: tree.id, text: tree.text, aliases: tree.aliases, count: new Set(tree.occurrences.map(occurrence => occurrence.key)).size }));

  it('lists the subtree before its parent, forgiving a leading و', () => {
    const found = searchPhrases(inventory, 'وأطيعوا الله وأطيعوا الرسول').map(phrase => phrase.id);
    expect(found[0]).toBe('اطيعوا الله واطيعوا الرسول');
    expect(found.indexOf('اطيعوا الله')).toBeGreaterThan(0);
  });

  it('lists the exact phrase first, then the closest phrases that open with it', () => {
    const found = searchPhrases(inventory, 'أطيعوا الله').map(phrase => phrase.id);
    expect(found[0]).toBe('اطيعوا الله');
    expect(found.indexOf('اطيعوا الله ورسوله')).toBeLessThan(found.indexOf('اطيعوا الله واطيعوا الرسول'));
    expect(found.indexOf('اطيعوا الله واطيعوا الرسول')).toBeLessThan(found.indexOf('اطيعوا الله واطيعوا الرسول فان'));
  });

  it('finds the subtree when the query starts with words from one ayah\'s opening', () => {
    expect(searchPhrases(inventory, 'قل أطيعوا الله وأطيعوا الرسول')[0].id).toBe('اطيعوا الله واطيعوا الرسول');
  });
});
