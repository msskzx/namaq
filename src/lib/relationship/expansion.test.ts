import { describe, expect, it } from 'vitest';
import { LINEAGE_ACTIONS, directRelationCounts, matchExpansionNeighbors } from './expansion';
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

describe('one-way relations', () => {
  const badr = subjectId('battle', 'badr');
  const companion = subjectId('title', 'sahabi');
  const hijra = subjectId('event', 'hijra');
  // Every cross-kind edge is stored Person -> other kind; nothing points back.
  const crossKind: StoredEdge[] = [
    { source: muhammad, target: badr, type: 'PARTICIPATED_IN' },
    { source: muhammad, target: companion, type: 'HOLDS_TITLE' },
    { source: khadijah, target: companion, type: 'HOLDS_TITLE' },
    { source: muhammad, target: hijra, type: 'INVOLVED_IN' },
    { source: hijra, target: badr, type: 'PART_OF' },
  ];

  it('reaches the title from the person who holds it', () => {
    expect(matchExpansionNeighbors(crossKind, muhammad, 'HOLDS_TITLE')).toEqual([companion]);
  });

  it('reaches every holder from the title', () => {
    expect(matchExpansionNeighbors(crossKind, companion, 'HOLDS_TITLE')).toEqual([muhammad, khadijah]);
  });

  it('reaches the battle from the participant and the participant from the battle', () => {
    expect(matchExpansionNeighbors(crossKind, muhammad, 'PARTICIPATED_IN')).toEqual([badr]);
    expect(matchExpansionNeighbors(crossKind, badr, 'PARTICIPATED_IN')).toEqual([muhammad]);
  });

  it('reads PART_OF from either end, since an event and its battle both matter', () => {
    expect(matchExpansionNeighbors(crossKind, hijra, 'PART_OF')).toEqual([badr]);
    expect(matchExpansionNeighbors(crossKind, badr, 'PART_OF')).toEqual([hijra]);
  });

  it('still reads reciprocal relations one way, so a FATHER request never returns a child', () => {
    // muhammad -FATHER-> fatimah means muhammad is her father; asking muhammad
    // for his own FATHER must not answer with her.
    const fatimah = subjectId('person', 'fatimah-bint-muhammad');
    const family: StoredEdge[] = [
      { source: muhammad, target: fatimah, type: 'FATHER' },
      { source: fatimah, target: muhammad, type: 'DAUGHTER' },
    ];
    expect(matchExpansionNeighbors(family, muhammad, 'FATHER')).toEqual([]);
    expect(matchExpansionNeighbors(family, fatimah, 'FATHER')).toEqual([muhammad]);
  });
});

describe('directRelationCounts', () => {
  it('counts distinct subjects per eligible relation', () => {
    const counts = directRelationCounts(edges, muhammad, ['WIFE', 'FATHER']);
    expect(counts.get('WIFE')).toBe(3);
    expect(counts.get('FATHER')).toBe(0);
  });

  it('counts a one-way relation from either end', () => {
    const badr = subjectId('battle', 'badr');
    const crossKind: StoredEdge[] = [{ source: muhammad, target: badr, type: 'PARTICIPATED_IN' }];
    expect(directRelationCounts(crossKind, muhammad, ['PARTICIPATED_IN']).get('PARTICIPATED_IN')).toBe(1);
    expect(directRelationCounts(crossKind, badr, ['PARTICIPATED_IN']).get('PARTICIPATED_IN')).toBe(1);
  });

  it('counts zero for lineage relation ids', () => {
    const counts = directRelationCounts(edges, muhammad, ['ANCESTORS']);
    expect(counts.get('ANCESTORS')).toBe(0);
  });
});

describe('LINEAGE_ACTIONS', () => {
  it('lists the three lineage actions in display order', () => {
    expect(LINEAGE_ACTIONS).toEqual(['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS']);
  });
});
