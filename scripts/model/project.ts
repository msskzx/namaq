import 'dotenv/config';
import { PrismaClient, type Prisma } from '../../src/generated/prisma';
import { checkModel } from '../../src/lib/model/check';
import { checkInferences, loadInferences } from '../../src/lib/model/inference';
import { loadModel } from '../../src/lib/model/load';
import { projectionRows } from '../../src/lib/model/project';
import { loadReviews, selectForProd } from '../../src/lib/model/review';

const root = '.';
const apply = process.argv.includes('--apply');
const envIndex = process.argv.indexOf('--env');
const env = envIndex === -1 ? undefined : process.argv[envIndex + 1];
const prod = env === 'prod';

async function main() {
  const inferences = loadInferences(root);
  const reviews = loadReviews(root);
  const all = loadModel(root);
  const issues = [...checkModel(all, root), ...checkInferences(all, inferences)];
  if (issues.length > 0) {
    issues.forEach((issue) => console.error(`FAIL ${issue}`));
    process.exit(1);
  }
  const folders = prod ? selectForProd(all, reviews, root, inferences) : all;
  const { spans, entries } = projectionRows(folders, root, reviews, inferences, all);
  console.log(
    `${prod ? 'prod (reviewed only)' : 'preview (everything)'}: ${spans.length} span(s), ${entries.length} profile entr${entries.length === 1 ? 'y' : 'ies'}`,
  );
  if (!apply) {
    console.log(
      'Dry run. Pass --apply to replace the model_spans and model_profile_entries tables.',
    );
    return;
  }
  if (env !== 'preview' && env !== 'prod') {
    console.error('--apply needs --env preview or --env prod, so the target is explicit.');
    process.exit(1);
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
