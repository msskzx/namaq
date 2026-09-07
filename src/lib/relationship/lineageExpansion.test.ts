import { describe, expect, it } from 'vitest';
import { flattenLineageExpansions } from './lineageExpansion';
import { StoredEdge, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const abdullah = subjectId('person', 'abdullah-ibn-abd-al-muttalib');
const abdulMuttalib = subjectId('person', 'abd-al-muttalib');
const amina = subjectId('person', 'amina-bint-wahb');
const wahb = subjectId('person', 'wahb-ibn-abd-manaf');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');

function edge(source: string, target: string, type: StoredEdge['type']): StoredEdge {
  return { source, target, type };
}

const edges: StoredEdge[] = [
  edge(abdullah, muhammad, 'FATHER'),
  edge(amina, muhammad, 'MOTHER'),
  edge(abdulMuttalib, abdullah, 'FATHER'),
  edge(wahb, amina, 'FATHER'),
  edge(muhammad, aisha, 'WIFE'),
];

describe('flattenLineageExpansions', () => {
  it('passes non-lineage actions through unchanged', () => {
    const result = flattenLineageExpansions(edges, [{ subject: muhammad, relation: 'WIFE' }]);
    expect(result).toEqual([{ subject: muhammad, relation: 'WIFE' }]);
  });

  it('walks PATERNAL_LINEAGE into a chain of FATHER hops, stopping where the chain ends', () => {
    const result = flattenLineageExpansions(edges, [{ subject: muhammad, relation: 'PATERNAL_LINEAGE' }]);
    expect(result).toEqual([
      { subject: muhammad, relation: 'FATHER' },
      { subject: abdullah, relation: 'FATHER' },
    ]);
  });

  it('walks ANCESTORS into both FATHER and MOTHER hops at every generation', () => {
    const result = flattenLineageExpansions(edges, [{ subject: muhammad, relation: 'ANCESTORS' }]);
    expect(result).toEqual(
      expect.arrayContaining([
        { subject: muhammad, relation: 'FATHER' },
        { subject: muhammad, relation: 'MOTHER' },
        { subject: abdullah, relation: 'FATHER' },
        { subject: amina, relation: 'FATHER' },
      ])
    );
    expect(result).toHaveLength(4);
  });

  it('walks DESCENDANTS into SON/DAUGHTER hops', () => {
    // DAUGHTER edges are stored child -> parent (the DAUGHTER edge's target
    // is the parent being asked about), mirroring FATHER's own direction --
    // see expansion.test.ts's "resolves Father against real seed-data
    // direction" for the same convention applied to FATHER.
    const fatimah = subjectId('person', 'fatimah-bint-muhammad');
    const childEdges: StoredEdge[] = [edge(fatimah, muhammad, 'DAUGHTER')];
    const result = flattenLineageExpansions(childEdges, [{ subject: muhammad, relation: 'DESCENDANTS' }]);
    expect(result).toEqual([{ subject: muhammad, relation: 'DAUGHTER' }]);
  });

  it('produces no hops for a subject with no matching edges', () => {
    const result = flattenLineageExpansions(edges, [{ subject: aisha, relation: 'PATERNAL_LINEAGE' }]);
    expect(result).toEqual([]);
  });

  it('terminates on a cyclic edge set instead of looping forever, without dropping the real one-hop facts at each node', () => {
    const cyclic: StoredEdge[] = [edge(muhammad, abdullah, 'FATHER'), edge(abdullah, muhammad, 'FATHER')];
    const result = flattenLineageExpansions(cyclic, [{ subject: muhammad, relation: 'PATERNAL_LINEAGE' }]);
    expect(result).toEqual([
      { subject: muhammad, relation: 'FATHER' },
      { subject: abdullah, relation: 'FATHER' },
    ]);
  });
});
