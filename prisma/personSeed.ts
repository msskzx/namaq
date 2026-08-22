import { prisma } from '../src/lib/prisma';
import { people as people3 } from './personSeedData3';
import { people as people4 } from './personSeedData4';
import { people as people5 } from './personSeedData5';
import { people as people6 } from './personSeedData6';
import { people as people7 } from './personSeedData7';
import { people as people8 } from './personSeedData8';
import { people as people9 } from './personSeedData9';

const people = [...people3, ...people4, ...people5, ...people6, ...people7, ...people8, ...people9];

async function main() {
  try {
    console.log('🌱 Starting people seed...');

    // Clean up existing people and relations
    // await prisma.personRelation.deleteMany({});
    // await prisma.battleParticipation.deleteMany({});
    // await prisma.person.deleteMany({});

    // Seed people
    const personRecords: Record<string, any> = {};
    for (const person of people) {
      try {
        let titleRecords: any[] = [];
        if (person.titles && person.titles.length > 0) {
          titleRecords = await prisma.title.findMany({
            where: { slug: { in: person.titles } },
          });
        }
        const { titles, ...personData } = person;
        const record = await prisma.person.upsert({
          where: { slug: person.slug },
          update: {
            ...personData,
            titles: { set: titleRecords.map(t => ({ id: t.id })) },
          },
          create: {
            ...personData,
            titles: { connect: titleRecords.map(t => ({ id: t.id })) },
          },
        });
        personRecords[person.slug] = record;
        console.log(`  [Person] Seeded: ${record.name} (${record.slug})`);
      } catch (err) {
        console.error(`❌ Error seeding person (${person.slug}):`, err);
      }
    }

    /*
    // Seed battle participations
    const battleRecords = await prisma.battle.findMany()
    const battleSlugToId: Record<string, string> = {};
    for (const battle of battleRecords) {
      // Use slug from nameTransliterated or name (assuming slug is not a field in Battle)
      battleSlugToId[battle.slug] = battle.id;
    }

    for (const participation of peopleBattleParticipations) {
      const person = personRecords[participation.personSlug];
      const battleId = battleSlugToId[participation.battleSlug];
      if (person && battleId) {
        await prisma.battleParticipation.create({
          data: {
            personId: person.id,
            battleId,
            isMuslim: participation.isMuslim,
            status: participation.status as any, // Cast string[] to ParticipationStatus[]
            courage: participation.courage,
          },
        });
        console.log(`  [BattleParticipation] Seeded: ${person.slug} in ${participation.battleSlug}`);
      } else {
        console.warn(battleId)
        console.warn(`⚠️ Could not find person or battle for participation:`, participation);
      }
    }
    */
    console.log('✅ People seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding people:', e);
    process.exit(1);
  }
}

main(); 