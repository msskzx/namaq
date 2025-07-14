import { PrismaClient } from '../src/generated/prisma';
import { people, peopleRelations } from './peopleSeedData';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting people seed...');

    // Clean up existing people and relations
    await prisma.personRelation.deleteMany({});
    await prisma.person.deleteMany({});

    // Seed people
    const personRecords: Record<string, any> = {};
    for (const person of people) {
      try {
        const record = await prisma.person.upsert({
          where: { slug: person.slug },
          update: {},
          create: person,
        });
        personRecords[person.slug] = record;
        console.log(`  [Person] Seeded: ${record.name} (${record.slug})`);
      } catch (err) {
        console.error(`❌ Error seeding person (${person.slug}):`, err);
      }
    }

    // Seed relations
    for (const relation of peopleRelations) {
      try {
        const from = personRecords[relation.fromSlug];
        const to = personRecords[relation.toSlug];
        if (from && to) {
          const rel = await prisma.personRelation.create({
            data: {
              fromId: from.id,
              toId: to.id,
              type: relation.type as any,
            },
          });
          console.log(`  [Relation] Seeded: ${from.name} -> ${relation.type} -> ${to.name}`);
        }
      } catch (err) {
        console.error(`❌ Error seeding relation (${relation.fromSlug} -> ${relation.type} -> ${relation.toSlug}):`, err);
      }
    }

    console.log('✅ People seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding people:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 