import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { validateCatalog, type KnownSlugs } from '../../src/lib/catalog/validateCatalog';
import { batchDefinitionFile } from '../../src/lib/history/loadBatch';
import type { HistoryBatch } from '../../src/lib/history/batchSchema';

const batchesRoot = 'data/history/batches';

/**
 * Claim keys a catalog value may cite. Only an approved batch qualifies: an
 * unapproved one may still change, and citing it would let a value rest on
 * evidence nobody has released
 * (docs/authoritative-data-workflow-plan.md).
 */
function approvedClaimKeys() {
  const keys = new Set<string>();
  const unapproved: string[] = [];
  for (const dir of readdirSync(batchesRoot)) {
    const batch = JSON.parse(readFileSync(join(batchesRoot, dir, batchDefinitionFile), 'utf8')) as HistoryBatch;
    if (!batch.approval) unapproved.push(dir);
    else batch.claims.forEach((claim) => keys.add(claim.key));
  }
  return { keys, unapproved };
}

async function seedSlugs(): Promise<Pick<KnownSlugs, 'people' | 'titles' | 'battles'>> {
  const { titles } = await import('../../prisma/titleSeedData');
  const { battles } = await import('../../prisma/battleSeedData');

  const people = new Set<string>();
  for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
    const module = (await import(join(process.cwd(), 'prisma', file))) as { people?: { slug: string }[] };
    module.people?.forEach((person) => people.add(person.slug));
  }

  // Graph-only people exist as Cypher in neo4j/, never as a Prisma row, so a
  // relation to one is valid even though no seed record names them. Reading
  // the slug out of the statement is the only way to see them until the
  // catalog owns these people outright.
  for (const file of readdirSync('neo4j').filter((name) => /^graphSeedData\d*\.ts$/.test(name))) {
    const source = readFileSync(join('neo4j', file), 'utf8');
    for (const match of source.matchAll(/CREATE \(:Person \{[^}]*?slug: "([a-z0-9-]+)"/g)) {
      people.add(match[1]);
    }
  }

  return {
    people,
    titles: new Set(titles.map((title: { slug: string }) => title.slug)),
    battles: new Set(battles.map((battle: { slug: string }) => battle.slug)),
  };
}

async function main() {
  const catalog = await loadCatalog();
  const { keys, unapproved } = approvedClaimKeys();
  const issues = validateCatalog(catalog, { ...(await seedSlugs()), claims: keys });

  console.log(
    `catalog: ${catalog.people.length} people, ${catalog.battles.length} battles, ${catalog.events.length} events`,
  );
  if (unapproved.length > 0) console.log(`batches without approval, claims unusable: ${unapproved.join(', ')}`);

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
