import { describe, expect, it } from 'vitest';
import { excludeKnownHomonyms, findDuplicateLabelGroups, findIsolatedNodes, normalizeGraphLabel } from './graphIntegrity';
import type { DuplicateNodeGroup, LabeledGraphNode } from './graphIntegrity';
import type { GraphRankEdge, GraphRankNode } from './graphRank';

describe('findIsolatedNodes', () => {
  it('returns a node with no edges at all', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'lonely' }];
    expect(findIsolatedNodes(nodes, [])).toEqual(nodes);
  });

  it('does not flag a node that only appears as an edge target', () => {
    const nodes: GraphRankNode[] = [
      { type: 'person', slug: 'a' },
      { type: 'battle', slug: 'b' },
    ];
    const edges: GraphRankEdge[] = [{ source: nodes[0], target: nodes[1] }];
    expect(findIsolatedNodes(nodes, edges)).toEqual([]);
  });

  it('flags only the node with no edges among otherwise-connected nodes', () => {
    const nodes: GraphRankNode[] = [
      { type: 'person', slug: 'a' },
      { type: 'person', slug: 'b' },
      { type: 'title', slug: 'isolated-title' },
    ];
    const edges: GraphRankEdge[] = [{ source: nodes[0], target: nodes[1] }];
    expect(findIsolatedNodes(nodes, edges)).toEqual([nodes[2]]);
  });

  it('does not conflate a person and a battle sharing the same slug', () => {
    const nodes: GraphRankNode[] = [
      { type: 'person', slug: 'badr' },
      { type: 'battle', slug: 'badr' },
    ];
    const edges: GraphRankEdge[] = [
      { source: { type: 'person', slug: 'other' }, target: { type: 'battle', slug: 'badr' } },
    ];
    expect(findIsolatedNodes(nodes, edges)).toEqual([{ type: 'person', slug: 'badr' }]);
  });

  it('returns everything when there are no edges', () => {
    const nodes: GraphRankNode[] = [{ type: 'person', slug: 'a' }, { type: 'event', slug: 'b' }];
    expect(findIsolatedNodes(nodes, [])).toEqual(nodes);
  });

  it('returns nothing for an empty graph', () => {
    expect(findIsolatedNodes([], [])).toEqual([]);
  });
});

describe('normalizeGraphLabel', () => {
  it('strips Arabic diacritics (tashkeel)', () => {
    const withDiacritics = 'مُحَمَّد';
    const without = 'محمد';
    expect(normalizeGraphLabel(withDiacritics)).toBe(without);
  });

  it('collapses and trims whitespace', () => {
    expect(normalizeGraphLabel('  علي   بن  ')).toBe('علي بن');
  });

  it('leaves an already-plain label unchanged', () => {
    expect(normalizeGraphLabel('Ali')).toBe('Ali');
  });
});

describe('findDuplicateLabelGroups', () => {
  it('groups two nodes of the same type sharing a label', () => {
    const nodes: LabeledGraphNode[] = [
      { type: 'person', slug: 'adnan', label: 'Adnan' },
      { type: 'person', slug: 'Adnan', label: 'Adnan' },
    ];
    const groups = findDuplicateLabelGroups(nodes);
    expect(groups).toEqual([{ label: 'Adnan', nodes }]);
  });

  it('treats diacritic-only and whitespace-only differences as the same label', () => {
    const nodes: LabeledGraphNode[] = [
      { type: 'person', slug: 'a', label: 'مُحَمَّد' },
      { type: 'person', slug: 'b', label: '  محمد  ' },
    ];
    expect(findDuplicateLabelGroups(nodes)).toHaveLength(1);
  });

  it('does not group nodes of different types sharing a label (e.g. a Battle and its Event)', () => {
    const nodes: LabeledGraphNode[] = [
      { type: 'battle', slug: 'badr', label: 'Badr' },
      { type: 'event', slug: 'battle-of-badr', label: 'Badr' },
    ];
    expect(findDuplicateLabelGroups(nodes)).toEqual([]);
  });

  it('does not flag a label that appears only once', () => {
    const nodes: LabeledGraphNode[] = [{ type: 'person', slug: 'a', label: 'Unique' }];
    expect(findDuplicateLabelGroups(nodes)).toEqual([]);
  });

  it('returns nothing for an empty graph', () => {
    expect(findDuplicateLabelGroups([])).toEqual([]);
  });
});

describe('excludeKnownHomonyms', () => {
  const homonymGroup: DuplicateNodeGroup = {
    label: 'مالك بن النضر',
    nodes: [
      { type: 'person', slug: 'malik-ibn-an-nadr', label: 'مالك بن النضر' },
      { type: 'person', slug: 'malik-ibn-an-nadr-al-najjari', label: 'مالك بن النضر' },
    ],
  };
  const knownGroups = [new Set(['person:malik-ibn-an-nadr', 'person:malik-ibn-an-nadr-al-najjari'])];

  it('drops a group whose node-key set exactly matches a known homonym', () => {
    expect(excludeKnownHomonyms([homonymGroup], knownGroups)).toEqual([]);
  });

  it('keeps a group with the same label but a different member set', () => {
    const different: DuplicateNodeGroup = {
      label: 'مالك بن النضر',
      nodes: [
        { type: 'person', slug: 'malik-ibn-an-nadr', label: 'مالك بن النضر' },
        { type: 'person', slug: 'some-other-slug', label: 'مالك بن النضر' },
      ],
    };
    expect(excludeKnownHomonyms([different], knownGroups)).toEqual([different]);
  });

  it('keeps a three-way collision even if two of its members match a known two-way pair', () => {
    const threeWay: DuplicateNodeGroup = {
      label: 'مالك بن النضر',
      nodes: [...homonymGroup.nodes, { type: 'person', slug: 'a-third-one', label: 'مالك بن النضر' }],
    };
    expect(excludeKnownHomonyms([threeWay], knownGroups)).toEqual([threeWay]);
  });

  it('is a no-op with an empty allowlist', () => {
    expect(excludeKnownHomonyms([homonymGroup], [])).toEqual([homonymGroup]);
  });
});
