import { titles } from './titlesSeedData';
import { prisma } from '../src/lib/prisma';
import { PrismaClient } from '../src/generated/prisma';

export async function seedTitles(prismaInstance: PrismaClient) {
  for (const title of titles) {
    try {
      await prismaInstance.title.upsert({
        where: { slug: title.slug },
        update: {},
        create: title,
      });
      console.log(`  [Title] Seeded: ${title.nameAr} (${title.slug})`);
    } catch (err) {
      console.error(` [31m Error seeding title (${title.slug}):`, err);
    }
  }
}

seedTitles(prisma);