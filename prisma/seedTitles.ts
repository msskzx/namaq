import { titles } from './titlesSeedData';
import { prisma } from '../src/lib/prisma';
import { PrismaClient } from '../src/generated/prisma';

export async function seedTitles(prismaInstance: PrismaClient) {
  for (const title of titles) {
    try {
      await prismaInstance.title.upsert({
        where: { slug: title.slug },
        update: {
          name: title.name,
          nameEn: title.nameEn,
        },
        create: title,
      });
      console.log(`  [Title] Seeded: ${title.name} (${title.slug})`);
    } catch (err) {
      console.error(` [Error seeding title (${title.slug}):`, err);
    }
  }
}

seedTitles(prisma);