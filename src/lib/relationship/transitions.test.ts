import { describe, expect, it } from 'vitest';
import { buildExploration, ExplorationInput } from './exploration';
import {
  collapseBranch,
  DEFAULT_LINEAGE_ACTIONS,
  defaultExplorationInput,
  keepOnlySelected,
  removeSearchRoot,
  removeSubject,
  restoreSubject,
} from './transitions';
import { flattenLineageExpansions } from './lineageExpansion';
import { StoredEdge, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');
const hafsa = subjectId('person', 'hafsa-bint-umar');
const abuBakr = subjectId('person', 'abu-bakr-as-siddiq');
const umar = subjectId('person', 'umar-ibn-al-khattab');
const uthmanIbnAmir = subjectId('person', 'uthman-ibn-amir');

function edge(source: string, target: string, type: StoredEdge['type']): StoredEdge {
  return { source, target, type };
}

const edges: StoredEdge[] = [
  edge(aisha, muhammad, 'WIFE'),
  edge(hafsa, muhammad, 'WIFE'),
  edge(abuBakr, aisha, 'FATHER'),
  edge(aisha, abuBakr, 'DAUGHTER'),
  edge(umar, hafsa, 'FATHER'),
  edge(uthmanIbnAmir, abuBakr, 'FATHER'),
];

function visible(input: ExplorationInput): Set<string> {
  return new Set(buildExploration(input, edges).visible.keys());
}

const wivesThenFathers: ExplorationInput = {
  roots: [muhammad],
  expansions: [
    { subject: muhammad, relation: 'WIFE' },
    { subject: aisha, relation: 'FATHER' },
    { subject: abuBakr, relation: 'FATHER' },
  ],
  globalFilters: [],
};

describe('collapseBranch', () => {
  it('keeps the collapsed subject and drops the expansions it fed', () => {
    const next = collapseBranch(wivesThenFathers, muhammad, edges);

    expect(visible(next)).toEqual(new Set([muhammad]));
    expect(next.expansions).toEqual([]);
  });

  it('collapses only the named branch, leaving the rest of the exploration standing', () => {
    const next = collapseBranch(wivesThenFathers, abuBakr, edges);

    expect(visible(next)).toEqual(new Set([muhammad, aisha, hafsa, abuBakr]));
    expect(visible(next).has(uthmanIbnAmir)).toBe(false);
  });

  it('preserves a subject an independent search still supports', () => {
    const next = collapseBranch({ ...wivesThenFathers, roots: [muhammad, abuBakr] }, muhammad, edges);

    expect(visible(next)).toEqual(new Set([muhammad, abuBakr, uthmanIbnAmir]));
  });

  it('preserves a subject an active global filter still reaches', () => {
    const next = collapseBranch({ ...wivesThenFathers, globalFilters: ['WIFE'] }, muhammad, edges);

    expect(visible(next)).toEqual(new Set([muhammad, aisha, hafsa, abuBakr, uthmanIbnAmir]));
  });
});

describe('removeSubject', () => {
  it('hides the subject, collapses its branch, and blocks a global filter from bringing it back', () => {
    const next = removeSubject({ ...wivesThenFathers, globalFilters: ['WIFE'] }, aisha, edges);

    expect(next.removed).toEqual([aisha]);
    expect(visible(next).has(aisha)).toBe(false);
    expect(visible(next).has(abuBakr)).toBe(false);
    expect(visible(next).has(hafsa)).toBe(true);
  });

  it('leaves cap history untouched, so restoring the subject does not restore its eligibility', () => {
    const capped: ExplorationInput = { ...wivesThenFathers, caps: [{ subject: aisha, relation: 'WIFE' }] };
    const removedThenRestored = restoreSubject(removeSubject(capped, aisha, edges), aisha);

    expect(removedThenRestored.caps).toEqual([{ subject: aisha, relation: 'WIFE' }]);
    expect(removedThenRestored.removed).toEqual([]);
    expect(visible(removedThenRestored).has(aisha)).toBe(true);
  });
});

describe('removeSearchRoot', () => {
  it('drops only the search contribution, keeping a subject its own expansion still holds', () => {
    const input: ExplorationInput = {
      roots: [muhammad, abuBakr],
      expansions: [{ subject: abuBakr, relation: 'FATHER' }],
      globalFilters: [],
    };

    const next = removeSearchRoot(input, abuBakr);

    expect(visible(next)).toEqual(new Set([muhammad, abuBakr, uthmanIbnAmir]));
  });

  it('drops the subjects that root alone supported', () => {
    const input: ExplorationInput = { roots: [muhammad, aisha], expansions: [{ subject: aisha, relation: 'FATHER' }], globalFilters: [] };

    const next = removeSearchRoot(input, muhammad);

    expect(visible(next)).toEqual(new Set([aisha, abuBakr]));
  });
});

describe('keepOnlySelected', () => {
  it('keeps the selected subject with its own choices, resets global filters, and discards other branches', () => {
    const next = keepOnlySelected({ ...wivesThenFathers, globalFilters: ['FATHER'] }, aisha);

    expect(next.roots).toEqual([aisha]);
    expect(next.globalFilters).toEqual([]);
    expect(next.expansions).toEqual([{ subject: aisha, relation: 'FATHER' }]);
    expect(visible(next)).toEqual(new Set([aisha, abuBakr]));
  });

  it('preserves cap history, which Start over alone clears', () => {
    const capped: ExplorationInput = { ...wivesThenFathers, caps: [{ subject: abuBakr, relation: 'FATHER' }] };

    expect(keepOnlySelected(capped, aisha).caps).toEqual([{ subject: abuBakr, relation: 'FATHER' }]);
  });
});

describe('defaultExplorationInput', () => {
  it('opens on the target subject with its line in both directions and nothing else on', () => {
    const input = defaultExplorationInput('prophet-muhammad');

    expect(input.roots).toEqual([muhammad]);
    expect(input.expansions.map((action) => action.relation)).toEqual([...DEFAULT_LINEAGE_ACTIONS]);
    expect(input.globalFilters).toEqual([]);
    expect(input.caps).toEqual([]);
    expect(input.removed).toEqual([]);
  });

  it('walks the whole line in both directions, and leaves a wife out of it', () => {
    const abdullah = subjectId('person', 'abdullah-ibn-abd-al-muttalib');
    const abdAlMuttalib = subjectId('person', 'abd-al-muttalib-ibn-hashim');
    const fatimah = subjectId('person', 'fatimah-bint-muhammad');
    const hasan = subjectId('person', 'al-hasan-ibn-ali');
    const lineage: StoredEdge[] = [
      edge(abdullah, muhammad, 'FATHER'),
      edge(abdAlMuttalib, abdullah, 'FATHER'),
      edge(fatimah, muhammad, 'DAUGHTER'),
      edge(hasan, fatimah, 'SON'),
      edge(aisha, muhammad, 'WIFE'),
    ];

    // A lineage action stands for an unbounded walk, which the graph hook
    // flattens into per-hop expansions before building (see
    // src/components/graph/useExplorationGraph.ts).
    const input = defaultExplorationInput('prophet-muhammad');
    const walked = { ...input, expansions: flattenLineageExpansions(lineage, input.expansions) };
    const shown = new Set(buildExploration(walked, lineage).visible.keys());

    expect(shown).toEqual(new Set([muhammad, abdullah, abdAlMuttalib, fatimah, hasan]));
  });
});
