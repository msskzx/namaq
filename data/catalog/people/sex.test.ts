import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SEXES, type CatalogPerson } from '@/lib/catalog/types';

const people = await Promise.all(
  readdirSync('data/catalog/people')
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    .map(async (name) => (await import(`./${name.slice(0, -3)}`)).default as CatalogPerson),
);

describe('sex across the catalog', () => {
  it('records a known sex for every catalog person', () => {
    const missing = people.filter((person) => !person.fields.sex).map((person) => person.slug);
    expect(missing).toEqual([]);

    const unknown = people
      .filter((person) => !SEXES.includes(person.fields.sex.value))
      .map((person) => person.slug);
    expect(unknown).toEqual([]);
  });

  it('marks every sex claim as either cited or legacy evidence debt', () => {
    const missing = people
      .filter((person) => !person.fields.sex.claims)
      .map((person) => person.slug);

    expect(missing).toEqual([]);
  });
});
