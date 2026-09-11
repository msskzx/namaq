import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import { awaitingEvidence, catalogProvenance } from '../../src/lib/catalog/provenance';
import { loadBatch } from '../../src/lib/history/loadBatch';

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

/**
 * Every subject a batch speaks about, its claims' related subjects included: a
 * batch that cites Yarmuk touched Yarmuk and could have dated it.
 */
function batchSubjects(dir: string) {
  const { batch } = loadBatch(dir);
  // The catalog's directory names, which are not the plural of every kind.
  const directory: Record<string, string> = { PERSON: 'people', BATTLE: 'battles', EVENT: 'events', TITLE: 'titles' };
  return new Set([
    ...batch.accounts.map((account) => `${directory[account.subjectKind]}/${account.subjectSlug}`),
    ...batch.claims.map((claim) => `${directory[claim.subjectKind]}/${claim.subjectSlug}`),
    ...batch.claims
      .filter((claim) => claim.relatedSubjectKind && claim.relatedSubjectSlug)
      .map((claim) => `${directory[claim.relatedSubjectKind!]}/${claim.relatedSubjectSlug}`),
  ]);
}

async function main() {
  const catalog = await loadCatalog();
  const all = catalogProvenance(catalog);
  let owed = awaitingEvidence(catalog);

  const batchDir = option('batch');
  if (batchDir) {
    // Scoped to one batch, the ledger answers what that batch walked past:
    // a legacy value on a subject it covers is one it did not resolve.
    const subjects = batchSubjects(batchDir);
    owed = owed.filter((value) => subjects.has(value.subject));
    console.log(`${batchDir} covers ${[...subjects].join(', ')}`);
  } else {
    console.log(
      `catalog: ${catalog.people.length} people, ${catalog.battles.length} battles, ${catalog.events.length} events`,
    );
  }

  console.log(`values: ${all.length - awaitingEvidence(catalog).length} cited, ${owed.length} awaiting evidence`);
  if (owed.length === 0) return;

  const bySubject = new Map<string, string[]>();
  owed.forEach((value) => bySubject.set(value.subject, [...(bySubject.get(value.subject) ?? []), value.path]));

  console.log('\nawaiting evidence:');
  [...bySubject]
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([subject, paths]) => console.log(`  ${subject.padEnd(34)} ${paths.length}  ${paths.join(', ')}`));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
