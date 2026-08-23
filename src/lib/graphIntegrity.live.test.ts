/**
 * Unlike every other test in this repo, this one is not pure — it queries
 * the real Neo4j instance from .env (see AGENTS.md "Local verification").
 * Skips itself when Neo4j credentials aren't configured, so `npm test`
 * still passes in an environment without live infra (CI, a worktree with
 * no `.env` symlink); runs for real whenever they are.
 */

import { afterAll, describe, expect, it } from 'vitest';
import { findDuplicateLabelGroups, findIsolatedNodes } from './graphIntegrity';
import { fetchUnifiedGraph } from './fetchUnifiedGraph';
import { getDriver } from './neo4j';
import { graphNodeKey } from './graphRank';

const hasNeo4jConfig = Boolean(process.env.NEO4J_URI && process.env.NEO4J_USERNAME && process.env.NEO4J_PASSWORD);

describe.skipIf(!hasNeo4jConfig)('unified graph connectivity (live Neo4j)', () => {
  afterAll(async () => {
    await getDriver().close();
  });

  it('has no Person/Battle/Title/Event node with zero relationships', async () => {
    const { nodes, edges } = await fetchUnifiedGraph();
    const isolated = findIsolatedNodes(nodes, edges);

    if (isolated.length > 0) {
      const list = isolated
        .map((node) => `  - ${graphNodeKey(node)}`)
        .join('\n');
      console.error(`${isolated.length} isolated node(s) with no relationships:\n${list}`);
    }

    expect(isolated, `${isolated.length} isolated node(s): ${isolated.map(graphNodeKey).join(', ')}`).toEqual([]);
  }, 30000);

  it('has no node duplicated under a different slug (same type, same display name)', async () => {
    const { nodes } = await fetchUnifiedGraph();
    const duplicates = findDuplicateLabelGroups(nodes);

    if (duplicates.length > 0) {
      const list = duplicates
        .map((group) => `  - "${group.label}" (${group.nodes.length}x): ${group.nodes.map(graphNodeKey).join(', ')}`)
        .join('\n');
      console.error(`${duplicates.length} duplicate label group(s):\n${list}`);
    }

    expect(
      duplicates,
      `${duplicates.length} duplicate label group(s): ${duplicates.map((group) => group.label).join(', ')}`,
    ).toEqual([]);
  }, 30000);
});
