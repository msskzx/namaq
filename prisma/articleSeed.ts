import { articleData } from './articleSeedData';
import { prisma } from '../src/lib/prisma';

async function seedArticles() {
  try {
    console.log('🌟 Seeding articles (upsert with categories)...');

    // delete articles
    await prisma.article.deleteMany({});
    
    for (const article of articleData) {
      const { categories, events, ...articleFields } = article;
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {
          ...articleFields,
          categories: {
            set: [], // clear existing
            connect: categories.map((slug: string) => ({ slug })),
          },
          events: {
            set: [], // clear existing
            connect: events?.map((slug: string) => ({ slug })),
          },
        },
        create: {
          ...articleFields,
          categories: {
            connect: categories.map((slug: string) => ({ slug })),
          },
          events: {
            connect: events?.map((slug: string) => ({ slug })),
          },
        },
      });
    }
    console.log('✅ Articles upserted and connected to categories successfully!');
  } catch (e) {
    console.error('❌ Error seeding articles:', e);
    process.exit(1);
  }
}

seedArticles(); 