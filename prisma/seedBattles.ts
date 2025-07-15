import { battles } from './battlesSeedData';
import { prisma } from '../src/lib/prisma';

async function seedBattles() {
  try {
    console.log(prisma)
    console.log('🌟 Seeding battles...');
    await prisma.battle.createMany({
      data: battles,
      skipDuplicates: true,
    });
    console.log('✅ Battles seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding battles:', e);
    process.exit(1);
  }
}

seedBattles(); 