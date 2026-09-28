import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SEXES, legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const people = await Promise.all(
  readdirSync('data/catalog/people')
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    .map(async (name) => (await import(`./${name.slice(0, -3)}`)).default as CatalogPerson),
);

describe('sex across the catalog', () => {
  it('records MALE or FEMALE for all 595 catalog people', () => {
    expect(people).toHaveLength(595);

    const missing = people.filter((person) => !person.fields.sex).map((person) => person.slug);
    expect(missing).toEqual([]);

    const unknown = people
      .filter((person) => !SEXES.includes(person.fields.sex.value))
      .map((person) => person.slug);
    expect(unknown).toEqual([]);
  });

  it('keeps source-backed claims cited and the rest as legacy evidence debt', () => {
    const cited = people.filter((person) => person.fields.sex.claims !== legacyUnreviewed);
    const legacy = people.filter((person) => person.fields.sex.claims === legacyUnreviewed);

    expect(cited).toHaveLength(38);
    expect(legacy).toHaveLength(557);
  });
});
