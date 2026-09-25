import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog } from '../../src/lib/catalog/loadCatalog';
import type { CatalogPerson } from '../../src/lib/catalog/types';
import { loadBatch } from '../../src/lib/history/loadBatch';
import { checklistContentItems, type ChecklistContentItem } from '../../src/lib/history/batchSchema';

const BATCHES_ROOT = 'data/history/batches';

// Mirrors the "parent"/"child"/"sibling"/"spouse" groupings in
// src/lib/relationship/categories.ts's CATEGORY_BY_TYPE (private to that
// module), narrowed to the four categories this checklist cares about.
const PARENT_OR_CHILD_TYPES = new Set([
  'FATHER', 'MOTHER', 'STEP_FATHER', 'STEP_MOTHER',
  'SON', 'DAUGHTER', 'STEP_SON', 'STEP_DAUGHTER',
]);
const SIBLING_TYPES = new Set([
  'BROTHER', 'SISTER', 'HALF_BROTHER', 'HALF_SISTER', 'STEP_BROTHER', 'STEP_SISTER',
]);
const SPOUSE_TYPES = new Set(['HUSBAND', 'WIFE']);

/**
 * docs/extraction-checklist.md, "verification": does this subject's *final
 * catalog entry* — not the raw batch — account for each of the seven content
 * items a source could plausibly have stated? A batch that read the source
 * correctly but never carried a value into the catalog (as happened with
 * Hamzah's nasab) still leaves a broken profile, so the catalog entry is what
 * this checks against, not batch.json.
 */
function slugArg(): string {
  const slug = process.argv[2];
  if (!slug || slug.startsWith('--')) {
    console.error('usage: npm run catalog:checklist -- <person-slug>');
    process.exit(1);
  }
  return slug;
}

/** Every account any batch declares for this subject, notInSource unioned across all of them. */
function notInSourceFor(slug: string): Set<ChecklistContentItem> {
  const declared = new Set<ChecklistContentItem>();
  for (const dir of readdirSync(BATCHES_ROOT)) {
    const { batch } = loadBatch(join(BATCHES_ROOT, dir));
    for (const account of batch.accounts) {
      if (account.subjectKind === 'PERSON' && account.subjectSlug === slug) {
        account.notInSource?.forEach((item) => declared.add(item));
      }
    }
  }
  return declared;
}

function hasRelation(person: CatalogPerson, types: Set<string>): boolean {
  return person.relations.some((relation) => types.has(relation.type));
}

/** Found in the catalog entry, per checklist item. nasab/wives/siblings read relations; the rest read fields. */
function foundIn(person: CatalogPerson): Record<ChecklistContentItem, boolean> {
  return {
    fullName: person.fields.fullName !== undefined,
    kunya: person.fields.kunya !== undefined,
    appearance: person.fields.appearance !== undefined,
    manaqeb: person.fields.virtues !== undefined,
    nasab: hasRelation(person, PARENT_OR_CHILD_TYPES),
    wives: hasRelation(person, SPOUSE_TYPES),
    siblings: hasRelation(person, SIBLING_TYPES),
  };
}

async function main() {
  const slug = slugArg();
  const catalog = await loadCatalog();
  const person = catalog.people.find((candidate) => candidate.slug === slug);

  if (!person) {
    console.error(`no catalog entry for "${slug}" — this checklist only reads catalog-authored people`);
    process.exit(1);
  }

  const notInSource = notInSourceFor(slug);
  const found = foundIn(person);

  console.log(`catalog:checklist ${slug}\n`);

  let warnings = 0;
  for (const item of checklistContentItems) {
    if (found[item]) {
      console.log(`  ✅ ${item}`);
    } else if (notInSource.has(item)) {
      console.log(`  ⚪ ${item} (confirmed absent from source)`);
    } else {
      console.log(`  ⚠️  ${item} — not in the catalog entry, and no batch marked it notInSource`);
      warnings++;
    }
  }

  console.log(
    warnings === 0
      ? '\nnothing unchecked.'
      : `\n${warnings} item(s) unchecked — either author them into the catalog entry, or mark them notInSource on the account that read this subject's page.`,
  );
  if (warnings > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
