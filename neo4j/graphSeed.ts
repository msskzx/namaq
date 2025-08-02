import { peopleQueries, peopleRelationsQueries } from './graphSeedData';
import { executeTransaction } from '@/lib/neo4j';
import { Driver } from 'neo4j-driver';

let neo4jDriver: Driver;



async function main() {
  try {
    // delete
    // await executeCypher("MATCH (n) DETACH DELETE n", 'Delete graph');
    await executeTransaction(peopleQueries, 'Seed graph');
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
