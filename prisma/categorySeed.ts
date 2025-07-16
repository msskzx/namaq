import { categoryData } from './categoriesSeedData';
import { prisma } from '../src/lib/prisma';

async function seedCategories() {
  try {
    console.log('🌟 Seeding categories (upsert)...');
    for (const category of categoryData) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }
    console.log('✅ Categories upserted successfully!');
  } catch (e) {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  }
}

seedCategories(); 