import 'dotenv/config';
import { PrismaClient, type Prisma } from '../../src/generated/prisma';
import { loadInferences } from '../../src/lib/model/inference';
import { loadModel } from '../../src/lib/model/load';
import { projectionRows } from '../../src/lib/model/project';
import { loadReviews, selectForProd } from '../../src/lib/model/review';

const root = '.';
const apply = process.argv.includes('--apply');
const prod =
  process.argv.includes('--env') && process.argv[process.argv.indexOf('--env') + 1] === 'prod';

async function main() {
  const inferences = loadInferences(root);
  const reviews = loadReviews(root);
  const all = loadModel(root);
  const folders = prod ? selectForProd(all, reviews, root, inferences) : all;
  const { spans, entries } = projectionRows(folders, root, reviews, inferences);
  console.log(
    `${prod ? 'prod (reviewed only)' : 'preview (everything)'}: ${spans.length} span(s), ${entries.length} profile entr${entries.length === 1 ? 'y' : 'ies'}`,
  );
  if (!apply) {
    console.log(
      'Dry run. Pass --apply to replace the model_spans and model_profile_entries tables.',
    );
    return;
  }
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction([
      prisma.modelProfileEntry.deleteMany(),
      prisma.modelSpan.deleteMany(),
      prisma.modelSpan.createMany({ data: spans }),
      prisma.modelProfileEntry.createMany({
        data: entries.map((e) => ({
          ...e,
          origins: e.origins as unknown as Prisma.InputJsonValue,
        })),
      }),
    ]);
    console.log('Applied.');
  } finally {
    await prisma.$disconnect();
  }
}

main();
