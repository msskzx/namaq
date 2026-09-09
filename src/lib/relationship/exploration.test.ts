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
      roots: [muhammad, aisha],
      expansions: [{ subject: aisha, relation: 'FATHER' }],
      globalFilters: [],
    };

    const result = buildExploration(input, edges);
    const visible = visibleSubjects(result);

    expect(visible).toEqual(new Set([muhammad, aisha, abuBakr]));
    expect(visible.has(khadijah)).toBe(false);
    expect(visible.has(hafsa)).toBe(false);
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
    expect(visible.has(uthmanIbnAmir)).toBe(true);
    expect(result.visible.get(uthmanIbnAmir)).toContainEqual({ kind: 'expansion', subject: abuBakr, relation: 'FATHER' });
    expect(result.caps.map((cap) => cap.subject)).not.toContain(uthmanIbnAmir);
  });

  it('holds an expansion anchor through its own contribution, so a filter that finds it already visible records no cap', () => {
    const result = buildExploration(
      { roots: [], expansions: [{ subject: abuBakr, relation: 'FATHER' }], globalFilters: ['FATHER'] },
      edges
    );

    expect(result.visible.get(abuBakr)).toEqual([{ kind: 'expansion', subject: abuBakr, relation: 'FATHER' }]);
    expect(result.caps).toEqual([]);
  });

  it('caps each subject a global filter introduces, and reports the caps for the caller to persist', () => {
    const result = buildExploration(
      { roots: [muhammad], expansions: [{ subject: muhammad, relation: 'WIFE' }], globalFilters: ['FATHER'] },
      edges
    );

    expect(result.caps).toEqual(
      expect.arrayContaining([
        { subject: abuBakr, relation: 'FATHER' },
        { subject: umar, relation: 'FATHER' },
      ])
    );
    expect(result.caps).toHaveLength(2);
  });

  it('does not let a carried cap be cleared by searching the capped subject again', () => {
    const result = buildExploration(
      {
        roots: [muhammad, abuBakr],
        expansions: [{ subject: muhammad, relation: 'WIFE' }],
        globalFilters: ['FATHER'],
        caps: [{ subject: abuBakr, relation: 'FATHER' }],
      },
      edges
    );

    expect(visibleSubjects(result).has(uthmanIbnAmir)).toBe(false);
  });

  it('leaves a subject capped for one relation type eligible to trigger another', () => {
    const result = buildExploration(
      {
        roots: [muhammad],
        expansions: [],
        globalFilters: ['WIFE', 'FATHER'],
        caps: [{ subject: aisha, relation: 'WIFE' }],
      },
      edges
    );

    expect(visibleSubjects(result).has(abuBakr)).toBe(true);
  });

  it('keeps an explicitly removed subject out of roots, expansions, and filter introductions', () => {
    const result = buildExploration(
      {
        roots: [muhammad, aisha],
        expansions: [{ subject: muhammad, relation: 'WIFE' }],
        globalFilters: ['FATHER'],
        removed: [aisha],
      },
      edges
    );

    const visible = visibleSubjects(result);
    expect(visible.has(aisha)).toBe(false);
    expect(visible.has(abuBakr)).toBe(false);
    expect(visible.has(hafsa)).toBe(true);
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

  it('hides a connection between two visible subjects that no contribution revealed, until the matching global filter is on', () => {
    const localOnly = buildExploration(
      {
        roots: [muhammad],
        expansions: [
          { subject: muhammad, relation: 'WIFE' },
          { subject: muhammad, relation: 'FATHER_IN_LAW' },
        ],
        globalFilters: [],
      },
      [...edges, edge(abuBakr, muhammad, 'FATHER_IN_LAW')]
    );

    expect(visibleSubjects(localOnly)).toEqual(new Set([muhammad, khadijah, aisha, hafsa, abuBakr]));
    expect(localOnly.connections.map((connection) => connection.primary.type)).not.toContain('FATHER');

    const withGlobalFather = buildExploration(
      {
        roots: [muhammad],
        expansions: [
          { subject: muhammad, relation: 'WIFE' },
          { subject: muhammad, relation: 'FATHER_IN_LAW' },
        ],
        globalFilters: ['FATHER'],
      },
      [...edges, edge(abuBakr, muhammad, 'FATHER_IN_LAW')]
    );

    expect(withGlobalFather.connections).toContainEqual({
      primary: edge(abuBakr, aisha, 'FATHER'),
      reciprocal: edge(aisha, abuBakr, 'DAUGHTER'),
    });
  });

  it('keeps a locally revealed connection visible while the matching global filter is off', () => {
    const result = buildExploration(
      {
        roots: [muhammad],
        expansions: [
          { subject: muhammad, relation: 'WIFE' },
          { subject: aisha, relation: 'FATHER' },
        ],
        globalFilters: [],
      },
      edges
    );

    expect(result.connections).toContainEqual({
      primary: edge(abuBakr, aisha, 'FATHER'),
      reciprocal: edge(aisha, abuBakr, 'DAUGHTER'),
    });
  });

  it('reads both recorded companion directions from one toggle', () => {
    const salman = subjectId('person', 'salman-al-farisi');
    const bilal = subjectId('person', 'bilal-ibn-rabah');
    const companionEdges = [
      edge(salman, muhammad, 'COMPANION_OF'),
      edge(muhammad, salman, 'ACCOMPANIED_BY'),
      edge(muhammad, bilal, 'ACCOMPANIED_BY'),
    ];

    const result = buildExploration(
      { roots: [muhammad], expansions: [{ subject: muhammad, relation: 'COMPANION_OF' }], globalFilters: [] },
      companionEdges
    );

    expect(visibleSubjects(result)).toEqual(new Set([muhammad, salman, bilal]));
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
  it('makes a non-person root visible with no expansion, and leaves its connection to the other root for a contribution to reveal', () => {
    const badr = subjectId('battle', 'badr');
    const crossKindEdges = [...edges, edge(muhammad, badr, 'PARTICIPATED_IN')];

    const searched = buildExploration({ roots: [muhammad, badr], expansions: [], globalFilters: [] }, crossKindEdges);

    expect(visibleSubjects(searched)).toEqual(new Set([muhammad, badr]));
    expect(searched.connections).toEqual([]);

    const filtered = buildExploration(
      { roots: [muhammad, badr], expansions: [], globalFilters: ['PARTICIPATED_IN'] },
      crossKindEdges
    );

    expect(filtered.connections).toEqual([{ primary: edge(muhammad, badr, 'PARTICIPATED_IN') }]);
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
  describe('battle participation statuses', () => {
    const badr = subjectId('battle', 'badr');
    const uhud = subjectId('battle', 'uhud');
    const participation: StoredEdge[] = [
      { source: muhammad, target: badr, type: 'PARTICIPATED_IN', status: ['INJURED'] },
      { source: muhammad, target: uhud, type: 'PARTICIPATED_IN', status: ['CAPTURED'] },
      { source: aisha, target: badr, type: 'PARTICIPATED_IN', status: [] },
      edge(aisha, muhammad, 'WIFE'),
    ];

    function explore(statuses: string[] | undefined) {
      return buildExploration(
        {
          roots: [muhammad],
          expansions: [
            { subject: muhammad, relation: 'PARTICIPATED_IN' },
            { subject: muhammad, relation: 'WIFE' },
            { subject: aisha, relation: 'PARTICIPATED_IN' },
          ],
          globalFilters: [],
          statuses,
        },
        participation
      );
    }

    it('includes every status, recorded or not, until the user chooses', () => {
      expect(visibleSubjects(explore(undefined))).toEqual(new Set([muhammad, aisha, badr, uhud]));
    });

    it('matches several chosen statuses with OR', () => {
      expect(visibleSubjects(explore(['INJURED', 'CAPTURED']))).toEqual(new Set([muhammad, aisha, badr, uhud]));
    });

    it('drops a participation whose status was not chosen, and the battle nothing else supports', () => {
      const visible = visibleSubjects(explore(['INJURED']));

      expect(visible.has(badr)).toBe(true);
      expect(visible.has(uhud)).toBe(false);
    });

    it('keeps a person whose participation is filtered out but whose family relation still supports them', () => {
      const visible = visibleSubjects(explore(['INJURED']));

      expect(visible.has(aisha)).toBe(true);
      expect(explore(['INJURED']).connections).not.toContainEqual(
        expect.objectContaining({ primary: expect.objectContaining({ source: aisha, target: badr }) })
      );
    });

    it('treats an empty status array as its own choice, separate from the recorded values', () => {
      const visible = visibleSubjects(explore(['UNRECORDED']));

      expect(visible.has(badr)).toBe(true);
      expect(visible.has(uhud)).toBe(false);
    });

    it('matches nothing when the user turns every status off', () => {
      expect(visibleSubjects(explore([]))).toEqual(new Set([muhammad, aisha]));
    });
  });

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
