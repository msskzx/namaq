import { articleData } from './articlesSeedData';
import { prisma } from '../src/lib/prisma';

async function seedArticles() {
  try {
    console.log('🌟 Seeding articles (upsert with categories)...');
    for (const article of articleData) {
      const { categories, ...articleFields } = article;
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {
          ...articleFields,
          categories: {
            set: [], // clear existing
            connect: categories.map((slug: string) => ({ slug })),
          },
        },
        create: {
          ...articleFields,
          categories: {
            connect: categories.map((slug: string) => ({ slug })),
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