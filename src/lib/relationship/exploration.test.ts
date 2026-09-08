import { describe, expect, it } from 'vitest';
import { buildExploration, ExplorationInput } from './exploration';
import { StoredEdge, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const khadijah = subjectId('person', 'khadijah-bint-khuwaylid');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');
const hafsa = subjectId('person', 'hafsa-bint-umar');
const abuBakr = subjectId('person', 'abu-bakr-as-siddiq');
const umar = subjectId('person', 'umar-ibn-al-khattab');
const uthmanIbnAmir = subjectId('person', 'uthman-ibn-amir');

function edge(source: string, target: string, type: StoredEdge['type']): StoredEdge {
  return { source, target, type };
}

const edges: StoredEdge[] = [
  edge(khadijah, muhammad, 'WIFE'),
  edge(aisha, muhammad, 'WIFE'),
  edge(hafsa, muhammad, 'WIFE'),
  edge(abuBakr, aisha, 'FATHER'),
  edge(aisha, abuBakr, 'DAUGHTER'),
  edge(umar, hafsa, 'FATHER'),
  edge(hafsa, umar, 'DAUGHTER'),
  edge(uthmanIbnAmir, abuBakr, 'FATHER'),
];

function visibleSubjects(result: ReturnType<typeof buildExploration>): SubjectIdSet {
  return new Set(result.visible.keys());
}

type SubjectIdSet = Set<string>;

describe('buildExploration', () => {
  it('Muhammad -> Wives expansion -> select Aisha -> Parents expansion retains only Aisha\'s parents', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [
        { subject: muhammad, relation: 'WIFE' },
        { subject: aisha, relation: 'FATHER' },
      ],
      globalFilters: [],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible).toEqual(new Set([muhammad, khadijah, aisha, hafsa, abuBakr]));
    expect(visible.has(umar)).toBe(false);
  });

  it('collapsing the Wives expansion preserves Aisha and her parents when Aisha has her own independent Parents expansion, and drops unsupported wives', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [{ subject: aisha, relation: 'FATHER' }],
      globalFilters: [],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible).toEqual(new Set([muhammad, aisha, abuBakr]));
    expect(visible.has(khadijah)).toBe(false);
    expect(visible.has(hafsa)).toBe(false);
  });

  it('does not retain an expansion subject when it has no matching neighbor', () => {
    const result = buildExploration({ roots: [muhammad], expansions: [{ subject: aisha, relation: 'MOTHER' }], globalFilters: [] }, edges);
    expect(visibleSubjects(result)).toEqual(new Set([muhammad]));
  });

  it('activating a global Father filter with Muhammad and his wives visible reveals each visible subject\'s father but not their fathers in turn', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [{ subject: muhammad, relation: 'WIFE' }],
      globalFilters: ['FATHER'],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible).toEqual(new Set([muhammad, khadijah, aisha, hafsa, abuBakr, umar]));
    expect(visible.has(uthmanIbnAmir)).toBe(false);
  });

  it('a subject introduced by one global filter (Wives) remains eligible to trigger a different filter (Father)', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [],
      globalFilters: ['WIFE', 'FATHER'],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible).toEqual(new Set([muhammad, khadijah, aisha, hafsa, abuBakr, umar]));

    const aishaProvenance = result.visible.get(aisha);
    expect(aishaProvenance).toEqual([{ kind: 'filter', relationType: 'WIFE' }]);

    const abuBakrProvenance = result.visible.get(abuBakr);
    expect(abuBakrProvenance).toEqual([{ kind: 'filter', relationType: 'FATHER' }]);
  });

  it('produces the same visible set regardless of the order globalFilters lists active filters in', () => {
    const wifeFirst = buildExploration({ roots: [muhammad], expansions: [], globalFilters: ['WIFE', 'FATHER'] }, edges);
    const fatherFirst = buildExploration({ roots: [muhammad], expansions: [], globalFilters: ['FATHER', 'WIFE'] }, edges);

    expect(new Set(wifeFirst.visible.keys())).toEqual(new Set(fatherFirst.visible.keys()));
  });

  it('the cap does not restrict manually expanding a filter-introduced subject', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [
        { subject: muhammad, relation: 'WIFE' },
        { subject: abuBakr, relation: 'FATHER' },
      ],
      globalFilters: ['FATHER'],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible.has(abuBakr)).toBe(true);
    expect(result.visible.get(abuBakr)).toEqual([{ kind: 'expansion', subject: abuBakr, relation: 'FATHER' }]);
    expect(visible.has(uthmanIbnAmir)).toBe(true);
    expect(result.visible.get(uthmanIbnAmir)).toEqual([
      { kind: 'expansion', subject: abuBakr, relation: 'FATHER' },
    ]);
  });

  it('produces identical output when called twice with identical input, confirming statelessness', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [
        { subject: muhammad, relation: 'WIFE' },
        { subject: aisha, relation: 'FATHER' },
      ],
      globalFilters: ['FATHER'],
    };

    const first = buildExploration(input, edges);
    const second = buildExploration(input, edges);

    expect(Array.from(first.visible.entries())).toEqual(Array.from(second.visible.entries()));
    expect(first.connections).toEqual(second.connections);
  });

  it('builds connections from buildLogicalConnections over the edges touching the visible set', () => {
    const input: ExplorationInput = {
      roots: [muhammad],
      expansions: [
        { subject: muhammad, relation: 'WIFE' },
        { subject: aisha, relation: 'FATHER' },
      ],
      globalFilters: [],
    };

    const result = buildExploration(input, edges);

    expect(result.connections).toEqual(
      expect.arrayContaining([
        { primary: edge(abuBakr, aisha, 'FATHER'), reciprocal: edge(aisha, abuBakr, 'DAUGHTER') },
      ])
    );
  });

  // Covers criteria 2 and 3 of docs/graph-subject-search-plan.md at this
  // layer: a subject picked from search becomes a root, and roots are visible
  // without any expansion. That path does not touch matchExpansionNeighbors,
  // so it is unaffected by the one-way-edge bug in
  // docs/graph-expansion-controls-plan.md.
  it('makes a non-person root visible with no expansion, and renders its one-way edge', () => {
    const badr = subjectId('battle', 'badr');
    const crossKindEdges = [...edges, edge(muhammad, badr, 'PARTICIPATED_IN')];

    const result = buildExploration({ roots: [muhammad, badr], expansions: [], globalFilters: [] }, crossKindEdges);

    expect(visibleSubjects(result)).toEqual(new Set([muhammad, badr]));
    expect(result.connections).toEqual([
      { primary: edge(muhammad, badr, 'PARTICIPATED_IN'), reciprocal: undefined },
    ]);
  });

  it('reaches a battle by expanding the person who fought in it', () => {
    const badr = subjectId('battle', 'badr');
    const crossKindEdges = [...edges, edge(muhammad, badr, 'PARTICIPATED_IN')];

    const result = buildExploration(
      { roots: [muhammad], expansions: [{ subject: muhammad, relation: 'PARTICIPATED_IN' }], globalFilters: [] },
      crossKindEdges,
    );

    expect(visibleSubjects(result)).toEqual(new Set([muhammad, badr]));
  });

  // globalFilters runs through the same matcher as expansions, so revealing a
  // relation type across the graph reaches cross-kind subjects too.
  it('reveals a title through a global filter, not only through an expansion', () => {
    const companion = subjectId('title', 'sahabi');
    const crossKindEdges = [...edges, edge(muhammad, companion, 'HOLDS_TITLE')];

    const result = buildExploration(
      { roots: [muhammad], expansions: [], globalFilters: ['HOLDS_TITLE'] },
      crossKindEdges,
    );

    expect(visibleSubjects(result)).toEqual(new Set([muhammad, companion]));
  });
});

describe('companionship edges', () => {
  // Both stored directions between two people who are visible for other
  // reasons -- Abu Bakr is Aisha's father, not a discovered companion.
  const companionship: StoredEdge[] = [
    ...edges,
    edge(muhammad, abuBakr, 'ACCOMPANIED_BY'),
    edge(abuBakr, muhammad, 'COMPANION_OF'),
  ];
  const input = (globalFilters: ExplorationInput['globalFilters']): ExplorationInput => ({
    roots: [muhammad],
    expansions: [],
    globalFilters,
  });
  const types = (result: ReturnType<typeof buildExploration>) =>
    result.connections.flatMap(connection => [connection.primary.type, connection.reciprocal?.type]).filter(Boolean);

  it('drops both directions when the COMPANION_OF switch is off', () => {
    const result = buildExploration(input(['WIFE', 'FATHER']), companionship);
    expect(types(result)).not.toContain('COMPANION_OF');
    expect(types(result)).not.toContain('ACCOMPANIED_BY');
    // The subjects themselves stay, held up by the family relations.
    expect(visibleSubjects(result).has(abuBakr)).toBe(true);
  });

  it('keeps both directions when the switch is on', () => {
    const result = buildExploration(input(['WIFE', 'FATHER', 'COMPANION_OF', 'ACCOMPANIED_BY']), companionship);
    expect(types(result)).toContain('COMPANION_OF');
  });

  it('keeps other relations drawn between retained subjects when their filter is off', () => {
    const result = buildExploration(input(['WIFE']), companionship);
    expect(visibleSubjects(result).has(aisha)).toBe(true);
    expect(types(result)).toContain('WIFE');
  });
});

