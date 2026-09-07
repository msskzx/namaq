import { describe, expect, it } from 'vitest';
import { mapExplorationToGraphData } from './renderExploration';
import { buildExploration, ExplorationInput } from './exploration';
import { GraphNodeFull } from '@/types/graph';
import { StoredEdge, SubjectId, subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');
const abuBakr = subjectId('person', 'abu-bakr-as-siddiq');

function edge(source: string, target: string, type: StoredEdge['type']): StoredEdge {
  return { source, target, type };
}

const edges: StoredEdge[] = [
  edge(aisha, muhammad, 'WIFE'),
  edge(abuBakr, aisha, 'FATHER'),
  edge(aisha, abuBakr, 'DAUGHTER'),
];

function node(id: SubjectId, label: string): GraphNodeFull {
  return { id, label, slug: id.split(':')[1], group: 1, type: id.split(':')[0] };
}

const nodesById = new Map<SubjectId, GraphNodeFull>([
  [muhammad, node(muhammad, 'Prophet Muhammad')],
  [aisha, node(aisha, 'Aisha')],
  [abuBakr, node(abuBakr, 'Abu Bakr')],
]);

const input: ExplorationInput = {
  roots: [muhammad],
  expansions: [
    { subject: muhammad, relation: 'WIFE' },
    { subject: aisha, relation: 'FATHER' },
  ],
  globalFilters: [],
};

describe('mapExplorationToGraphData', () => {
  it('maps every visible subject to its GraphNodeFull, in no particular guaranteed order', () => {
    const exploration = buildExploration(input, edges);
    const result = mapExplorationToGraphData(exploration, nodesById, null);
    expect(new Set(result.nodes.map((n) => n.id))).toEqual(new Set([muhammad, aisha, abuBakr]));
  });

  it('omits a visible subject with no corresponding fetched node data instead of throwing', () => {
    const exploration = buildExploration(input, edges);
    const partial = new Map(nodesById);
    partial.delete(abuBakr);
    const result = mapExplorationToGraphData(exploration, partial, null);
    expect(result.nodes.some((n) => n.id === abuBakr)).toBe(false);
  });

  it('describes each connection from the selected subject\'s perspective', () => {
    const exploration = buildExploration(input, edges);

    const fromAbuBakr = mapExplorationToGraphData(exploration, nodesById, abuBakr);
    const fatherLink = fromAbuBakr.links.find((l) => l.label === 'FATHER' || l.label === 'DAUGHTER');
    expect(fatherLink).toEqual({ source: abuBakr, target: aisha, label: 'FATHER', value: 1, status: undefined });

    const fromAisha = mapExplorationToGraphData(exploration, nodesById, aisha);
    const daughterLink = fromAisha.links.find((l) => l.label === 'FATHER' || l.label === 'DAUGHTER');
    expect(daughterLink).toEqual({ source: aisha, target: abuBakr, label: 'DAUGHTER', value: 1, status: undefined });
  });
});
