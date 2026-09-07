import { describe, expect, it } from 'vitest';
import { buildLogicalConnections, describeConnection } from './connections';
import { StoredEdge, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const fatimah = subjectId('person', 'fatimah-bint-muhammad');
const abuBakr = subjectId('person', 'abu-bakr-as-siddiq');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');

function edge(source: string, target: string, type: StoredEdge['type']): StoredEdge {
  return { source, target, type };
}

describe('buildLogicalConnections', () => {
  it('collapses a reciprocal pair into one connection', () => {
    const father = edge(muhammad, fatimah, 'FATHER');
    const daughter = edge(fatimah, muhammad, 'DAUGHTER');

    const connections = buildLogicalConnections([father, daughter]);

    expect(connections).toEqual([{ primary: father, reciprocal: daughter }]);
  });

  it('keeps a non-reciprocal pair between the same subjects as two separate connections', () => {
    const fatherInLaw = edge(abuBakr, muhammad, 'FATHER_IN_LAW');
    const companionOf = edge(muhammad, abuBakr, 'COMPANION_OF');

    const connections = buildLogicalConnections([fatherInLaw, companionOf]);

    expect(connections).toEqual(
      expect.arrayContaining([{ primary: fatherInLaw }, { primary: companionOf }])
    );
    expect(connections).toHaveLength(2);
  });

  it('leaves a one-sided edge as a connection with no reciprocal', () => {
    const wife = edge(aisha, muhammad, 'WIFE');

    const connections = buildLogicalConnections([wife]);

    expect(connections).toEqual([{ primary: wife }]);
  });

  it('collapses a pair with no seeded example yet, since the pairing comes from the vocabulary not the seed data', () => {
    const uncle = subjectId('person', 'hamzah-ibn-abd-al-muttalib');
    const nephew = subjectId('person', 'prophet-muhammad');
    const paternalUncle = edge(uncle, nephew, 'PATERNAL_UNCLE');
    const paternalNephew = edge(nephew, uncle, 'PATERNAL_NEPHEW');

    const connections = buildLogicalConnections([paternalUncle, paternalNephew]);

    expect(connections).toEqual([{ primary: paternalUncle, reciprocal: paternalNephew }]);
  });

  it('pairs a self-typed reciprocal (e.g. two BROTHER edges) between the same subjects', () => {
    const a = subjectId('person', 'uthman-ibn-hunayf');
    const b = subjectId('person', 'sahl-ibn-hunayf');
    const aToB = edge(a, b, 'BROTHER');
    const bToA = edge(b, a, 'BROTHER');

    const connections = buildLogicalConnections([aToB, bToA]);

    expect(connections).toEqual([{ primary: aToB, reciprocal: bToA }]);
  });
});

describe('describeConnection', () => {
  const father = edge(muhammad, fatimah, 'FATHER');
  const daughter = edge(fatimah, muhammad, 'DAUGHTER');
  const connection = { primary: father, reciprocal: daughter };

  it('flips to the reciprocal edge when the selected subject is its source', () => {
    expect(describeConnection(connection, fatimah)).toBe(daughter);
  });

  it('keeps the primary edge when the selected subject is already its source', () => {
    expect(describeConnection(connection, muhammad)).toBe(father);
  });

  it('keeps the primary edge when the connection does not touch the selection', () => {
    expect(describeConnection(connection, abuBakr)).toBe(father);
  });

  it('retains the primary edge factual direction when no reciprocal evidence exists', () => {
    const wife = edge(aisha, muhammad, 'WIFE');
    expect(describeConnection({ primary: wife }, muhammad)).toBe(wife);
  });
});
