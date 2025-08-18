import { books } from './bookSeedData';
import { prisma } from '../src/lib/prisma';

async function seedBooks() {
  try {
    console.log('🌟 Seeding books...');
    for (const book of books) {
      await prisma.book.upsert({
        where: { slug: book.slug },
        create: {
          title: book.title,
          slug: book.slug,
          volume: book.volume,
          description: book.description,
          author: {
            connect: {
              slug: book.authorSlug,
            },
          },
        },
        update: {
          title: book.title,
          slug: book.slug,
          volume: book.volume,
          description: book.description,
          author: {
            connect: {
              slug: book.authorSlug,
            },
          },
        },
      });
    }
    console.log('✅ Books seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding books:', e);
    process.exit(1);
  }
}

seedBooks(); 