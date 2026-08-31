import { describe, expect, it } from 'vitest';
import { filterVisibleGraph, COMPANION_TITLE_SLUG } from './graphFilter';
import { GraphData, GraphLink, GraphNodeFull } from '@/types/graph';

function person(slug: string, label = slug): GraphNodeFull {
  return { id: `person:${slug}`, label, slug, group: 1, type: 'person' };
}

function title(slug: string, label = slug): GraphNodeFull {
  return { id: `title:${slug}`, label, slug, group: 1, type: 'title' };
}

function link(source: string, target: string, label: string): GraphLink {
  return { source, target, label, value: 1 };
}

const baseOptions = {
  excludedRelations: new Set<string>(),
  showCompanionTitle: true,
  personSearchSlugs: new Set<string>(),
};

describe('filterVisibleGraph', () => {
  // The exact regression this guards against: an ancestorsOf/descendantsOf
  // fetch walks an unbounded SON/DAUGHTER chain (see route.ts), and every
  // edge it returns already belongs to the requested lineage -- unlike a
  // `person` 1-hop neighborhood search, it must never be pruned down to
  // just the first hop.
  it('keeps a multi-hop ancestor chain intact when no person search is active', () => {
    const graphData: GraphData = {
      nodes: [person('prophet-muhammad'), person('abd-allah'), person('abd-al-muttalib'), person('hashim')],
      links: [
        link('person:prophet-muhammad', 'person:abd-allah', 'SON'),
        link('person:abd-allah', 'person:abd-al-muttalib', 'SON'),
        link('person:abd-al-muttalib', 'person:hashim', 'SON'),
      ],
    };

    const result = filterVisibleGraph(graphData, baseOptions);

    expect(result.nodes.map(n => n.slug).sort()).toEqual(['abd-al-muttalib', 'abd-allah', 'hashim', 'prophet-muhammad']);
    expect(result.links).toHaveLength(3);
  });

  // Two independent ancestorsOf roots (e.g. ?ancestorsOf=prophet-muhammad&
  // ancestorsOf=abu-bakr-as-siddiq) walk their own chains, which the API
  // merges by shared node identity when they converge on a common
  // ancestor. Filtering must keep both full chains -- not just one, and
  // not just the shared node's immediate neighbors.
  it('keeps every chain when multiple ancestor roots converge on a shared ancestor', () => {
    const graphData: GraphData = {
      nodes: [
        person('prophet-muhammad'), person('abd-allah'),
        person('abu-bakr-as-siddiq'), person('abu-quhafa'),
        person('murrah-ibn-kaab'),
      ],
      links: [
        link('person:prophet-muhammad', 'person:abd-allah', 'SON'),
        link('person:abd-allah', 'person:murrah-ibn-kaab', 'SON'),
        link('person:abu-bakr-as-siddiq', 'person:abu-quhafa', 'SON'),
        link('person:abu-quhafa', 'person:murrah-ibn-kaab', 'SON'),
      ],
    };

    const result = filterVisibleGraph(graphData, baseOptions);

    expect(result.nodes.map(n => n.slug).sort()).toEqual(
      ['abd-allah', 'abu-bakr-as-siddiq', 'abu-quhafa', 'murrah-ibn-kaab', 'prophet-muhammad'].sort()
    );
    expect(result.links).toHaveLength(4);
  });

  // Contrast case: a `person` 1-hop neighborhood search (personSearchSlugs
  // populated) is exactly the scenario isDirect exists for -- an edge two
  // hops away from the searched person, sharing a label with something
  // directly connected, must not leak in.
  it('prunes to directly-touching edges only when a person search is active', () => {
    const graphData: GraphData = {
      nodes: [person('prophet-muhammad'), person('abd-allah'), person('abd-al-muttalib')],
      links: [
        link('person:prophet-muhammad', 'person:abd-allah', 'SON'),
        link('person:abd-allah', 'person:abd-al-muttalib', 'SON'),
      ],
    };

    const result = filterVisibleGraph(graphData, { ...baseOptions, personSearchSlugs: new Set(['prophet-muhammad']) });

    expect(result.nodes.map(n => n.slug).sort()).toEqual(['abd-allah', 'prophet-muhammad']);
    expect(result.links).toEqual([link('person:prophet-muhammad', 'person:abd-allah', 'SON')]);
  });

  it('drops the Companion title node and its edges by default', () => {
    const graphData: GraphData = {
      nodes: [person('abu-bakr-as-siddiq'), title(COMPANION_TITLE_SLUG)],
      links: [link('person:abu-bakr-as-siddiq', `title:${COMPANION_TITLE_SLUG}`, 'HOLDS_TITLE')],
    };

    const result = filterVisibleGraph(graphData, { ...baseOptions, showCompanionTitle: false });

    expect(result.nodes).toEqual([]);
    expect(result.links).toEqual([]);
  });

  it('keeps the Companion title node when explicitly shown', () => {
    const graphData: GraphData = {
      nodes: [person('abu-bakr-as-siddiq'), title(COMPANION_TITLE_SLUG)],
      links: [link('person:abu-bakr-as-siddiq', `title:${COMPANION_TITLE_SLUG}`, 'HOLDS_TITLE')],
    };

    const result = filterVisibleGraph(graphData, { ...baseOptions, showCompanionTitle: true });

    expect(result.nodes.map(n => n.slug).sort()).toEqual(['abu-bakr-as-siddiq', COMPANION_TITLE_SLUG]);
  });

  it('drops edges of a manually excluded relation type, and any node left with no remaining edge', () => {
    const graphData: GraphData = {
      nodes: [person('prophet-muhammad'), person('khadijah'), person('abu-bakr-as-siddiq')],
      links: [
        link('person:prophet-muhammad', 'person:khadijah', 'WIFE'),
        link('person:prophet-muhammad', 'person:abu-bakr-as-siddiq', 'COMPANION_OF'),
      ],
    };

    const result = filterVisibleGraph(graphData, { ...baseOptions, excludedRelations: new Set(['COMPANION_OF']) });

    expect(result.nodes.map(n => n.slug).sort()).toEqual(['khadijah', 'prophet-muhammad']);
    expect(result.links).toEqual([link('person:prophet-muhammad', 'person:khadijah', 'WIFE')]);
  });

  it('keeps the selected node even when every one of its edges is filtered out', () => {
    const graphData: GraphData = {
      nodes: [person('prophet-muhammad'), person('abu-bakr-as-siddiq')],
      links: [link('person:prophet-muhammad', 'person:abu-bakr-as-siddiq', 'COMPANION_OF')],
    };

    const result = filterVisibleGraph(graphData, {
      ...baseOptions,
      excludedRelations: new Set(['COMPANION_OF']),
      selectedNodeId: 'person:abu-bakr-as-siddiq',
    });

    expect(result.nodes.map(n => n.slug)).toEqual(['abu-bakr-as-siddiq']);
    expect(result.links).toEqual([]);
  });
});
