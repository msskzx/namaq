import { charityCategories, charities } from './charitySeedData';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Starting charity seed...');

  // Create categories first
  console.log('Seeding charity categories...');
  for (const category of charityCategories) {
    await prisma.charityCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('✅ Charity categories seeded');

  // Then create charities with their relations
  console.log('Seeding charities...');
  for (const charity of charities) {
    const { categories, ...charityData } = charity;

    await prisma.charity.upsert({
      where: { slug: charity.slug },
      update: {
        ...charityData,
        categories: {
          set: [],
          connect: categories?.connect || []
        }
      },
      create: {
        ...charityData,
        categories: {
          connect: categories?.connect || []
        }
      },
    });
  }
  console.log('✅ Charities seeded');
}

main();