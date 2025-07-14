import { PrismaClient } from '../src/generated/prisma';
import { people, peopleRelations } from './peopleSeedData';
import { articles } from './articlesSeedData';
import { categories } from './categoriesSeedData';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    // Clean up existing data before seeding
    await prisma.personRelation.deleteMany({});
    await prisma.person.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.category.deleteMany({});

    // Seed categories from external data file
    for (const category of categories) {
      try {
        const record = await prisma.category.upsert({
          where: { slug: category.slug },
          update: {},
          create: category,
        });
        console.log(`  [Category] Seeded: ${record.name} (${record.slug})`);
      } catch (err) {
        console.error(`❌ Error seeding category (${category.slug}):`, err);
      }
    }

    // Seed articles from external data file
    for (const article of articles) {
      try {
        const category = await prisma.category.findUnique({ where: { slug: article.categorySlug } });
        const { categorySlug, ...articleData } = article;
        const record = await prisma.article.upsert({
          where: { slug: article.slug },
          update: {},
          create: {
            ...articleData,
            categoryId: category ? category.id : undefined,
          },
        });
        console.log(`  [Article] Seeded: ${record.title} (${record.slug})`);
      } catch (err) {
        console.error(`❌ Error seeding article (${article.slug}):`, err);
      }
    }

    // Seed people from external data file
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

    // Seed relations using slugs
    for (const relation of peopleRelations) {
      try {
        const from = personRecords[relation.fromSlug];
        const to = personRecords[relation.toSlug];
        if (from && to) {
          const rel = await prisma.personRelation.create({
            data: {
              fromId: from.id,
              toId: to.id,
              type: relation.type as any, // Fix type error if needed
            },
          });
          console.log(`  [Relation] Seeded: ${from.name} -> ${relation.type} -> ${to.name}`);
        }
      } catch (err) {
        console.error(`❌ Error seeding relation (${relation.fromSlug} -> ${relation.type} -> ${relation.toSlug}):`, err);
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 