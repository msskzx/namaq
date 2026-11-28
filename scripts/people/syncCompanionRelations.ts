import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { prisma } from '../../src/lib/prisma';
import { getDriver } from '../../src/lib/neo4j';

const apply = process.argv.includes('--apply');

const COMPANION_TITLE_SLUG = 'companion';
const PROPHET_SLUG = 'prophet-muhammad';

const upsertQuery = `
  UNWIND $companionSlugs AS slug
  MATCH (companion:Person {slug: slug}), (prophet:Person {slug: $prophetSlug})
  MERGE (companion)-[:COMPANION_OF]->(prophet)
  MERGE (prophet)-[:ACCOMPANIED_BY]->(companion)
`;

const existingQuery = `
  MATCH (companion:Person)-[:COMPANION_OF]->(:Person {slug: $prophetSlug})
  RETURN companion.slug AS slug
`;

function printList(label: string, items: string[]) {
  console.log(`${label}: ${items.length}${items.length ? ` (${items.join(', ')})` : ''}`);
}

async function main() {
  const companions = await prisma.person.findMany({
    where: { titles: { some: { slug: COMPANION_TITLE_SLUG } }, slug: { not: PROPHET_SLUG } },
    select: { slug: true },
    orderBy: { slug: 'asc' },
  });
  const companionSlugs = companions.map((person) => person.slug);

  const session = getDriver().session({
    database: process.env.NEO4J_DATABASE || 'neo4j',
    defaultAccessMode: neo4j.session.READ,
  });

  let existingSlugs: string[];
  try {
    const result = await session.run(existingQuery, { prophetSlug: PROPHET_SLUG });
    existingSlugs = result.records.map((record) => record.get('slug'));
  } finally {
    await session.close();
  }

  const existing = new Set(existingSlugs);
  const missing = companionSlugs.filter((slug) => !existing.has(slug));

  console.log(`Companion ↔ Prophet relation sync (${apply ? 'apply' : 'dry run'})`);
  printList('PostgreSQL companions', companionSlugs);
  printList('Already linked in Neo4j', [...existing]);
  printList('Missing from Neo4j', missing);

  if (apply && missing.length) {
    const writeSession = getDriver().session({
      database: process.env.NEO4J_DATABASE || 'neo4j',
      defaultAccessMode: neo4j.session.WRITE,
    });
    try {
      await writeSession.executeWrite((transaction) =>
        transaction.run(upsertQuery, { companionSlugs: missing, prophetSlug: PROPHET_SLUG })
      );
      console.log(`Created COMPANION_OF/ACCOMPANIED_BY relations for ${missing.length} companions.`);
    } finally {
      await writeSession.close();
    }
  } else if (!apply && missing.length) {
    console.log('No data changed. Re-run with --apply to create the missing relations in Neo4j.');
  }
}

main()
  .catch((error) => {
    console.error('Companion relation sync failed:', error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
