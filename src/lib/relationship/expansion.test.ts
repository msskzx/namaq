import { describe, expect, it } from 'vitest';
import { directRelationCounts, matchExpansionNeighbors } from './expansion';
import { StoredEdge, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const khadijah = subjectId('person', 'khadijah-bint-khuwaylid');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');
const hafsa = subjectId('person', 'hafsa-bint-umar');
const abuBakr = subjectId('person', 'abu-bakr-as-siddiq');
const umar = subjectId('person', 'umar-ibn-al-khattab');

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
];

describe('matchExpansionNeighbors', () => {
  it('resolves Wives against real seed-data direction: subject is the WIFE edge target', () => {
    expect(matchExpansionNeighbors(edges, muhammad, 'WIFE')).toEqual(
      expect.arrayContaining([khadijah, aisha, hafsa])
    );
    expect(matchExpansionNeighbors(edges, muhammad, 'WIFE')).toHaveLength(3);
  });

  it('resolves Father against real seed-data direction: subject is the FATHER edge target', () => {
    expect(matchExpansionNeighbors(edges, aisha, 'FATHER')).toEqual([abuBakr]);
    expect(matchExpansionNeighbors(edges, hafsa, 'FATHER')).toEqual([umar]);
  });

  it('does not confuse a reciprocal DAUGHTER edge with a FATHER request', () => {
    expect(matchExpansionNeighbors(edges, abuBakr, 'FATHER')).toEqual([]);
  });

  it('returns nothing for a subject with no matching edge', () => {
    expect(matchExpansionNeighbors(edges, muhammad, 'FATHER')).toEqual([]);
  });

  it('skips unbounded lineage relation ids instead of role-matching them', () => {
    expect(matchExpansionNeighbors(edges, muhammad, 'ANCESTORS')).toEqual([]);
    expect(matchExpansionNeighbors(edges, muhammad, 'PATERNAL_LINEAGE')).toEqual([]);
    expect(matchExpansionNeighbors(edges, muhammad, 'DESCENDANTS')).toEqual([]);
  });

  it('deduplicates a subject reached through more than one matching edge', () => {
    const duplicated: StoredEdge[] = [edge(khadijah, muhammad, 'WIFE'), edge(khadijah, muhammad, 'WIFE')];
    expect(matchExpansionNeighbors(duplicated, muhammad, 'WIFE')).toEqual([khadijah]);
  });
});

describe('directRelationCounts', () => {
  it('counts distinct subjects per eligible relation', () => {
    const counts = directRelationCounts(edges, muhammad, ['WIFE', 'FATHER']);
    expect(counts.get('WIFE')).toBe(3);
    expect(counts.get('FATHER')).toBe(0);
  });

  it('counts zero for lineage relation ids', () => {
    const counts = directRelationCounts(edges, muhammad, ['ANCESTORS']);
    expect(counts.get('ANCESTORS')).toBe(0);
  });
});
