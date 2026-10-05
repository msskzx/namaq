import 'dotenv/config';
import { PrismaClient, type Prisma } from '../../src/generated/prisma';
import { checkModel } from '../../src/lib/model/check';
import { checkInferences, loadInferences } from '../../src/lib/model/inference';
import { loadModel } from '../../src/lib/model/load';
import { projectionRows } from '../../src/lib/model/project';
import { unitRows } from '../../src/lib/model/unitRows';
import { loadReviews, selectForProd } from '../../src/lib/model/review';

const rootIndex = process.argv.indexOf('--root');
const rootArg = rootIndex === -1 ? '.' : process.argv[rootIndex + 1];
if (!rootArg) {
  console.error('--root needs a directory.');
  process.exit(1);
}
const root = rootArg;
const units = process.argv.includes('--units');
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
  if (units) {
    if (prod) {
      console.error('--units has no review rule yet, so it is not allowed with --env prod.');
      process.exit(1);
    }
    const { units: rows, links } = unitRows(root);
    console.log(`${root}: ${rows.length} unit(s), ${links.length} link(s)`);
    if (apply && rows.length === 0) {
      console.error('No units found under --root, so nothing is applied.');
      process.exit(1);
    }
    if (!apply) {
      console.log('Dry run. Pass --apply --env preview to replace model_units and model_unit_links.');
      return;
    }
    if (env !== 'preview' && env !== 'prod') {
      console.error('--apply needs --env preview or --env prod, so the target is explicit.');
      process.exit(1);
    }
    const db = new PrismaClient();
    try {
      await db.$transaction([
        db.modelUnitLink.deleteMany(),
        db.modelUnit.deleteMany(),
        db.modelUnit.createMany({
          data: rows.map((r) => ({ ...r, view: r.view as unknown as Prisma.InputJsonValue })),
        }),
        db.modelUnitLink.createMany({ data: links }),
      ]);
      console.log('Applied.');
    } finally {
      await db.$disconnect();
    }
    return;
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
