import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import { validateCatalog } from '@/lib/catalog/validateCatalog';
import { loadBatch } from '@/lib/history/loadBatch';
import { loadModel } from '@/lib/model/load';

// Rules every person, battle, event and ordering must keep, checked over the whole catalog
// rather than one subject at a time. Which batch is approved is a separate
// question (npm run catalog:validate): here every declared claim counts.

const catalog = await loadCatalog();
const claims = readdirSync('data/history/batches').flatMap((dir) => loadBatch(join('data/history/batches', dir)).batch.claims);
const claimByKey = new Map(claims.map((claim) => [claim.key, claim]));
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

const COUNTS = ['muslimForceCount', 'nonMuslimForceCount', 'muslimDeathCount', 'nonMuslimDeathCount'];

describe('the whole catalog', () => {
  // Relations need their reciprocal, statuses fit their participation, every
  // person, event and claim named exists, and so on: src/lib/catalog/validateCatalog.ts.
  it('passes the catalog validator', async () => {
    const people = new Set<string>();
    for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
      const seed = (await import(join(process.cwd(), 'prisma', file))) as { people?: { slug: string }[] };
      seed.people?.forEach((person) => people.add(person.slug));
    }
    const spans = new Set(
      loadModel('.').flatMap((folder) => folder.units.flatMap((file) => file.spans.map((span) => `${file.unit.id}#${span.id}`))),
    );
    const claimSources = new Map(claims.map((claim) => [claim.key, [...new Set(claim.citations.map((c) => c.sourceSlug))]]));

    const issues = validateCatalog(catalog, { people, claims: new Set(claimByKey.keys()), spans, claimSources });

    // Relatives an entry names who have no profile. The phone shows them as a
    // plain name (on the ring, a tap opens the sentence that names them), which
    // the owner kept (2026-11-22). The website's graph needs a row for each, so
    // a new one is a choice to make, not a slip: add it here on purpose.
    const withoutProfile = [
      'people/jabr-ibn-atik.relations.FATHER: unknown person atik-ibn-jabr',
      'people/jabr-ibn-atik.relations.FATHER: unknown person abdullah-ibn-jabr',
      'people/jabr-ibn-atik.relations.FATHER: unknown person umm-thabit-bint-jabr',
      'people/jabr-ibn-atik.relations.PATERNAL_UNCLE: unknown person al-harith-ibn-qais-ibn-hayshah-al-awsi',
      'people/umayr-ibn-saad-al-ansari.relations.FATHER: unknown person abd-al-rahman-ibn-umayr-ibn-saad',
    ];
    expect(issues.map((issue) => `${issue.path}: ${issue.message}`)).toEqual(withoutProfile);
  });

  // A claim may back a whole sentence (no field) or one value; a count never rests on a claim stating another value.
  it('never cites a battle count with a claim about a different value', () => {
    const counted = catalog.battles.flatMap((battle) =>
      COUNTS.flatMap((column) =>
        keysOf((battle.fields as Record<string, Cited<number> | undefined> | undefined)?.[column]?.claims).map((key) => ({
          at: `battles/${battle.slug}.${column}`, column, key,
        })),
      ),
    );

    expect(counted.length).toBeGreaterThan(0);
    expect(counted.filter(({ column, key }) => { const field = claimByKey.get(key)?.field; return field && field !== column; })).toEqual([]);
  });

  // A competing figure is evidence, not noise: it stays in its batch, marked
  // DISPUTED, and no count takes it.
  it('keeps every count figure no battle takes as a DISPUTED claim', () => {
    const taken = new Set(
      catalog.battles.flatMap((battle) =>
        COUNTS.flatMap((column) => keysOf((battle.fields as Record<string, Cited<number> | undefined> | undefined)?.[column]?.claims)),
      ),
    );
    const untaken = claims.filter((claim) => claim.field && COUNTS.includes(claim.field) && !taken.has(claim.key));

    expect(untaken.length).toBeGreaterThan(0);
    expect(untaken.filter((claim) => claim.confidence !== 'DISPUTED').map((claim) => claim.key)).toEqual([]);
  });
});
