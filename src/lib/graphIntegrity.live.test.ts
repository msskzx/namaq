/**
 * Unlike every other test in this repo, this one is not pure — it queries
 * the real Neo4j instance from .env (see AGENTS.md "Local verification").
 * Skips itself when Neo4j credentials aren't configured, so `npm test`
 * still passes in an environment without live infra (CI, a worktree with
 * no `.env` symlink); runs for real whenever they are.
 */

import { afterAll, describe, expect, it } from 'vitest';
import { excludeKnownHomonyms, findDuplicateLabelGroups, findIsolatedNodes } from './graphIntegrity';
import { fetchUnifiedGraph } from './fetchUnifiedGraph';
import { getDriver } from './neo4j';
import { graphNodeKey } from './graphRank';

const hasNeo4jConfig = Boolean(process.env.NEO4J_URI && process.env.NEO4J_USERNAME && process.env.NEO4J_PASSWORD);

// Two different real historical people who share a display name, verified
// against the seed data's own "Same-name collisions disambiguated by
// father" documentation and deliberately modeled as separate nodes -- not
// an accidental duplicate. Keyed by exact node-key set (see
// excludeKnownHomonyms) so a different, unexpected collision that happens
// to reuse one of these slugs still surfaces.
const KNOWN_HOMONYM_GROUPS: ReadonlySet<string>[] = [
  // neo4j/graphSeedData3.ts:72 vs graphSeedData2.ts:9 -- Hashim ibn Abd
  // Manaf of Banu Hashim (the Prophet's great-grandfather) vs of Banu Abd
  // al-Dar ("al-Abdari").
  new Set(['person:hashim-ibn-abd-manaf', 'person:hashim-ibn-abd-manaf-al-abdari']),
  // neo4j/graphSeedData4.ts:18-22 -- the Quraysh ancestor Malik ibn
  // al-Nadr vs an unrelated Ansari (Banu al-Najjar) figure of the same
  // name, father of al-Baraa ibn Malik.
  new Set(['person:malik-ibn-an-nadr', 'person:malik-ibn-an-nadr-al-najjari']),
  // neo4j/graphSeedData5.ts:27-32 -- Zayd ibn Haram of Banu al-Najjar
  // (ancestor of al-Baraa ibn Malik) vs a different Khazraji Zayd ibn
  // Haram of Banu Salamah (father of al-Jumuh).
  new Set(['person:zayd-ibn-haram', 'person:zayd-ibn-haram-ibn-kaab']),
  // Two different people named Abdullah ibn al-Harith, distinguished by
  // their own father's name in the slug itself (ibn-abd-al-muttalib vs
  // ibn-nawfal).
  new Set(['person:abdullah-ibn-al-harith-ibn-abd-al-muttalib', 'person:abdullah-ibn-al-harith-ibn-nawfal']),
];

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
    const duplicates = excludeKnownHomonyms(findDuplicateLabelGroups(nodes), KNOWN_HOMONYM_GROUPS);

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
