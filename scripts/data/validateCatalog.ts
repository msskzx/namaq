import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { validateCatalog, type KnownSlugs } from '../../src/lib/catalog/validateCatalog';
import { loadBatch } from '../../src/lib/history/loadBatch';
import { checkApproval } from '../../src/lib/history/batchSchema';

const batchesRoot = 'data/history/batches';

/**
 * Only an approved batch qualifies: an unapproved one may still change, and so
 * may one whose files moved since approval. An approval covers a revision, not
 * a directory, so it is checked the same way the importer checks it.
 */
function approvedClaimKeys() {
  const keys = new Set<string>();
  const unapproved: string[] = [];
  for (const dir of readdirSync(batchesRoot)) {
    const { batch } = loadBatch(join(batchesRoot, dir));
    const approval = checkApproval(batch);
    if (!approval.approved) unapproved.push(`${dir} (${approval.reason})`);
    else batch.claims.forEach((claim) => keys.add(claim.key));
  }
  return { keys, unapproved };
}

async function seedSlugs(): Promise<Pick<KnownSlugs, 'people'>> {
  const people = new Set<string>();
  for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
    const seedModule = (await import(join(process.cwd(), 'prisma', file))) as { people?: { slug: string }[] };
    seedModule.people?.forEach((person) => people.add(person.slug));
  }

  return { people };
}

async function main() {
  const catalog = await loadCatalog();
  const { keys, unapproved } = approvedClaimKeys();
  const issues = validateCatalog(catalog, { ...(await seedSlugs()), claims: keys });

  console.log(
    `catalog: ${catalog.people.length} people, ${catalog.battles.length} battles, ${catalog.events.length} events, ` +
      `${catalog.utterances.length} utterances`,
  );
  if (unapproved.length > 0) {
    console.log(`batches not approved at their current revision, claims unusable: ${unapproved.join(', ')}`);
  }

  if (issues.length === 0) {
    console.log('no issues');
    return;
  }
  issues.forEach((issue) => console.log(`  ${issue.path}: ${issue.message}`));
  console.log(`${issues.length} issue(s)`);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
