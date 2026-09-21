import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Provenance } from '@/lib/catalog/types';

// Checked against the batches themselves, so editing either side alone fails.
const batchesRoot = 'data/history/batches';
const batches = readdirSync(batchesRoot).map((dir) => ({
  dir,
  ...(JSON.parse(readFileSync(join(batchesRoot, dir, 'batch.json'), 'utf8')) as {
    claims: { key: string; subjectKind: string; subjectSlug: string }[];
    accounts: { subjectKind: string; subjectSlug: string }[];
  }),
}));
const declared = new Set(batches.flatMap((batch) => batch.claims.map((claim) => claim.key)));

function modules(kind: string) {
  return readdirSync(join('data/catalog', kind))
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
    .map((file) => `${kind}/${file}`);
}

const paths = [...modules('people'), ...modules('battles'), ...modules('events'), ...modules('utterances')];

/** Every `claims` array anywhere in a module, however deeply nested. */
function provenances(node: unknown, where: string): [string, Provenance][] {
  if (Array.isArray(node)) return node.flatMap((item, i) => provenances(item, `${where}[${i}]`));
  if (node === null || typeof node !== 'object') return [];

  return Object.entries(node).flatMap(([key, value]) =>
    key === 'claims' ? [[where, value as Provenance]] : provenances(value, `${where}.${key}`),
  );
}

describe('every catalog module', () => {
  it.each(paths)('%s cites only claims a batch declares', async (path) => {
    const loaded = (await import(`./${path.replace(/\.ts$/, '')}`)).default;
    const cited = provenances(loaded, path);

    expect(cited.length).toBeGreaterThan(0);
    const unknown = cited.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !declared.has(key)).map((key) => `${where}: ${key}`),
    );
    expect(unknown).toEqual([]);
  });

  // A batch reads an entry about someone; the catalog is where what it found
  // ends up. A batch whose focal subject has no module never landed.
  it.each(batches.map((batch) => batch.dir))('%s has a module for the person its account covers', (dir) => {
    const batch = batches.find((candidate) => candidate.dir === dir)!;
    const people = batch.accounts.filter((account) => account.subjectKind === 'PERSON');

    expect(people.length).toBeGreaterThan(0);
    people.forEach((account) => expect(paths).toContain(`people/${account.subjectSlug}.ts`));
  });
});
