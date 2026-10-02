import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { checkQuotedValues, collectQuotedValues, type ReportRow } from '../../src/lib/catalog/quotedValueReport';
import type { CitationRecord } from '../../src/lib/history/batchSchema';
import { loadBatch } from '../../src/lib/history/loadBatch';
import { loadStorePage } from '../../src/lib/history/sourceStore';

const batchesRoot = 'data/history/batches';

function citationsByClaim() {
  const byClaim = new Map<string, CitationRecord[]>();
  for (const dir of readdirSync(batchesRoot)) {
    const { batch } = loadBatch(join(batchesRoot, dir));
    batch.claims.forEach((claim) => byClaim.set(claim.key, claim.citations));
  }
  return byClaim;
}

async function main() {
  const subjectAt = process.argv.indexOf('--subject');
  const subject = subjectAt === -1 ? undefined : process.argv[subjectAt + 1];
  const values = collectQuotedValues(await loadCatalog()).filter((value) => !subject || value.subject.endsWith(subject));
  const rows = checkQuotedValues(values, citationsByClaim(), (sourceSlug, volume, printedPage) =>
    loadStorePage('.', sourceSlug, volume, printedPage)?.body ?? null,
  );

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  const counts = new Map<ReportRow['status'], number>();
  rows.forEach((row) => counts.set(row.status, (counts.get(row.status) ?? 0) + 1));
  console.log(`${rows.length} values: ${[...counts].map(([status, n]) => `${status} ${n}`).join(', ') || 'none'}`);
  rows
    .filter((row) => row.status === 'fail' || row.status === 'unresolved')
    .forEach((row) => console.log(`  ${row.subject} ${row.path}: ${row.detail ?? ''}`));

  if (process.argv.includes('--strict') && rows.some((row) => row.status === 'fail' || row.status === 'unresolved')) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
