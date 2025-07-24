import { battles } from './battlesSeedData';
import { prisma } from '../src/lib/prisma';

async function seedBattles() {
  try {
    console.log('🌟 Seeding battles...');
    for (const battle of battles) {
      await prisma.battle.upsert({
        where: { slug: battle.slug },
        create: battle,
        update: battle,
      });
    }
    console.log('✅ Battles seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding battles:', e);
    process.exit(1);
  }
}

seedBattles(); 