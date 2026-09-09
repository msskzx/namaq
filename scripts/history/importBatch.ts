import { prisma } from '../../src/lib/prisma';
import { loadBatch } from '../../src/lib/history/loadBatch';
import { checkApproval, validateBatch } from '../../src/lib/history/batchSchema';
import { importBatch } from '../../src/lib/history/importBatch';

const dir = process.argv[2];
const apply = process.argv.includes('--apply');

if (!dir) {
  console.error('Usage: npm run history:import -- data/history/batches/<batch> [--apply]');
  process.exit(1);
}

async function main() {
  const { batch, files } = loadBatch(dir);
  const issues = validateBatch(batch, files);

  if (issues.length > 0) {
    for (const issue of issues) console.error(`  ${issue.path}: ${issue.message}`);
    throw new Error(`${batch.slug} has ${issues.length} validation issue(s)`);
  }

  const approval = checkApproval(batch, files);

  const plan = {
    sources: batch.sources.length,
    accounts: batch.accounts.length,
    pages: batch.accounts.reduce((total, account) => total + account.pages.length, 0),
    claims: batch.claims.length,
    citations: batch.claims.reduce((total, claim) => total + claim.citations.length, 0),
  };
  console.log(`Batch ${batch.slug} revision ${approval.revision}`);
  console.log(`  ${JSON.stringify(plan)}`);
  console.log(approval.approved ? '  approval: current' : `  approval: none — ${approval.reason}`);

  // A dry run is how a batch is reviewed, so it runs unapproved. Only the write
  // requires the files to match the revision the user approved.
  if (!apply) {
    console.log('  dry run — nothing written; pass --apply once approved');
    return;
  }

  if (!approval.approved) {
    throw new Error(`${batch.slug} is not approved for import: ${approval.reason}`);
  }

  const result = await importBatch(prisma, batch, files);
  console.log(`  applied: ${JSON.stringify(result)}`);
  console.log('  shared person fields still need `npm run people:sync`');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
