import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { catalogRelations } from '../../src/lib/catalog/relations';
import { findSeedRelationDrift } from '../../neo4j/seedRelations';
import { getDriver } from '../../src/lib/neo4j';
import { seedAuthoredPeople } from './seedAuthored';

const apply = process.argv.includes('--apply');

// Mirrors neo4j/seedRelations.ts: these belong to their own sync scripts.
const SYNC_OWNED = ['COMPANION_OF', 'ACCOMPANIED_BY', 'HOLDS_TITLE', 'PARTICIPATED_IN', 'ABSENT_FROM', 'INVOLVED_IN', 'PART_OF'];

let stale: { from: string; to: string; type: string }[] = [];

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

// Only edges touching a person the catalog owns outright, and only the types
// no sync owns: an edge between two seed-authored people is the seeds' to keep.
const staleQuery = `
  UNWIND $slugs AS slug
  MATCH (person:Person {slug: slug})-[relation]-(other:Person)
  WHERE NOT type(relation) IN $syncOwned
  RETURN startNode(relation).slug AS from, endNode(relation).slug AS to, type(relation) AS type
`;

const deleteQuery = (type: string) => `
  UNWIND $edges AS edge
  MATCH (from:Person {slug: edge.from})-[relation:${type}]->(to:Person {slug: edge.to})
  DELETE relation
`;

async function main() {
  const catalog = await loadCatalog();
  const edges = catalogRelations(catalog);
  const seedAuthored = seedAuthoredPeople();
  const owned = catalog.people.map((person) => person.slug).filter((slug) => !seedAuthored.has(slug));

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

    const around = await session.run(staleQuery, { slugs: owned, syncOwned: [...SYNC_OWNED] });
    const declared = new Set(edges.map((edge) => `${edge.from}|${edge.type}|${edge.to}`));
    stale = around.records
      .map((record) => ({
        from: record.get('from') as string,
        to: record.get('to') as string,
        type: record.get('type') as string,
      }))
      .filter((edge) => !declared.has(`${edge.from}|${edge.type}|${edge.to}`));

    console.log(`Catalog relations (${apply ? 'apply' : 'dry run'})`);
    console.log(`  declared ${edges.length}, missing from Neo4j ${missing.length}, stale ${stale.length}`);
    missing.forEach((edge) => console.log(`  add ${edge}`));
    stale.forEach((edge) => console.log(`  drop ${edge.from} -[:${edge.type}]-> ${edge.to}`));

    if (missing.length === 0 && stale.length === 0) return;
    if (!apply) {
      console.log('Nothing written. Re-run with --apply to reconcile them.');
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
        await transaction.run(upsertQuery(type), { edges: edges.filter((edge) => edge.type === type) });
      }
      for (const type of new Set(stale.map((edge) => edge.type))) {
        await transaction.run(deleteQuery(type), { edges: stale.filter((edge) => edge.type === type) });
      }
    });
    console.log(`Wrote ${edges.length} relation(s) and dropped ${stale.length} to Neo4j.`);
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
