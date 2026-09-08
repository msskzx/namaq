import { describe, expect, it } from 'vitest';
import { findSeedRelationDrift, parseSeedRelations } from './seedRelations';

const wife = { from: 'khadijah', to: 'prophet-muhammad', type: 'WIFE' };
const husband = { from: 'prophet-muhammad', to: 'khadijah', type: 'HUSBAND' };

describe('parseSeedRelations', () => {
  it('preserves the declared endpoints and type, and rejects queries it cannot read', () => {
    expect(parseSeedRelations([
      'MATCH (from:Person {slug: "khadijah"}), (to:Person {slug: "prophet-muhammad"}) CREATE (from)-[:WIFE]->(to);',
    ])).toEqual([wife]);
    expect(() => parseSeedRelations(['MATCH (n) RETURN n'])).toThrow('Unparseable relation seed query');
  });
});

describe('findSeedRelationDrift', () => {
  it('reports a declared inverse missing from the live graph', () => {
    expect(findSeedRelationDrift([wife, husband], [wife])).toEqual({
      missing: ['prophet-muhammad -[:HUSBAND]-> khadijah'],
      unexpected: [],
    });
  });

  it('would have caught the four live-only inverted parent edges', () => {
    const correct = ['al-hasan-ibn-ali', 'al-husayn-ibn-ali'].flatMap(to => [
      { from: 'ali-ibn-abi-talib', to, type: 'FATHER' },
      { from: 'fatimah-bint-muhammad', to, type: 'MOTHER' },
    ]);
    const inverted = correct.map(edge => ({ ...edge, from: edge.to, to: edge.from }));
    expect(findSeedRelationDrift(correct, [...correct, ...inverted])).toEqual({
      missing: [],
      unexpected: [
        'al-hasan-ibn-ali -[:FATHER]-> ali-ibn-abi-talib',
        'al-hasan-ibn-ali -[:MOTHER]-> fatimah-bint-muhammad',
        'al-husayn-ibn-ali -[:FATHER]-> ali-ibn-abi-talib',
        'al-husayn-ibn-ali -[:MOTHER]-> fatimah-bint-muhammad',
      ],
    });
  });

  it('reports missing and unexpected edges together without treating a reversed edge as equivalent', () => {
    expect(findSeedRelationDrift([husband], [{ ...husband, from: husband.to, to: husband.from }])).toEqual({
      missing: ['prophet-muhammad -[:HUSBAND]-> khadijah'],
      unexpected: ['khadijah -[:HUSBAND]-> prophet-muhammad'],
    });
  });

  it('ignores sync-owned types on either side while retaining unknown person relations', () => {
    const synced = ['COMPANION_OF', 'ACCOMPANIED_BY', 'HOLDS_TITLE', 'PARTICIPATED_IN', 'INVOLVED_IN', 'PART_OF']
      .map(type => ({ from: 'one', to: 'two', type }));
    const drift = findSeedRelationDrift(synced, [
      ...synced.map(edge => ({ ...edge, from: 'three' })),
      { from: 'one', to: 'two', type: 'UNKNOWN' },
    ]);
    expect(drift).toEqual({ missing: [], unexpected: ['one -[:UNKNOWN]-> two'] });
  });

  it('compares edge presence independently of ordering and duplicates', () => {
    expect(findSeedRelationDrift([wife, husband, wife], [husband, wife, husband])).toEqual({ missing: [], unexpected: [] });
  });
});
