import { peopleQueries, peopleRelationsQueries } from './graphSeedData';
import { executeTransaction } from '@/lib/neo4j';

const personMergeQuery = (query: string) => {
  const properties = query.match(/CREATE \(:Person (\{.*\})\);$/)?.[1];
  const slug = properties?.match(/slug: "([^"]+)"/)?.[1];

  if (!properties || !slug) {
    throw new Error(`Invalid person seed query: ${query}`);
  }

  return `MERGE (person:Person {slug: "${slug}"}) SET person += ${properties};`;
};

const relationMergeQuery = (query: string) => {
  const relationship = query.match(/CREATE \(from\)-\[:([^\]]+)\]->\(to\);$/)?.[1];

  if (!relationship) {
    throw new Error(`Invalid relationship seed query: ${query}`);
  }

  // Do not assign invented citations to historical claims. Until a curated
  // RelationshipClaim is published, graph edges are visibly unassessed.
  return query.replace(
    `CREATE (from)-[:${relationship}]->(to);`,
    `MERGE (from)-[relation:${relationship}]->(to) ON CREATE SET relation.confidence = "UNASSESSED", relation.reviewStatus = "DRAFT";`,
  );
};

async function main() {
  try {
    await executeTransaction(
      peopleQueries.map(personMergeQuery),
      'Seed graph',
    );
    await executeTransaction(
      peopleRelationsQueries.map(relationMergeQuery),
      'Seed graph relations',
    );
    console.log('🎉 Graph database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding graph database:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
