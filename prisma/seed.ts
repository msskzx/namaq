import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const arabicCategory = await prisma.category.upsert({
    where: { slug: 'arabic-language' },
    update: {},
    create: {
      name: 'Arabic Language',
      nameAr: 'اللغة العربية',
      description: 'Learn Arabic language fundamentals',
      descriptionAr: 'تعلم أساسيات اللغة العربية',
      icon: 'language',
      color: 'blue',
      slug: 'arabic-language',
      order: 1,
    },
  });

  const islamicHistoryCategory = await prisma.category.upsert({
    where: { slug: 'islamic-history' },
    update: {},
    create: {
      name: 'Islamic History',
      nameAr: 'التاريخ الإسلامي',
      description: 'Explore Islamic history and heritage',
      descriptionAr: 'اكتشف التاريخ الإسلامي والتراث',
      icon: 'mosque',
      color: 'green',
      slug: 'islamic-history',
      order: 2,
    },
  });

  // Create articles
  const arabicLettersArticle = await prisma.article.upsert({
    where: { slug: 'arabic-letters' },
    update: {},
    create: {
      title: 'Arabic Letters',
      titleAr: 'الحروف العربية',
      description: 'Learn the Arabic alphabet and letter forms',
      descriptionAr: 'تعلم الأبجدية العربية وأشكال الحروف',
      content: 'Content about Arabic letters...',
      contentAr: 'محتوى عن الحروف العربية...',
      slug: 'arabic-letters',
      icon: 'font',
      color: 'indigo',
      order: 1,
      isPublished: true,
      publishedAt: new Date(),
      categoryId: arabicCategory.id,
    },
  });

  const prophetMuhammadArticle = await prisma.article.upsert({
    where: { slug: 'prophet-muhammad' },
    update: {},
    create: {
      title: 'Prophet Muhammad ﷺ',
      titleAr: 'النبي محمد ﷺ',
      description: 'Learn about the life and teachings of Prophet Muhammad',
      descriptionAr: 'تعلم عن حياة وتعاليم النبي محمد',
      content: 'Content about Prophet Muhammad...',
      contentAr: 'محتوى عن النبي محمد...',
      slug: 'prophet-muhammad',
      icon: 'user',
      color: 'green',
      order: 1,
      isPublished: true,
      publishedAt: new Date(),
      categoryId: islamicHistoryCategory.id,
    },
  });

  const companionsArticle = await prisma.article.upsert({
    where: { slug: 'companions' },
    update: {},
    create: {
      title: 'The Companions',
      titleAr: 'الصحابة',
      description: 'Learn about the companions of Prophet Muhammad',
      descriptionAr: 'تعلم عن صحابة النبي محمد',
      content: 'Content about the companions...',
      contentAr: 'محتوى عن الصحابة...',
      slug: 'companions',
      icon: 'users',
      color: 'purple',
      order: 2,
      isPublished: true,
      publishedAt: new Date(),
      categoryId: islamicHistoryCategory.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log(`  - ${arabicCategory.name} category`);
  console.log(`  - ${islamicHistoryCategory.name} category`);
  console.log(`  - ${arabicLettersArticle.title} article`);
  console.log(`  - ${prophetMuhammadArticle.title} article`);
  console.log(`  - ${companionsArticle.title} article`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 