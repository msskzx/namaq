import { titles } from './titlesSeedData';
import { PrismaClient } from '../src/generated/prisma';

export async function seedTitles(prisma: PrismaClient) {
  for (const title of titles) {
    try {
      await prisma.title.upsert({
        where: { slug: title.slug },
        update: {},
        create: title,
      });
      console.log(`  [Title] Seeded: ${title.nameAr} (${title.slug})`);
    } catch (err) {
      console.error(`❌ Error seeding title (${title.slug}):`, err);
    }
  }
} 


const prisma = new PrismaClient();
seedTitles(prisma)