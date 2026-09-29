import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { batchRevision, checkApproval, validateBatch } from '../../src/lib/history/batchSchema';
import { batchDefinitionFile, loadBatch } from '../../src/lib/history/loadBatch';

// What approval permits, and what it does not: docs/adr/0008-separate-review-from-visibility.md.

const apply = process.argv.includes('--apply');
const all = process.argv.includes('--all');
const dirArg = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : undefined;
const approvedBy = process.argv.find((arg) => arg.startsWith('--by='))?.slice('--by='.length) ?? 'msskzx';
const note = process.argv.find((arg) => arg.startsWith('--note='))?.slice('--note='.length);

if (!dirArg && !all) {
  console.error('Usage: npm run history:approve -- data/history/batches/<batch> [--apply] [--by=<name>] [--note=<text>]');
  console.error('   or: npm run history:approve -- --all [--apply] [--by=<name>] [--note=<text>]');
  process.exit(1);
}

const root = 'data/history/batches';
const dirs = dirArg ? [dirArg] : readdirSync(root).map((name) => join(root, name));

let pending = 0;
for (const dir of dirs) {
  const { batch, files } = loadBatch(dir);
  const issues = validateBatch(batch, files);
  if (issues.length > 0) {
    for (const issue of issues) console.error(`  ${batch.slug}: ${issue.path}: ${issue.message}`);
    continue;
  }

  const status = checkApproval(batch, files);
  if (status.approved) {
    if (dirArg) console.log(`${batch.slug}: already approved at revision ${status.revision}`);
    continue;
  }

  pending += 1;
  const revision = batchRevision(batch, files);
  console.log(`${batch.slug}: pending approval at revision ${revision} (${status.reason})`);

  if (!apply) continue;

  batch.approval = {
    revision,
    approvedAt: new Date().toISOString().slice(0, 10),
    approvedBy,
    ...(note ? { note } : {}),
  };
  writeFileSync(join(dir, batchDefinitionFile), `${JSON.stringify(batch, null, 2)}\n`);
  console.log(`  approved for publication at revision ${revision}`);
}

if (!apply && pending > 0) {
  console.log(`\n${pending} batch(es) pending approval — dry run, pass --apply to record it`);
}
