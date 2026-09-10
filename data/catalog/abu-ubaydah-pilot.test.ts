import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Provenance } from '@/lib/catalog/types';

// Every module authored from the pilot batch, checked against that batch
// rather than a fixture, so editing one alone fails.
const batch = JSON.parse(
  readFileSync('data/history/batches/abu-ubaydah-pilot/batch.json', 'utf8'),
) as { claims: { key: string }[] };
const declared = new Set(batch.claims.map((claim) => claim.key));

function modules(kind: string) {
  return readdirSync(join('data/catalog', kind))
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
    .map((file) => `${kind}/${file}`);
}

const paths = [...modules('people'), ...modules('battles'), ...modules('events')];

/** Every `claims` array anywhere in a module, however deeply nested. */
function provenances(node: unknown, where: string): [string, Provenance][] {
  if (Array.isArray(node)) return node.flatMap((item, i) => provenances(item, `${where}[${i}]`));
  if (node === null || typeof node !== 'object') return [];

  return Object.entries(node).flatMap(([key, value]) =>
    key === 'claims' ? [[where, value as Provenance]] : provenances(value, `${where}.${key}`),
  );
}

describe('catalog modules authored from the Abu Ubaydah pilot', () => {
  it('covers the person, the battles the entry places him at, and its two new events', () => {
    expect(paths).toContain('people/abu-ubaydah-ibn-al-jarrah.ts');
    expect(modules('battles')).toHaveLength(5);
    expect(modules('events')).toHaveLength(2);
  });

  it.each(paths)('%s cites only claims the batch declares', async (path) => {
    const loaded = (await import(`./${path.replace(/\.ts$/, '')}`)).default;
    const cited = provenances(loaded, path);

    expect(cited.length).toBeGreaterThan(0);
    const unknown = cited.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !declared.has(key)).map((key) => `${where}: ${key}`),
    );
    expect(unknown).toEqual([]);
  });

  it('keeps the event year and the person death year on the same claim', async () => {
    const person = (await import('./people/abu-ubaydah-ibn-al-jarrah')).default;
    const plague = (await import('./events/plague-of-amwas')).default;

    expect(plague.fields.hijriYear?.claims).toEqual(person.fields.deathYearHijri?.claims);
  });
});
