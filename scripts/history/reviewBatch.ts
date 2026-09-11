import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { batchRevision, markBatchReviewed, validateBatch } from '../../src/lib/history/batchSchema';
import { batchDefinitionFile, loadBatch } from '../../src/lib/history/loadBatch';

const dir = process.argv[2];
const apply = process.argv.includes('--apply');

if (!dir) {
  console.error('Usage: npm run history:review -- data/history/batches/<batch> [--apply]');
  process.exit(1);
}

const { batch, files } = loadBatch(dir);
const issues = validateBatch(batch, files);
if (issues.length > 0) {
  for (const issue of issues) console.error(`  ${issue.path}: ${issue.message}`);
  process.exit(1);
}

const changed = markBatchReviewed(batch);
console.log(`Batch ${batch.slug}: ${changed} of ${batch.claims.length} claims need review status updates`);

if (!apply) {
  console.log('  dry run — nothing written; pass --apply to mark the batch reviewed');
  process.exit(0);
}

writeFileSync(join(dir, batchDefinitionFile), `${JSON.stringify(batch, null, 2)}\n`);
console.log(`  marked reviewed at revision ${batchRevision(batch, files)}`);
console.log('  publication approval is now stale; review and approve the new revision before import');
