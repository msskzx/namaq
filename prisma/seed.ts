import { prisma } from '../src/lib/prisma';
import { articles } from './articlesSeedData';
import { categories } from './categoriesSeedData';

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