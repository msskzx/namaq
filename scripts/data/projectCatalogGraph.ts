import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { catalogRelations } from '../../src/lib/catalog/relations';
import { findSeedRelationDrift } from '../../neo4j/seedRelations';
import { getDriver } from '../../src/lib/neo4j';

const apply = process.argv.includes('--apply');

const deployedQuery = `
  MATCH (source:Person)-[relation]->(target:Person)
  RETURN source.slug AS source, target.slug AS target, type(relation) AS type
`;

/**
 * MATCH, not MERGE, on the people: this links people who already have nodes,
 * which people:sync creates from their PostgreSQL rows and the graph seeds
 * create for those without one. A relation whose end is missing stays reported
 * rather than inventing a node with nothing but a slug.
 *
 * Cypher cannot parameterize a relationship type, so one query per type.
 */
const upsertQuery = (type: string) => `
  UNWIND $edges AS edge
  MATCH (from:Person {slug: edge.from}), (to:Person {slug: edge.to})
  MERGE (from)-[:${type}]->(to)
`;

async function main() {
  const catalog = await loadCatalog();
  const edges = catalogRelations(catalog);

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const result = await session.run(deployedQuery);
    const deployed = result.records.map((record) => ({
      from: record.get('source') as string,
      to: record.get('target') as string,
      type: record.get('type') as string,
    }));

    // Only what the catalog declares is compared: the graph seeds author the
    // rest, and this script is not the place to report their drift.
    const { missing } = findSeedRelationDrift(edges, deployed);
    console.log(`Catalog relations (${apply ? 'apply' : 'dry run'})`);
    console.log(`  declared ${edges.length}, missing from Neo4j ${missing.length}`);
    missing.forEach((edge) => console.log(`  ${edge}`));

    if (missing.length === 0) return;
    if (!apply) {
      console.log('Nothing written. Re-run with --apply to write them.');
      return;
    }
  } finally {
    await session.close();
  }

  const writeSession = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.WRITE,
  });
  try {
    await writeSession.executeWrite(async (transaction) => {
      for (const type of new Set(edges.map((edge) => edge.type))) {
        const ofType = edges.filter((edge) => edge.type === type);
        await transaction.run(upsertQuery(type), { edges: ofType });
      }
    });
    console.log(`Wrote ${edges.length} relation(s) to Neo4j.`);
  } finally {
    await writeSession.close();
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => getDriver().close());
