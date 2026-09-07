import { RelationType, StoredEdge, SubjectId } from './types';

// Every pair of relation types from translations.ts's relationTypes
// vocabulary that name the two roles of one real-world relationship (e.g.
// FATHER and SON/DAUGHTER, or two people who are each other's BROTHER).
// This is a property of the vocabulary itself, not of neo4j/graphSeedData*.ts
// -- the seed data is a work in progress and is seeded one-sided far more
// often than not (most WIFE edges have no reciprocal HUSBAND edge yet,
// PATERNAL_UNCLE currently has no seeded PATERNAL_NEPHEW/NIECE at all), so
// buildLogicalConnections must collapse a pair whenever both sides do exist
// regardless of how rare that currently is, rather than only pairing types
// already seeded together. Only relation types with no defined reciprocal
// term in the vocabulary at all are excluded: MAWLA and CONCUBINE (no
// separate term for the other side of that relationship), and the four
// non-person relation types (PARTICIPATED_IN, HOLDS_TITLE, INVOLVED_IN,
// PART_OF), which connect Person to Battle/Title/Event and have no
// reciprocal edge type recorded in either direction.
export const RECIPROCAL_ROLE_PAIRS: ReadonlyArray<readonly [RelationType, RelationType]> = [
  ['FATHER', 'SON'],
  ['FATHER', 'DAUGHTER'],
  ['MOTHER', 'SON'],
  ['MOTHER', 'DAUGHTER'],
  ['STEP_FATHER', 'STEP_SON'],
  ['STEP_FATHER', 'STEP_DAUGHTER'],
  ['STEP_MOTHER', 'STEP_SON'],
  ['STEP_MOTHER', 'STEP_DAUGHTER'],
  ['HUSBAND', 'WIFE'],
  ['BROTHER', 'BROTHER'],
  ['BROTHER', 'SISTER'],
  ['SISTER', 'SISTER'],
  ['HALF_BROTHER', 'HALF_BROTHER'],
  ['HALF_BROTHER', 'HALF_SISTER'],
  ['HALF_SISTER', 'HALF_SISTER'],
  ['STEP_BROTHER', 'STEP_BROTHER'],
  ['STEP_BROTHER', 'STEP_SISTER'],
  ['STEP_SISTER', 'STEP_SISTER'],
  ['GRANDFATHER', 'GRANDSON'],
  ['GRANDFATHER', 'GRANDDAUGHTER'],
  ['GRANDMOTHER', 'GRANDSON'],
  ['GRANDMOTHER', 'GRANDDAUGHTER'],
  ['MATERNAL_UNCLE', 'MATERNAL_NEPHEW'],
  ['MATERNAL_UNCLE', 'MATERNAL_NIECE'],
  ['PATERNAL_UNCLE', 'PATERNAL_NEPHEW'],
  ['PATERNAL_UNCLE', 'PATERNAL_NIECE'],
  ['MATERNAL_AUNT', 'MATERNAL_NEPHEW'],
  ['MATERNAL_AUNT', 'MATERNAL_NIECE'],
  ['PATERNAL_AUNT', 'PATERNAL_NEPHEW'],
  ['PATERNAL_AUNT', 'PATERNAL_NIECE'],
  ['MATERNAL_COUSIN', 'MATERNAL_COUSIN'],
  ['PATERNAL_COUSIN', 'PATERNAL_COUSIN'],
  ['MOTHER_IN_LAW', 'SON_IN_LAW'],
  ['MOTHER_IN_LAW', 'DAUGHTER_IN_LAW'],
  ['FATHER_IN_LAW', 'SON_IN_LAW'],
  ['FATHER_IN_LAW', 'DAUGHTER_IN_LAW'],
  ['BROTHER_IN_LAW', 'BROTHER_IN_LAW'],
  ['BROTHER_IN_LAW', 'SISTER_IN_LAW'],
  ['SISTER_IN_LAW', 'SISTER_IN_LAW'],
  ['ANCESTOR', 'DESCENDANT'],
  ['ACCOMPANIED_BY', 'COMPANION_OF'],
];

function isReciprocalPair(a: RelationType, b: RelationType): boolean {
  return RECIPROCAL_ROLE_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export interface LogicalConnection {
  primary: StoredEdge;
  reciprocal?: StoredEdge;
}

function unorderedPairKey(a: SubjectId, b: SubjectId): string {
  return [a, b].sort().join('|');
}

// Groups edges by the unordered pair of subjects they connect, then pairs
// off edges whose types are opposite entries in RECIPROCAL_ROLE_PAIRS into
// one LogicalConnection -- e.g. Muhammad -[:FATHER]-> Fatimah and
// Fatimah -[:DAUGHTER]-> Muhammad become one connection instead of two. Edge
// types between the same two subjects that are not each other's reciprocal
// (e.g. COMPANION_OF alongside FATHER_IN_LAW) stay as separate connections.
export function buildLogicalConnections(edges: StoredEdge[]): LogicalConnection[] {
  const byPair = new Map<string, StoredEdge[]>();
  for (const edge of edges) {
    const key = unorderedPairKey(edge.source, edge.target);
    byPair.set(key, [...(byPair.get(key) ?? []), edge]);
  }

  const connections: LogicalConnection[] = [];
  for (const pairEdges of byPair.values()) {
    const used = new Set<number>();
    pairEdges.forEach((edge, index) => {
      if (used.has(index)) return;
      const reciprocalIndex = pairEdges.findIndex((candidate, candidateIndex) =>
        candidateIndex !== index &&
        !used.has(candidateIndex) &&
        candidate.source === edge.target &&
        candidate.target === edge.source &&
        isReciprocalPair(edge.type, candidate.type)
      );
      if (reciprocalIndex === -1) {
        connections.push({ primary: edge });
      } else {
        connections.push({ primary: edge, reciprocal: pairEdges[reciprocalIndex] });
        used.add(reciprocalIndex);
      }
      used.add(index);
    });
  }
  return connections;
}

// Resolves which raw edge to render for a given selection: subject-first
// when the selection is the reciprocal edge's source, otherwise the
// primary edge's stable factual orientation -- including when there is no
// reciprocal to evidence the selected subject's role at all.
export function describeConnection(connection: LogicalConnection, selectedSubject: SubjectId | null): StoredEdge {
  if (selectedSubject && connection.reciprocal?.source === selectedSubject) {
    return connection.reciprocal;
  }
  return connection.primary;
}
