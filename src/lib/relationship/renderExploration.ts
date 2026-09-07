import { GraphData, GraphNodeFull } from '@/types/graph';
import { describeConnection } from './connections';
import { ExplorationResult } from './exploration';
import { SubjectId } from './types';

export function mapExplorationToGraphData(
  exploration: ExplorationResult,
  nodesById: Map<SubjectId, GraphNodeFull>,
  selectedSubject: SubjectId | null
): GraphData {
  const nodes: GraphNodeFull[] = [];
  for (const subject of exploration.visible.keys()) {
    const node = nodesById.get(subject);
    if (node) nodes.push(node);
  }

  const links = exploration.connections.map((connection) => {
    const edge = describeConnection(connection, selectedSubject);
    return { source: edge.source, target: edge.target, label: edge.type, value: 1, status: edge.status };
  });

  return { nodes, links };
}
