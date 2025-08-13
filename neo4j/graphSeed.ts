// import { peopleQueries, peopleRelationsQueries } from './graphSeedData2';
import { executeTransaction } from '@/lib/neo4j';

async function main() {
  try {
    // delete
    // await executeCypher("MATCH (n) DETACH DELETE n", 'Delete graph');
    // await executeTransaction(peopleQueries, 'Seed graph');
    const peopleRelationsQueries = [
      'MATCH (from:Person {slug: "umar-ibn-al-khattab"}), (to:Person {slug: "prophet-muhammad"}) CREATE (from)-[:FATHER_IN_LAW]->(to);',
      'MATCH (from:Person {slug: "hafsa-bint-umar"}), (to:Person {slug: "umar-ibn-al-khattab"}) CREATE (from)-[:DAUGHTER]->(to);',
    ];
    await executeTransaction(peopleRelationsQueries, 'Seed graph relations');
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
