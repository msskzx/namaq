import { loadBatch } from '../../src/lib/history/loadBatch';
import { batchRevision, checkApproval, checklistReminders, validateBatch } from '../../src/lib/history/batchSchema';

const dir = process.argv[2];

if (!dir) {
  console.error('Usage: npm run history:validate -- data/history/batches/<batch>');
  process.exit(1);
}

const { batch, files, manifests, pages } = loadBatch(dir);
const issues = validateBatch(batch, files, manifests, pages);
const approval = checkApproval(batch);
const reminders = checklistReminders(batch);

console.log(`Batch ${batch.slug} at revision ${batchRevision(batch)}`);
console.log(`  sources ${manifests.size}, accounts ${batch.accounts.length}, claims ${batch.claims.length}`);
console.log(approval.approved ? '  approval: current' : `  approval: none — ${approval.reason}`);

for (const reminder of reminders) console.log(`  reminder: ${reminder}`);

if (issues.length === 0) {
  console.log('  no issues');
  process.exit(0);
}

for (const issue of issues) {
  console.error(`  ${issue.path}: ${issue.message}`);
}
process.exit(1);
