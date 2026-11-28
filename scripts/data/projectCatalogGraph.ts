import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { catalogRelations } from '../../src/lib/catalog/relations';
import { findSeedRelationDrift } from '../../neo4j/seedRelations';
import { getDriver } from '../../src/lib/neo4j';
import { seedAuthoredPeople } from './seedAuthored';

const apply = process.argv.includes('--apply');

const SYNC_OWNED = ['COMPANION_OF', 'ACCOMPANIED_BY', 'HOLDS_TITLE', 'PARTICIPATED_IN', 'ABSENT_FROM', 'INVOLVED_IN', 'PART_OF'];

let stale: { from: string; to: string; type: string }[] = [];

const deployedQuery = `
  MATCH (source:Person)-[relation]->(target:Person)
  RETURN source.slug AS source, target.slug AS target, type(relation) AS type
`;

const upsertQuery = (type: string) => `
  UNWIND $edges AS edge
  MATCH (from:Person {slug: edge.from}), (to:Person {slug: edge.to})
  MERGE (from)-[:${type}]->(to)
`;

const upsertPersonQuery = `
  UNWIND $people AS person
  MERGE (node:Person {slug: person.slug})
  SET node.name = person.name
  FOREACH (_ IN CASE WHEN person.fullName IS NULL THEN [] ELSE [1] END |
    SET node.fullName = person.fullName)
  FOREACH (_ IN CASE WHEN person.nameTransliterated IS NULL THEN [] ELSE [1] END |
    SET node.nameTransliterated = person.nameTransliterated)
  FOREACH (_ IN CASE WHEN person.sex IS NULL THEN [] ELSE [1] END |
    SET node.sex = person.sex)
`;

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

const personSlugsQuery = `MATCH (p:Person) RETURN p.slug AS slug`;

const personSexQuery = `MATCH (p:Person) WHERE p.slug IN $slugs RETURN p.slug AS slug, p.sex AS sex`;

async function main() {
  const catalog = await loadCatalog();
  const edges = catalogRelations(catalog);
  const seedAuthored = seedAuthoredPeople();
  const ownedPeople = catalog.people.filter((person) => !seedAuthored.has(person.slug));
  const owned = ownedPeople.map((person) => person.slug);
  // see docs/plans/reviewed-quiz-bank.md
  const people = ownedPeople.map((person) => ({
    slug: person.slug,
    name: person.name,
    fullName: person.fields.fullName?.value ?? null,
    nameTransliterated: person.nameTransliterated ?? null,
    sex: person.hasProfile ? null : person.fields.sex.value,
  }));

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  let missingPeople: typeof people = [];
  try {
    const existing = await session.run(personSlugsQuery);
    const existingSlugs = new Set(existing.records.map((record) => record.get('slug') as string));
    missingPeople = people.filter((person) => !existingSlugs.has(person.slug));

    const result = await session.run(deployedQuery);
    const deployed = result.records.map((record) => ({
      from: record.get('source') as string,
      to: record.get('target') as string,
      type: record.get('type') as string,
    }));

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

    const wantedSex = new Map(
      ownedPeople.filter((person) => !person.hasProfile).map((person) => [person.slug, person.fields.sex.value] as const),
    );
    const liveSex = await session.run(personSexQuery, { slugs: [...wantedSex.keys()] });
    const sexDrift = liveSex.records
      .map((record) => ({
        slug: record.get('slug') as string,
        live: record.get('sex') as string | null,
        wanted: wantedSex.get(record.get('slug') as string) as string,
      }))
      .filter((entry) => entry.live !== entry.wanted);

    console.log(`Catalog people (${apply ? 'apply' : 'dry run'})`);
    console.log(`  declared ${people.length}, missing from Neo4j ${missingPeople.length}`);
    missingPeople.forEach((person) => console.log(`  add person ${person.slug}`));

    console.log(`Catalog person properties (${apply ? 'apply' : 'dry run'})`);
    console.log(`  graph-only sex drift ${sexDrift.length}`);
    sexDrift.forEach((entry) =>
      console.log(`  set sex ${entry.slug}: ${JSON.stringify(entry.live)} to ${JSON.stringify(entry.wanted)}`),
    );

    console.log(`Catalog relations (${apply ? 'apply' : 'dry run'})`);
    console.log(`  declared ${edges.length}, missing from Neo4j ${missing.length}, stale ${stale.length}`);
    missing.forEach((edge) => console.log(`  add ${edge}`));
    stale.forEach((edge) => console.log(`  drop ${edge.from} -[:${edge.type}]-> ${edge.to}`));

    if (missingPeople.length === 0 && sexDrift.length === 0 && missing.length === 0 && stale.length === 0) return;
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
      await transaction.run(upsertPersonQuery, { people });
      for (const type of new Set(edges.map((edge) => edge.type))) {
        await transaction.run(upsertQuery(type), { edges: edges.filter((edge) => edge.type === type) });
      }
      for (const type of new Set(stale.map((edge) => edge.type))) {
        await transaction.run(deleteQuery(type), { edges: stale.filter((edge) => edge.type === type) });
      }
    });
    console.log(`Wrote ${missingPeople.length} person node(s), ${edges.length} relation(s), and dropped ${stale.length} from Neo4j.`);
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
